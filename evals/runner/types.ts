export interface TestCase {
  id: string;
  name: string;
  category: string;
  agent: string;
  description?: string;
  input: {
    prompt: string;
    context?: Record<string, unknown>;
    setup?: string[];
  };
  expectations: {
    success?: boolean;
    output_contains?: string[];
    output_not_contains?: string[];
    tools_used?: string[];
    tools_not_used?: string[];
    max_tokens?: number;
    max_tool_calls?: number;
    pattern_match?: string;
  };
  metadata?: {
    author?: string;
    created?: string;
    priority?: "critical" | "high" | "medium" | "low";
    tags?: string[];
  };
}

export interface TestResult {
  testId: string;
  testName: string;
  category: string;
  agent: string;
  success: boolean;
  duration: number;
  tokensUsed?: number;
  toolCalls?: string[];
  output?: string;
  error?: string;
}

export interface RunOptions {
  category?: string;
  verbose?: boolean;
}

export interface EvalReport {
  agent: string;
  timestamp: string;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  results: TestResult[];
  metrics: {
    avgTokens: number | null;
    successRate: number;
  };
}
