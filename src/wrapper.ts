/**
 * Vercel AI SDK LanguageModelV1 wrapper
 *
 * Wraps @aid-on/unillm's edge-native functions to provide AI SDK compatibility
 */

// TODO: Re-enable when dependencies are available
// import { createGroq } from "@ai-sdk/groq";
// import { createGoogleGenerativeAI } from "@ai-sdk/google";
// import { createWorkersAI } from "workers-ai-provider";
import type { LanguageModelV1 } from "ai";
import type {
  ModelSpec,
  // ParsedModelSpec,
  // ProviderType,
  Credentials,
  // CloudflareModel,
} from "@aid-on/unillm";
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
export function getModel(_spec: ModelSpec | string, _credentials: Credentials): LanguageModelV1 {
  // TODO: Re-enable when external dependencies are available
  throw new Error("getModel is temporarily disabled - external AI SDK dependencies not available");
  
  // const { provider, model } = parseModelSpec(spec);
  // ... implementation will be restored when dependencies are added
}

// =============================================================================
// Fallback Chain (AI SDK compatible)
// =============================================================================

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
export function createFallbackChain(_options: FallbackChainOptions): LanguageModelV1[] {
  // TODO: Re-enable when external dependencies are available
  throw new Error("createFallbackChain is temporarily disabled - external AI SDK dependencies not available");
  
  // const { models, credentials } = options;
  // return models.map(model => getModel(model, credentials));
}