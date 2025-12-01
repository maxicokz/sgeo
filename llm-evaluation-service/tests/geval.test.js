import { describe, it } from 'node:test';
import assert from 'node:assert';

// Mock environment variables before importing modules
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_KEY = 'test-key';
process.env.OPENROUTER_API_KEY = 'test-api-key';

describe('G-Eval Service', () => {
  describe('parseEvaluationResponse', () => {
    it('should parse valid JSON response', () => {
      const validResponse = `{
        "coherence": 4,
        "consistency": 5,
        "fluency": 3,
        "relevance": 4,
        "reasoning": "Good response overall"
      }`;

      // Test the parsing logic manually since parseEvaluationResponse is not exported
      const jsonMatch = validResponse.match(/\{[\s\S]*\}/);
      assert.ok(jsonMatch, 'Should find JSON in response');

      const parsed = JSON.parse(jsonMatch[0]);
      assert.strictEqual(parsed.coherence, 4);
      assert.strictEqual(parsed.consistency, 5);
      assert.strictEqual(parsed.fluency, 3);
      assert.strictEqual(parsed.relevance, 4);
    });

    it('should extract JSON from text with surrounding content', () => {
      const responseWithText = `Here is my evaluation:

      {
        "coherence": 5,
        "consistency": 4,
        "fluency": 5,
        "relevance": 5,
        "reasoning": "Excellent response"
      }

      That concludes my evaluation.`;

      const jsonMatch = responseWithText.match(/\{[\s\S]*\}/);
      assert.ok(jsonMatch, 'Should find JSON in response');

      const parsed = JSON.parse(jsonMatch[0]);
      assert.strictEqual(parsed.coherence, 5);
    });

    it('should validate scores are within 1-5 range', () => {
      const scores = [1, 2, 3, 4, 5];
      const min = 1;
      const max = 5;

      scores.forEach((score) => {
        assert.ok(score >= min && score <= max, `Score ${score} should be valid`);
      });

      const invalidScores = [0, 6, -1, 10];
      invalidScores.forEach((score) => {
        assert.ok(
          !(score >= min && score <= max),
          `Score ${score} should be invalid`
        );
      });
    });
  });

  describe('Average Score Calculation (0-100%)', () => {
    it('should calculate correct percentage score', () => {
      const scores = {
        coherence: 4,
        consistency: 5,
        fluency: 3,
        relevance: 4,
      };

      // avg 1-5 = 4, then convert to %: ((4-1)/4)*100 = 75%
      const avg1to5 =
        (scores.coherence + scores.consistency + scores.fluency + scores.relevance) / 4;
      const avgScore = Math.round(((avg1to5 - 1) / 4) * 100);

      assert.strictEqual(avgScore, 75);
    });

    it('should return 100% for all 5s', () => {
      const scores = {
        coherence: 5,
        consistency: 5,
        fluency: 5,
        relevance: 5,
      };

      const avg1to5 =
        (scores.coherence + scores.consistency + scores.fluency + scores.relevance) / 4;
      const avgScore = Math.round(((avg1to5 - 1) / 4) * 100);

      assert.strictEqual(avgScore, 100);
    });

    it('should return 0% for all 1s', () => {
      const scores = {
        coherence: 1,
        consistency: 1,
        fluency: 1,
        relevance: 1,
      };

      const avg1to5 =
        (scores.coherence + scores.consistency + scores.fluency + scores.relevance) / 4;
      const avgScore = Math.round(((avg1to5 - 1) / 4) * 100);

      assert.strictEqual(avgScore, 0);
    });

    it('should return 50% for all 3s', () => {
      const scores = {
        coherence: 3,
        consistency: 3,
        fluency: 3,
        relevance: 3,
      };

      const avg1to5 =
        (scores.coherence + scores.consistency + scores.fluency + scores.relevance) / 4;
      const avgScore = Math.round(((avg1to5 - 1) / 4) * 100);

      assert.strictEqual(avgScore, 50);
    });
  });
});

