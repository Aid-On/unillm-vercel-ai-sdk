/**
 * パッケージ契約テスト。
 *
 * 本パッケージの現在の価値は (1) @aid-on/unillm の API 面の再エクスポート、
 * (2) AI SDK ラッパー（外部依存待ちで停止中）の 2 つ。
 * (1) は解決可能性と関数の実体を検証し、(2) は「停止中」という契約をピン留めする
 * （依存を復activateしたらこのテストが落ちて、テスト更新を強制する）。
 */
import { describe, it, expect } from "vitest";
import {
  parseModelSpec,
  createModelSpec,
  isValidSpec,
  isRetryableCode,
  withRetry,
  extractJSON,
  LLMProviderError,
  getModel,
  createFallbackChain,
} from "../src/index.js";

describe("unillm 再エクスポート面", () => {
  it("spec ユーティリティが unillm 実体として動く", () => {
    expect(createModelSpec("groq", "llama-3.1-8b-instant")).toBe("groq:llama-3.1-8b-instant");
    expect(parseModelSpec("gemini:gemini-2.5-flash")).toEqual({
      provider: "gemini",
      model: "gemini-2.5-flash",
      spec: "gemini:gemini-2.5-flash",
    });
    expect(isValidSpec("gemini:gemini-2.5-flash")).toBe(true);
    expect(isValidSpec("openai:gpt-99")).toBe(false);
  });

  it("エラー/リトライ面が動く", async () => {
    expect(isRetryableCode("RATE_LIMIT")).toBe(true);
    expect(isRetryableCode("AUTH")).toBe(false);
    const err = new LLMProviderError({ message: "x", code: "RATE_LIMIT", provider: "groq" });
    expect(err).toBeInstanceOf(Error);
    expect(err.code).toBe("RATE_LIMIT");

    let calls = 0;
    const result = await withRetry(async () => {
      calls++;
      if (calls < 2) throw new LLMProviderError({ message: "flaky", code: "NETWORK", provider: "groq" });
      return "ok";
    }, { maxRetries: 2, baseDelay: 1 });
    expect(result).toBe("ok");
    expect(calls).toBe(2);
  });

  it("extractJSON がコードブロックから JSON を取り出す", () => {
    expect(extractJSON('```json\n{"a":1}\n```')).toEqual({ a: 1 });
  });
});

describe("AI SDK ラッパー（外部依存待ちで停止中）", () => {
  it("getModel / createFallbackChain は停止中エラーを投げる（復活時はテスト要更新）", () => {
    expect(() => getModel("groq:llama-3.1-8b-instant", {})).toThrow(/temporarily disabled/);
    expect(() =>
      createFallbackChain({ models: ["groq:llama-3.1-8b-instant"], credentials: {} }),
    ).toThrow(/temporarily disabled/);
  });
});
