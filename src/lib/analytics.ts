const allowedEvents = new Set([
  "landing_viewed", "onboarding_started", "question_answered", "free_text_submitted",
  "onboarding_completed", "recommendations_generated", "recommendation_impression",
  "city_opened", "city_saved", "city_unsaved", "comparison_started",
  "comparison_city_added", "preference_refined", "result_shared",
  "city_rejected", "match_feedback_submitted", "email_capture_submitted",
]);

export function track(event: string, properties: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined" || !allowedEvents.has(event)) return;
  const record = { event_id: crypto.randomUUID(), event, occurred_at: new Date().toISOString(), properties };
  const existing = JSON.parse(window.localStorage.getItem("life-match:events") ?? "[]") as unknown[];
  window.localStorage.setItem("life-match:events", JSON.stringify([...existing.slice(-499), record]));
  window.dispatchEvent(new CustomEvent("life-match:event", { detail: record }));
}

export function clearLocalData() {
  for (const key of Object.keys(window.localStorage)) if (key.startsWith("life-match:")) window.localStorage.removeItem(key);
}
