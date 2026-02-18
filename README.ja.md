# @aid-on/unillm-vercel-ai-sdk

<div align="center">

[![npm version](https://img.shields.io/npm/v/@aid-on/unillm-vercel-ai-sdk.svg?style=flat-square&color=00DC82)](https://www.npmjs.com/package/@aid-on/unillm-vercel-ai-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

<br />

<h3><b>unillm-vercel-ai-sdk</b> - Edge-Native LLMのためのAI SDK互換レイヤー</h3>
<p align="center"><b>エッジネイティブとエコシステムの架け橋。</b><br/>@aid-on/unillm用のVercel AI SDKラッパー。LanguageModelV1互換インターフェースを提供します。</p>

<br/>

**日本語** | [**English**](./README.md)

<br/>

</div>

## 目的

このパッケージは、エッジネイティブな `@aid-on/unillm` ライブラリをラップし、Vercel AI SDKとの互換性を提供します。以下のケースで使用してください:

- **既存のAI SDKコードを移行** - エッジネイティブアーキテクチャへの段階的移行
- **LanguageModelV1インターフェースが必要** - AI SDKエコシステムとの互換性維持
- **エッジ最適化が必要** - 既存のAI SDKコードを書き直さずに高速化

新規プロジェクトの場合は、より高いエッジパフォーマンスを得るために `@aid-on/unillm` の直接使用を検討してください。

## インストール

```bash
npm install @aid-on/unillm-vercel-ai-sdk
```

## 使い方

AI SDKプロバイダーのドロップイン代替:

```typescript
// Before（AI SDKプロバイダーを直接使用）
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });
const model = groq("llama-3.1-8b-instant");

// After（unillmラッパーを使用）
import { getModel } from "@aid-on/unillm-vercel-ai-sdk";
import { generateText } from "ai";

const model = getModel("groq:llama-3.1-8b-instant", {
  groqApiKey: process.env.GROQ_API_KEY,
});

// 既存のAI SDK呼び出しはそのまま動作
const result = await generateText({
  model,
  prompt: "Hello!",
});
```

## マルチプロバイダー対応

```typescript
import { getModel, createFallbackChain } from "@aid-on/unillm-vercel-ai-sdk";
import { generateText } from "ai";

// 全プロバイダーで統一されたインターフェース
const groqModel = getModel("groq:llama-3.1-8b-instant", credentials);
const geminiModel = getModel("gemini:gemini-2.0-flash", credentials);
const cloudflareModel = getModel("cloudflare:@cf/meta/llama-3.3-70b-instruct-fp8-fast", credentials);

// フォールバックチェーン
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

## 対応モデル

`@aid-on/unillm` の全モデルに対応:

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

## 移行ガイド

### 個別AI SDKプロバイダーからの移行

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

### 移行のメリット

- **統一インターフェース** - 全プロバイダーで共通のAPI
- **エッジ最適化** - WebStreams対応
- **メモリ効率** - エッジ環境向けに最適化
- **組み込みリトライ** - 指数バックオフ付き自動リトライ
- **構造化出力** - Zodバリデーション対応
- **統一的エラーハンドリング** - プロバイダー間で一貫したエラー処理

## 高度な機能

`@aid-on/unillm` の全高度機能が利用可能:

```typescript
import {
  generateObject,
  withRetry,
} from "@aid-on/unillm-vercel-ai-sdk";

// 構造化出力
const result = await generateObject({
  model: "groq:llama-3.1-8b-instant",
  credentials,
  schema: z.object({ name: z.string() }),
  prompt: "Generate a person",
});

// リトライロジック
const retryResult = await withRetry(
  () => generateText({ model, prompt }),
  { maxAttempts: 3 }
);
```

## APIリファレンス

### ラッパー関数

| エクスポート | 説明 |
|-------------|------|
| `getModel(spec, credentials)` | モデルスペックからLanguageModelV1インスタンスを作成 |
| `createFallbackChain(options)` | 複数プロバイダー間のフォールバックチェーンを作成 |

### @aid-on/unillmからの再エクスポート

| エクスポート | 説明 |
|-------------|------|
| `parseModelSpec` | モデルスペック文字列をプロバイダーとモデルにパース |
| `createModelSpec` | プロバイダーとモデルからモデルスペックを作成 |
| `hasCredentials` | プロバイダーの認証情報の有無を確認 |
| `getCredentialsFromEnv` | 環境変数から認証情報を取得 |
| `getModelInfo` | モデルのメタデータを取得 |
| `getModelsByProvider` | プロバイダーのモデル一覧を取得 |
| `getAllSpecs` | 利用可能な全モデルスペックを取得 |
| `getRecommendedModels` | 推奨モデルを取得 |
| `isValidSpec` | モデルスペック文字列を検証 |
| `generateObject` | スキーマバリデーション付き構造化出力を生成 |
| `extractJSON` | LLMレスポンステキストからJSONを抽出 |
| `withRetry` | 指数バックオフ付きリトライラッパー |
| `withRetryResult` | 詳細結果を返すリトライラッパー |
| `createRetryWrapper` | 再利用可能なリトライラッパーを作成 |
| `LLMProviderError` | LLMプロバイダーエラークラス |
| `wrapError` | エラーをLLMProviderErrorとしてラップ |
| `isLLMError` | LLMProviderErrorの型ガード |
| `isRetryable` | エラーがリトライ可能かチェック |
| `isRetryableCode` | エラーコードがリトライ可能かチェック |

## パフォーマンス比較

| 機能 | @aid-on/unillm | @aid-on/unillm-vercel-ai-sdk |
|------|----------------|------------------------------|
| バンドルサイズ | ~50KB | ~200KB+（AI SDK含む） |
| コールドスタート | ~10ms | ~50ms+ |
| メモリ使用量 | 最小限 | やや多い（AI SDKオーバーヘッド） |
| エッジ最適化 | ネイティブ | 互換 |
| AI SDK互換性 | なし | 完全対応 |

## 関連パッケージ

- **[@aid-on/unillm](../unillm)** - エッジネイティブコアライブラリ（AI SDK依存なし）
- **[@aid-on/unillm-vercel-ai-sdk](.)** - AI SDK互換ラッパー（このパッケージ）

## ライセンス

MIT
