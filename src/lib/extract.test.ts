import { afterEach, describe, expect, it } from "vitest";
import { extractLocally, extractPreferences } from "./extract";

describe("preference extraction", () => {
  const originalKey = process.env.OPENAI_API_KEY;

  afterEach(() => {
    if (originalKey) process.env.OPENAI_API_KEY = originalKey;
    else delete process.env.OPENAI_API_KEY;
  });

  it("extracts only explicit supported preferences", () => {
    const result = extractLocally("Quiero naturaleza, caminar sin auto y clima fresco");
    expect(result.preferences.map((item) => item.factor)).toEqual(["nature", "walkability", "climate"]);
    expect(result.preferences.every((item) => item.confidence === 0.72)).toBe(true);
  });

  it("uses local mode when no LLM key is configured", async () => {
    delete process.env.OPENAI_API_KEY;
    const result = await extractPreferences("Necesito internet para trabajo remoto");
    expect(result.mode).toBe("local");
    expect(result.preferences[0]?.factor).toBe("connectivity");
  });

  it("keeps text local unless AI processing was explicitly accepted", async () => {
    process.env.OPENAI_API_KEY = "configured-but-not-authorized";

    const result = await extractPreferences("Necesito internet para trabajo remoto");

    expect(result.mode).toBe("local");
  });

  it("returns no inferred preferences for unrelated text", () => {
    expect(extractLocally("Todavía no sé qué busco").preferences).toEqual([]);
  });
});
