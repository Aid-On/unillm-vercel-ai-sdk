# @aid-on/unillm-vercel-ai-sdk

<div align="center">

[![npm version](https://img.shields.io/npm/v/@aid-on/unillm-vercel-ai-sdk.svg?style=flat-square&color=00DC82)](https://www.npmjs.com/package/@aid-on/unillm-vercel-ai-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

<br />

<h3><b>unillm-vercel-ai-sdk</b> - AI SDK Compatibility for Edge-Native LLM</h3>
<p align="center"><b>Bridge the gap between edge-native and ecosystem.</b><br/>Vercel AI SDK wrapper for @aid-on/unillm with LanguageModelV1 compatibility.</p>

<br/>

[**日本語**](./README.ja.md) | **English**

<br/>

</div>

## Purpose

This package wraps the edge-native `@aid-on/unillm` library to provide Vercel AI SDK compatibility. Use this when:

- **Migrating existing AI SDK code** to edge-native architecture
- **Need LanguageModelV1 interface** for compatibility with AI SDK ecosystem
- **Want edge optimization** without rewriting all your AI SDK calls

For new projects, consider using `@aid-on/unillm` directly for better edge performance.

## Installation

```bash
npm install @aid-on/unillm-vercel-ai-sdk
```

## Usage

Drop-in replacement for AI SDK providers:

```typescript
// Before (using AI SDK providers directly)
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });
const model = groq("llama-3.1-8b-instant");

// After (using unillm wrapper)
import { getModel } from "@aid-on/unillm-vercel-ai-sdk";
import { generateText } from "ai";

const model = getModel("groq:llama-3.1-8b-instant", {
  groqApiKey: process.env.GROQ_API_KEY,
});

// Same AI SDK calls work unchanged
const result = await generateText({
  model,
  prompt: "Hello!",
});
```

## Multi-Provider Support

```typescript
import { getModel, createFallbackChain } from "@aid-on/unillm-vercel-ai-sdk";
import { generateText } from "ai";

// Unified interface for all providers
const groqModel = getModel("groq:llama-3.1-8b-instant", credentials);
const geminiModel = getModel("gemini:gemini-2.0-flash", credentials);
const cloudflareModel = getModel("cloudflare:@cf/meta/llama-3.3-70b-instruct-fp8-fast", credentials);

// Fallback chain
const chain = createFallbackChain({
  models: [
    "groq:llama-3.1-8b-instant",
    "gemini:gemini-2.0-flash",
  ],
  credentials,
});

const result = await chain.generate(async (model) => {
  return generateText({ model, prompt: "Hello" });
});
```

## Supported Models

All models from `@aid-on/unillm`:

### Groq
- `groq:llama-3.1-8b-instant`
- `groq:llama-3.3-70b-versatile`
- `groq:openai/gpt-oss-120b`
- `groq:openai/gpt-oss-20b`

### Gemini
- `gemini:gemini-2.0-flash`
- `gemini:gemini-2.0-flash-exp`

### Cloudflare Workers AI
- `cloudflare:@cf/meta/llama-3.3-70b-instruct-fp8-fast`
- `cloudflare:@cf/meta/llama-3.1-8b-instruct`
- `cloudflare:@cf/openai/gpt-oss-120b`
- `cloudflare:@cf/openai/gpt-oss-20b`

## Migration Guide

### From Individual AI SDK Providers

```typescript
// Before
import { createGroq } from "@ai-sdk/groq";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const groq = createGroq({ apiKey: "..." });
const google = createGoogleGenerativeAI({ apiKey: "..." });

// After
import { getModel } from "@aid-on/unillm-vercel-ai-sdk";

const groqModel = getModel("groq:llama-3.1-8b-instant", { groqApiKey: "..." });
const geminiModel = getModel("gemini:gemini-2.0-flash", { geminiApiKey: "..." });
```

### Benefits of Migration

- **Unified interface** across all providers
- **Edge-optimized** WebStreams support
- **Memory efficient** for edge environments
- **Built-in retry logic** with exponential backoff
- **Structured output** with Zod validation
- **Consistent error handling** across providers

## Advanced Features

All advanced features from `@aid-on/unillm` are available:

```typescript
import {
  generateObject,
  withRetry,
} from "@aid-on/unillm-vercel-ai-sdk";

// Structured output
const result = await generateObject({
  model: "groq:llama-3.1-8b-instant",
  credentials,
  schema: z.object({ name: z.string() }),
  prompt: "Generate a person",
});

// Retry logic
const retryResult = await withRetry(
  () => generateText({ model, prompt }),
  { maxAttempts: 3 }
);
```

## API Reference

### Wrapper Functions

| Export | Description |
|--------|------------|
| `getModel(spec, credentials)` | Create a LanguageModelV1 instance from a model spec |
| `createFallbackChain(options)` | Create a fallback chain across multiple providers |

### Re-exported from @aid-on/unillm

| Export | Description |
|--------|------------|
| `parseModelSpec` | Parse a model spec string into provider and model |
| `createModelSpec` | Create a model spec from provider and model |
| `hasCredentials` | Check if credentials are available for a provider |
| `getCredentialsFromEnv` | Get credentials from environment variables |
| `getModelInfo` | Get metadata for a model |
| `getModelsByProvider` | List models for a provider |
| `getAllSpecs` | Get all available model specs |
| `getRecommendedModels` | Get recommended models |
| `isValidSpec` | Validate a model spec string |
| `generateObject` | Generate structured output with schema validation |
| `extractJSON` | Extract JSON from LLM response text |
| `withRetry` | Retry wrapper with exponential backoff |
| `withRetryResult` | Retry wrapper returning detailed result |
| `createRetryWrapper` | Create a reusable retry wrapper |
| `LLMProviderError` | Error class for LLM provider errors |
| `wrapError` | Wrap an error as LLMProviderError |
| `isLLMError` | Type guard for LLMProviderError |
| `isRetryable` | Check if an error is retryable |
| `isRetryableCode` | Check if an error code is retryable |

## Performance Comparison

| Feature | @aid-on/unillm | @aid-on/unillm-vercel-ai-sdk |
|---------|----------------|------------------------------|
| Bundle size | ~50KB | ~200KB+ (includes AI SDK) |
| Cold start | ~10ms | ~50ms+ |
| Memory usage | Minimal | Higher (AI SDK overhead) |
| Edge optimization | Native | Compatible |
| AI SDK compatibility | No | Full |

## Related Packages

- **[@aid-on/unillm](../unillm)** - Edge-native core library (no AI SDK dependency)
- **[@aid-on/unillm-vercel-ai-sdk](.)** - AI SDK compatibility wrapper (this package)

## License

MIT
