import { afterEach, describe, expect, it, vi } from "vitest";
import { track } from "./analytics";

describe("track", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it("records events when crypto.randomUUID is unavailable", () => {
    vi.stubGlobal("crypto", {});

    expect(() => track("landing_viewed")).not.toThrow();

    const events = JSON.parse(window.localStorage.getItem("life-match:events") ?? "[]");
    expect(events).toHaveLength(1);
    expect(events[0].event_id).toMatch(/^[a-z0-9]+-[a-z0-9]+$/);
  });
});
