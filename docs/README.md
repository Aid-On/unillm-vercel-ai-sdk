# @aid-on/unillm-vercel-ai-sdk

## 概要

`@aid-on/unillm-vercel-ai-sdk`は、@aid-on/unillmをVercel AI SDKのLanguageModelV1インターフェースでラップしたライブラリです。既存のAI SDKコードを変更することなく、unillmの統一LLMプロバイダー機能を利用できます。

## 主な特徴

- **LanguageModelV1互換**: Vercel AI SDK標準インターフェースの完全実装
- **unillm統合**: 全プロバイダー（Groq、OpenAI、Anthropic等）への統一アクセス
- **ドロップイン置換**: 既存AI SDKコードの無変更移行
- **型安全性**: TypeScriptによる完全な型サポート
- **ストリーミング対応**: リアルタイムテキスト生成
- **エラーハンドリング**: 統一されたエラー処理

## アーキテクチャ

### 互換レイヤー構成

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel AI     │    │   Compatibility │    │     unillm      │
│     SDK         │    │     Layer       │    │    Providers    │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ generateText()  │───►│ LanguageModelV1 │───►│ groq()          │
│ streamText()    │    │ Wrapper         │    │ openai()        │
│ generateObject()│    │                 │    │ anthropic()     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## APIリファレンス

### 基本的な使用方法

```typescript
import { createUnillmModel } from '@aid-on/unillm-vercel-ai-sdk';
import { generateText, streamText } from 'ai';

// unillmモデルの作成
const model = createUnillmModel({
  provider: 'groq',
  model: 'llama-3.3-70b-versatile'
});

// Vercel AI SDKの関数をそのまま使用
const { text } = await generateText({
  model,
  prompt: 'Hello, world!'
});

// ストリーミング
const { textStream } = await streamText({
  model,
  prompt: 'Tell me a story...'
});

for await (const textPart of textStream) {
  process.stdout.write(textPart);
}
```

### 複数プロバイダーの切り替え

```typescript
import { createUnillmModel } from '@aid-on/unillm-vercel-ai-sdk';
import { generateText } from 'ai';

// プロバイダー別モデル作成
const groqModel = createUnillmModel({
  provider: 'groq',
  model: 'llama-3.3-70b-versatile'
});

const openaiModel = createUnillmModel({
  provider: 'openai',
  model: 'gpt-4'
});

// 同じインターフェースで使用
async function generateWithFallback(prompt: string) {
  try {
    const { text } = await generateText({
      model: groqModel,
      prompt
    });
    return text;
  } catch (error) {
    // フォールバック
    const { text } = await generateText({
      model: openaiModel,
      prompt
    });
    return text;
  }
}
```

### 構造化出力

```typescript
import { createUnillmModel } from '@aid-on/unillm-vercel-ai-sdk';
import { generateObject } from 'ai';
import { z } from 'zod';

const model = createUnillmModel({
  provider: 'groq',
  model: 'llama-3.3-70b-versatile'
});

// 構造化スキーマ定義
const PersonSchema = z.object({
  name: z.string(),
  age: z.number(),
  occupation: z.string()
});

const { object } = await generateObject({
  model,
  schema: PersonSchema,
  prompt: 'Generate information about a fictional person'
});

console.log(object.name, object.age, object.occupation);
```

## 使用例

### 既存AI SDKコードの移行

```typescript
// 移行前 - Vercel AI SDKデフォルトモデル
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

const { text } = await generateText({
  model: openai('gpt-3.5-turbo'),
  prompt: 'Hello!'
});

// 移行後 - unillmを使用（コード変更最小限）
import { createUnillmModel } from '@aid-on/unillm-vercel-ai-sdk';
import { generateText } from 'ai';

const model = createUnillmModel({
  provider: 'groq',     // より高速・コスト効率的なプロバイダーに変更
  model: 'llama-3.3-70b-versatile'
});

const { text } = await generateText({
  model,  // モデル部分のみ変更
  prompt: 'Hello!'
});
```

### チャットボット実装

```typescript
// src/chatbot.ts
import { createUnillmModel } from '@aid-on/unillm-vercel-ai-sdk';
import { streamText, CoreMessage } from 'ai';

export class ChatBot {
  private model = createUnillmModel({
    provider: 'groq',
    model: 'llama-3.3-70b-versatile'
  });

  async *chat(messages: CoreMessage[]) {
    const { textStream } = await streamText({
      model: this.model,
      messages,
      system: 'You are a helpful AI assistant.',
      maxTokens: 1000,
      temperature: 0.7
    });

    for await (const textPart of textStream) {
      yield textPart;
    }
  }

  async generateSingleResponse(messages: CoreMessage[]) {
    const { text, usage } = await generateText({
      model: this.model,
      messages,
      maxTokens: 500
    });

    return {
      response: text,
      tokensUsed: usage?.totalTokens || 0
    };
  }
}

// 使用例
const bot = new ChatBot();

// ストリーミングチャット
const messages: CoreMessage[] = [
  { role: 'user', content: 'What is the capital of Japan?' }
];

for await (const chunk of bot.chat(messages)) {
  process.stdout.write(chunk);
}
```

