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
// Re-export core functions from unillm
export { parseModelSpec, createModelSpec, hasCredentials, getCredentialsFromEnv, getModelInfo, getModelsByProvider, getAllSpecs, getRecommendedModels, isValidSpec, } from "@aid-on/unillm";
// Re-export error handling from unillm
export { LLMProviderError, wrapError, isLLMError, isRetryable, isRetryableCode, } from "@aid-on/unillm";
// Re-export retry logic from unillm
export { withRetry, withRetryResult, createRetryWrapper, } from "@aid-on/unillm";
// Re-export structured output from unillm
export { generateObject, extractJSON, } from "@aid-on/unillm";
// Export AI SDK wrapper functions
export { getModel, createFallbackChain } from "./wrapper.js";
//# sourceMappingURL=index.js.map