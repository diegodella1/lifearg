import { eventNames, type EventName, type EventProperties } from "./events";
import { readStoredJson, writeStoredJson } from "./storage";

const allowedEvents = new Set<string>(eventNames);
const consentKey = "life-match:analytics-consent";
export const consentPolicyVersion = "2026-08-01";

function createEventId() {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export function analyticsConsent() {
  return readStoredJson<boolean | null>(consentKey, null);
}

export function setAnalyticsConsent(value: boolean) {
  writeStoredJson(consentKey, value);
  if (typeof window !== "undefined") {
    void fetch("/api/consent", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ purpose: "analytics", granted: value, policyVersion: consentPolicyVersion }) }).catch(() => undefined);
  }
}

export function track(event: EventName, properties: EventProperties = {}) {
  if (typeof window === "undefined" || !allowedEvents.has(event)) return;
  const record = { event_id: createEventId(), event, occurred_at: new Date().toISOString(), properties };
  const existing = readStoredJson<unknown[]>("life-match:events", []);
  writeStoredJson("life-match:events", [...existing.slice(-499), record]);
  window.dispatchEvent(new CustomEvent("life-match:event", { detail: record }));
  if (analyticsConsent() === true) {
    const sessionId = readStoredJson<string | null>("life-match:session-id", null);
    void fetch("/api/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      keepalive: true,
      body: JSON.stringify({ sessionId, consentScope: "analytics", consentPolicyVersion, events: [{ eventId: record.event_id, event, occurredAt: record.occurred_at, properties }] }),
    }).catch(() => undefined);
  }
}

export function clearLocalData() {
  for (const key of Object.keys(window.localStorage)) {
    if (key.startsWith("life-match:") && key !== consentKey) window.localStorage.removeItem(key);
  }
}