### RAGシステム統合

```typescript
// src/rag-system.ts
import { createUnillmModel } from '@aid-on/unillm-vercel-ai-sdk';
import { generateText, embed } from 'ai';

export class RAGSystem {
  private chatModel = createUnillmModel({
    provider: 'groq',
    model: 'llama-3.3-70b-versatile'
  });

  private embeddingModel = createUnillmModel({
    provider: 'openai',
    model: 'text-embedding-3-small'
  });

  async query(question: string, documents: string[]) {
    // 1. 質問の埋め込み生成
    const { embedding } = await embed({
      model: this.embeddingModel,
      value: question
    });

    // 2. 関連文書の検索（簡略化）
    const relevantDocs = await this.searchSimilarDocuments(embedding, documents);

    // 3. コンテキストを含む回答生成
    const { text } = await generateText({
      model: this.chatModel,
      messages: [
        {
          role: 'system',
          content: `以下の文書を参考にして質問に答えてください：\n\n${relevantDocs.join('\n\n')}`
        },
        {
          role: 'user',
          content: question
        }
      ],
      maxTokens: 1000
    });

    return {
      answer: text,
      sources: relevantDocs,
      confidence: this.calculateConfidence(text)
    };
  }

  private async searchSimilarDocuments(queryEmbedding: number[], documents: string[]) {
    // 実際の実装では、ベクトル検索エンジン（Pinecone、Weaviate等）を使用
    // ここでは簡略化
    return documents.slice(0, 3);
  }

  private calculateConfidence(answer: string): number {
    // 信頼度計算のロジック（簡略化）
    return Math.min(answer.length / 500, 1.0);
  }
}
```

### マルチモーダルAI

```typescript
// src/multimodal-ai.ts
import { createUnillmModel } from '@aid-on/unillm-vercel-ai-sdk';
import { generateText } from 'ai';

export class MultimodalAI {
  private visionModel = createUnillmModel({
    provider: 'groq',
    model: 'llama-3.2-90b-vision'  // Vision対応モデル
  });

  private textModel = createUnillmModel({
    provider: 'groq',
    model: 'llama-3.3-70b-versatile'
  });

  async analyzeImage(imageUrl: string, question?: string) {
    const { text } = await generateText({
      model: this.visionModel,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: question || 'この画像について説明してください。' },
            { type: 'image', image: imageUrl }
          ]
        }
      ]
    });

    return text;
  }

  async imageToText(imageUrl: string) {
    return await this.analyzeImage(imageUrl, '画像の内容をテキストで詳しく説明してください。');
  }

  async generateImageDescription(imageUrl: string) {
    const description = await this.imageToText(imageUrl);
    
    // テキストモデルで説明を改善
    const { text: improvedDescription } = await generateText({
      model: this.textModel,
      messages: [
        {
          role: 'system',
          content: '画像の説明文をより読みやすく、詳細で魅力的な文章に改善してください。'
        },
        {
          role: 'user', 
          content: `元の説明：${description}`
        }
      ]
    });

    return {
      originalDescription: description,
      improvedDescription: improvedDescription
    };
  }
}

// 使用例
const multimodal = new MultimodalAI();

const analysis = await multimodal.analyzeImage(
  'https://example.com/image.jpg',
  '画像に写っているものの数と種類を教えてください。'
);

console.log('画像分析結果:', analysis);
```

### AI エージェントワークフロー