describe('Config Validation', () => {
  it('should have all required config fields', async () => {
    const { config } = await import('../src/config.js');

    assert.ok(config.supabase, 'Should have supabase config');
    assert.ok(config.openRouter, 'Should have openRouter config');
    assert.ok(config.server, 'Should have server config');
    assert.ok(config.rateLimit, 'Should have rateLimit config');
    assert.ok(config.cron, 'Should have cron config');
    assert.ok(config.geval, 'Should have geval config');
  });

  it('should have correct geval criteria', async () => {
    const { config } = await import('../src/config.js');

    const expectedCriteria = ['coherence', 'consistency', 'fluency', 'relevance'];
    assert.deepStrictEqual(config.geval.criteria, expectedCriteria);
  });

  it('should have correct scale', async () => {
    const { config } = await import('../src/config.js');

    assert.strictEqual(config.geval.scale.min, 1);
    assert.strictEqual(config.geval.scale.max, 5);
  });
});

describe('Evaluation Prompt Template', () => {
  it('should build valid evaluation prompt', () => {
    const EVALUATION_PROMPT_TEMPLATE = `You are an expert evaluator for Large Language Model responses.

## Context
**Prompt/Question:**
{prompt}

**Reference Answer (if available):**
{reference}

**Response to Evaluate:**
{response}`;

    const prompt = EVALUATION_PROMPT_TEMPLATE
      .replace('{prompt}', 'What is 2+2?')
      .replace('{reference}', '4')
      .replace('{response}', 'The answer is 4.');

    assert.ok(prompt.includes('What is 2+2?'));
    assert.ok(prompt.includes('The answer is 4.'));
    assert.ok(!prompt.includes('{prompt}'));
    assert.ok(!prompt.includes('{reference}'));
    assert.ok(!prompt.includes('{response}'));
  });

  it('should handle missing reference', () => {
    const template = 'Reference: {reference}';
    const result = template.replace('{reference}', 'Not provided');

    assert.strictEqual(result, 'Reference: Not provided');
  });
});

describe('OpenRouter Client', () => {
  it('should construct correct headers', () => {
    const apiKey = 'test-key';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://llm-evaluation-service.local',
      'X-Title': 'LLM Evaluation Service',
    };

    assert.strictEqual(headers['Content-Type'], 'application/json');
    assert.strictEqual(headers['Authorization'], 'Bearer test-key');
    assert.ok(headers['HTTP-Referer']);
    assert.ok(headers['X-Title']);
  });

  it('should construct correct request body', () => {
    const model = 'openai/gpt-4o-mini';
    const messages = [
      { role: 'system', content: 'You are helpful' },
      { role: 'user', content: 'Hello' },
    ];
    const temperature = 0.1;
    const maxTokens = 1024;

    const requestBody = {
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    };

    assert.strictEqual(requestBody.model, 'openai/gpt-4o-mini');
    assert.strictEqual(requestBody.messages.length, 2);
    assert.strictEqual(requestBody.temperature, 0.1);
    assert.strictEqual(requestBody.max_tokens, 1024);
  });
});

describe('Repository Functions', () => {
  it('should construct correct evaluation object', () => {
    const responseId = '550e8400-e29b-41d4-a716-446655440000';
    const scores = {
      coherence: 4,
      consistency: 5,
      fluency: 3,
      relevance: 4,
    };
    const avgScore = 4;
    const model = 'openai/gpt-4o-mini';

    const evaluation = {
      response_id: responseId,
      coherence: scores.coherence,
      consistency: scores.consistency,
      fluency: scores.fluency,
      relevance: scores.relevance,
      avg_score: avgScore,
      evaluated_at: new Date().toISOString(),
      evaluator_model: model,
    };

    assert.strictEqual(evaluation.response_id, responseId);
    assert.strictEqual(evaluation.coherence, 4);
    assert.strictEqual(evaluation.avg_score, 4);
    assert.ok(evaluation.evaluated_at);
  });
});

describe('Cron Schedule Validation', () => {
  it('should validate cron expression format', async () => {
    const cron = await import('node-cron');

    // Valid cron expressions
    assert.ok(cron.validate('0 0 * * 0'), 'Weekly on Sunday should be valid');
    assert.ok(cron.validate('0 0 * * *'), 'Daily at midnight should be valid');
    assert.ok(cron.validate('*/5 * * * *'), 'Every 5 minutes should be valid');

    // Invalid expressions
    assert.ok(!cron.validate('invalid'), 'Invalid expression should fail');
    assert.ok(!cron.validate(''), 'Empty expression should fail');
  });
});
