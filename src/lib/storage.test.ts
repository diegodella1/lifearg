import { beforeEach, describe, expect, it, vi } from "vitest";
import { readStoredJson, writeStoredJson } from "./storage";

describe("safe storage", () => {
  beforeEach(() => window.localStorage.clear());

  it("removes corrupt JSON and returns fallback", () => {
    window.localStorage.setItem("broken", "{");
    expect(readStoredJson("broken", ["fallback"])).toEqual(["fallback"]);
    expect(window.localStorage.getItem("broken")).toBeNull();
  });

  it("does not crash when storage writes fail", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementationOnce(() => { throw new DOMException("quota"); });
    expect(writeStoredJson("key", { ok: true })).toBe(false);
  });
});
