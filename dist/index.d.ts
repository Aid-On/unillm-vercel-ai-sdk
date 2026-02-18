/**
 * @aid-on/unillm-vercel-ai-sdk
 *
 * Vercel AI SDK wrapper for @aid-on/unillm
 * Provides LanguageModelV1 compatibility for existing AI SDK codebases
 *
 * @example
 * ```typescript
 * import { getModel } from "@aid-on/unillm-vercel-ai-sdk";
 * import { generateText } from "ai";
 *
 * const model = getModel("groq:llama-3.1-8b-instant", {
 *   groqApiKey: process.env.GROQ_API_KEY,
 * });
 *
 * const result = await generateText({
 *   model,
 *   prompt: "Hello!",
 * });
 * ```
 */
export type { ProviderType, GroqModel, GeminiModel, CloudflareModel, AnyModel, ModelSpec, ParsedModelSpec, Credentials, ModelInfo, } from "@aid-on/unillm";
export { parseModelSpec, createModelSpec, hasCredentials, getCredentialsFromEnv, getModelInfo, getModelsByProvider, getAllSpecs, getRecommendedModels, isValidSpec, } from "@aid-on/unillm";
export { LLMProviderError, wrapError, isLLMError, isRetryable, isRetryableCode, } from "@aid-on/unillm";
export type { LLMErrorCode } from "@aid-on/unillm";
export { withRetry, withRetryResult, createRetryWrapper, } from "@aid-on/unillm";
export type { RetryConfig, RetryResult } from "@aid-on/unillm";
export { generateObject, extractJSON, } from "@aid-on/unillm";
export type { GenerateObjectOptions, GenerateObjectResult, } from "@aid-on/unillm";
export { getModel, createFallbackChain } from "./wrapper.js";
export type { FallbackChainOptions } from "./wrapper.js";
//# sourceMappingURL=index.d.ts.map