/**
 * Vercel AI SDK LanguageModelV1 wrapper
 *
 * Wraps @aid-on/unillm's edge-native functions to provide AI SDK compatibility
 */
import type { LanguageModelV1 } from "ai";
import type { ModelSpec, Credentials } from "@aid-on/unillm";
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
export declare function getModel(_spec: ModelSpec | string, _credentials: Credentials): LanguageModelV1;
export interface FallbackChainOptions {
    /** Model specs in order of preference */
    models: ModelSpec[];
    /** Credentials for all providers */
    credentials: Credentials;
    /** Called when falling back to next model */
    onFallback?: (error: Error, modelSpec: ModelSpec, attempt: number) => void;
    /** Maximum attempts per model (default: 1) */
    maxAttemptsPerModel?: number;
    /** Overall timeout in milliseconds */
    timeoutMs?: number;
}
/**
 * Create a fallback chain for multiple models (AI SDK compatible)
 */
export declare function createFallbackChain(_options: FallbackChainOptions): LanguageModelV1[];
//# sourceMappingURL=wrapper.d.ts.map