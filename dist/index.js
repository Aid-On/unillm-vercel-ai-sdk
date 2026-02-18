"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFallbackChain = exports.getModel = exports.extractJSON = exports.generateObject = exports.createRetryWrapper = exports.withRetryResult = exports.withRetry = exports.isRetryableCode = exports.isRetryable = exports.isLLMError = exports.wrapError = exports.LLMProviderError = exports.isValidSpec = exports.getRecommendedModels = exports.getAllSpecs = exports.getModelsByProvider = exports.getModelInfo = exports.getCredentialsFromEnv = exports.hasCredentials = exports.createModelSpec = exports.parseModelSpec = void 0;
// Re-export core functions from unillm
var unillm_1 = require("@aid-on/unillm");
Object.defineProperty(exports, "parseModelSpec", { enumerable: true, get: function () { return unillm_1.parseModelSpec; } });
Object.defineProperty(exports, "createModelSpec", { enumerable: true, get: function () { return unillm_1.createModelSpec; } });
Object.defineProperty(exports, "hasCredentials", { enumerable: true, get: function () { return unillm_1.hasCredentials; } });
Object.defineProperty(exports, "getCredentialsFromEnv", { enumerable: true, get: function () { return unillm_1.getCredentialsFromEnv; } });
Object.defineProperty(exports, "getModelInfo", { enumerable: true, get: function () { return unillm_1.getModelInfo; } });
Object.defineProperty(exports, "getModelsByProvider", { enumerable: true, get: function () { return unillm_1.getModelsByProvider; } });
Object.defineProperty(exports, "getAllSpecs", { enumerable: true, get: function () { return unillm_1.getAllSpecs; } });
Object.defineProperty(exports, "getRecommendedModels", { enumerable: true, get: function () { return unillm_1.getRecommendedModels; } });
Object.defineProperty(exports, "isValidSpec", { enumerable: true, get: function () { return unillm_1.isValidSpec; } });
// Re-export error handling from unillm
var unillm_2 = require("@aid-on/unillm");
Object.defineProperty(exports, "LLMProviderError", { enumerable: true, get: function () { return unillm_2.LLMProviderError; } });
Object.defineProperty(exports, "wrapError", { enumerable: true, get: function () { return unillm_2.wrapError; } });
Object.defineProperty(exports, "isLLMError", { enumerable: true, get: function () { return unillm_2.isLLMError; } });
Object.defineProperty(exports, "isRetryable", { enumerable: true, get: function () { return unillm_2.isRetryable; } });
Object.defineProperty(exports, "isRetryableCode", { enumerable: true, get: function () { return unillm_2.isRetryableCode; } });
// Re-export retry logic from unillm
var unillm_3 = require("@aid-on/unillm");
Object.defineProperty(exports, "withRetry", { enumerable: true, get: function () { return unillm_3.withRetry; } });
Object.defineProperty(exports, "withRetryResult", { enumerable: true, get: function () { return unillm_3.withRetryResult; } });
Object.defineProperty(exports, "createRetryWrapper", { enumerable: true, get: function () { return unillm_3.createRetryWrapper; } });
// Re-export structured output from unillm
var unillm_4 = require("@aid-on/unillm");
Object.defineProperty(exports, "generateObject", { enumerable: true, get: function () { return unillm_4.generateObject; } });
Object.defineProperty(exports, "extractJSON", { enumerable: true, get: function () { return unillm_4.extractJSON; } });
// Export AI SDK wrapper functions
var wrapper_js_1 = require("./wrapper.js");
Object.defineProperty(exports, "getModel", { enumerable: true, get: function () { return wrapper_js_1.getModel; } });
Object.defineProperty(exports, "createFallbackChain", { enumerable: true, get: function () { return wrapper_js_1.createFallbackChain; } });
//# sourceMappingURL=index.js.map