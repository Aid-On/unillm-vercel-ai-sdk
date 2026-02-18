"use strict";
/**
 * Vercel AI SDK LanguageModelV1 wrapper
 *
 * Wraps @aid-on/unillm's edge-native functions to provide AI SDK compatibility
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModel = getModel;
exports.createFallbackChain = createFallbackChain;
// import { parseModelSpec } from "@aid-on/unillm";
// =============================================================================
// AI SDK LanguageModelV1 Wrapper
// =============================================================================
/**
 * Get a Vercel AI SDK LanguageModelV1 instance from a ModelSpec
 *
 * @example
 * ```typescript
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
function getModel(_spec, _credentials) {
    // TODO: Re-enable when external dependencies are available
    throw new Error("getModel is temporarily disabled - external AI SDK dependencies not available");
    // const { provider, model } = parseModelSpec(spec);
    // ... implementation will be restored when dependencies are added
}
/**
 * Create a fallback chain for multiple models (AI SDK compatible)
 */
function createFallbackChain(_options) {
    // TODO: Re-enable when external dependencies are available
    throw new Error("createFallbackChain is temporarily disabled - external AI SDK dependencies not available");
    // const { models, credentials } = options;
    // return models.map(model => getModel(model, credentials));
}
//# sourceMappingURL=wrapper.js.map