```typescript
// src/ai-agent-workflow.ts
import { createUnillmModel } from '@aid-on/unillm-vercel-ai-sdk';
import { generateText, generateObject } from 'ai';
import { z } from 'zod';

const TaskSchema = z.object({
  action: z.enum(['search', 'calculate', 'generate', 'summarize']),
  parameters: z.record(z.string()),
  priority: z.number()
});

const WorkflowSchema = z.object({
  tasks: z.array(TaskSchema),
  estimated_duration: z.number(),
  requires_human_approval: z.boolean()
});

export class AIAgent {
  private plannerModel = createUnillmModel({
    provider: 'groq',
    model: 'llama-3.3-70b-versatile'
  });

  private executorModel = createUnillmModel({
    provider: 'groq', 
    model: 'llama-3.3-70b-versatile'
  });

  async planWorkflow(userRequest: string) {
    const { object: workflow } = await generateObject({
      model: this.plannerModel,
      schema: WorkflowSchema,
      messages: [
        {
          role: 'system',
          content: 'あなたはタスク分解とワークフロー計画の専門家です。ユーザーのリクエストを実行可能なタスクに分解してください。'
        },
        {
          role: 'user',
          content: `リクエスト: ${userRequest}`
        }
      ]
    });

    return workflow;
  }

  async executeWorkflow(workflow: z.infer<typeof WorkflowSchema>) {
    const results = [];

    for (const task of workflow.tasks) {
      const result = await this.executeTask(task);
      results.push({
        task: task.action,
        parameters: task.parameters,
        result,
        timestamp: new Date().toISOString()
      });

      // 優先度に基づく遅延
      if (task.priority < 5) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // 最終レポート生成
    const finalReport = await this.generateReport(results);

    return {
      workflow,
      results,
      finalReport,
      duration: results.length > 0 ? 
        new Date(results[results.length - 1].timestamp).getTime() - 
        new Date(results[0].timestamp).getTime() : 0
    };
  }

  private async executeTask(task: z.infer<typeof TaskSchema>) {
    const { text } = await generateText({
      model: this.executorModel,
      messages: [
        {
          role: 'system',
          content: `タスク「${task.action}」を実行してください。パラメータ: ${JSON.stringify(task.parameters)}`
        },
        {
          role: 'user',
          content: 'タスクを実行し、結果を報告してください。'
        }
      ],
      maxTokens: 500
    });

    return text;
  }

  private async generateReport(results: any[]) {
    const { text } = await generateText({
      model: this.executorModel,
      messages: [
        {
          role: 'system',
          content: '以下のタスク実行結果をまとめて、簡潔で分かりやすいレポートを作成してください。'
        },
        {
          role: 'user',
          content: `実行結果:\n${JSON.stringify(results, null, 2)}`
        }
      ]
    });

    return text;
  }
}

// 使用例
const agent = new AIAgent();

const workflow = await agent.planWorkflow(
  "競合他社の分析を行い、マーケティング戦略を提案してください"
);

console.log('計画されたワークフロー:', workflow);

const execution = await agent.executeWorkflow(workflow);
console.log('実行結果:', execution.finalReport);
```

## 設定オプション

### モデル作成オプション

```typescript
interface UnillmModelConfig {
  // プロバイダー設定
  provider: 'groq' | 'openai' | 'anthropic' | 'google' | 'cohere';
  model: string;
  
  // API設定
  apiKey?: string;
  baseURL?: string;
  
  // パフォーマンス設定
  maxRetries?: number;
  timeout?: number;
  
  // デフォルトパラメータ
  defaultParams?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    stopSequences?: string[];
  };
}

// 使用例
const model = createUnillmModel({
  provider: 'groq',
  model: 'llama-3.3-70b-versatile',
  apiKey: process.env.GROQ_API_KEY,
  maxRetries: 3,
  timeout: 30000,
  defaultParams: {
    temperature: 0.7,
    maxTokens: 1000
  }
});
```

### AI SDK互換設定

```typescript
// AI SDK設定との互換性
import { createUnillmModel } from '@aid-on/unillm-vercel-ai-sdk';

const model = createUnillmModel({
  provider: 'groq',
  model: 'llama-3.3-70b-versatile'
});

// AI SDKのすべての機能が使用可能
const response = await generateText({
  model,
  prompt: 'Hello',
  temperature: 0.8,
  maxTokens: 500,
  topP: 0.9,
  presencePenalty: 0.1,
  frequencyPenalty: 0.1,
  seed: 42,
  stopSequences: ['\n\n']
});
```

## パフォーマンス考慮事項

### プロバイダー選択戦略

```typescript
// 用途別プロバイダー最適化
class ProviderOptimizer {
  getOptimalProvider(useCase: string, requirements: any) {
    const strategies = {
      'real-time-chat': {
        primary: { provider: 'groq', model: 'llama-3.3-70b-versatile' },
        reason: '最高速度'
      },
      'complex-reasoning': {
        primary: { provider: 'openai', model: 'gpt-4' },
        reason: '高品質推論'
      },
      'cost-effective': {
        primary: { provider: 'groq', model: 'llama-3.1-8b-instant' },
        reason: '低コスト'
      },
      'large-context': {
        primary: { provider: 'anthropic', model: 'claude-3-haiku' },
        reason: '長文処理'
      }
    };

    return strategies[useCase] || strategies['real-time-chat'];
  }
}
```

### キャッシュとバッチ処理

```typescript
// 効率的なモデル利用
class OptimizedModelUsage {
  private cache = new Map<string, any>();
  
  async generateWithCache(model: any, prompt: string, ttl = 3600000) {
    const cacheKey = this.createCacheKey(model, prompt);
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < ttl) {
        return cached.result;
      }
    }
    
    const result = await generateText({ model, prompt });
    
    this.cache.set(cacheKey, {
      result,
      timestamp: Date.now()
    });
    
    return result;
  }
  
  async batchGenerate(model: any, prompts: string[]) {
    const results = await Promise.allSettled(
      prompts.map(prompt => generateText({ model, prompt }))
    );
    
    return results.map(result => 
      result.status === 'fulfilled' ? result.value : null
    );
  }
}
```