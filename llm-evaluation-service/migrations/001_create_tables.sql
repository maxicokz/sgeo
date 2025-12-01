-- G-Eval LLM Evaluation Service - Database Schema
-- Run this migration in your Supabase SQL editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: prompts
-- Stores the original prompts/questions
-- ============================================
CREATE TABLE IF NOT EXISTS prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    text TEXT NOT NULL,
    reference_answer TEXT,
    category VARCHAR(100),
    difficulty VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts(category);

-- ============================================
-- Table: responses
-- Stores LLM responses to prompts
-- ============================================
CREATE TABLE IF NOT EXISTS responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
    model_name VARCHAR(100) NOT NULL,
    response_text TEXT NOT NULL,
    response_time_ms INTEGER,
    tokens_used INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_responses_prompt_id ON responses(prompt_id);
CREATE INDEX IF NOT EXISTS idx_responses_model_name ON responses(model_name);
CREATE INDEX IF NOT EXISTS idx_responses_created_at ON responses(created_at DESC);

-- ============================================
-- Table: evaluations
-- Stores G-Eval evaluation scores
-- ============================================
CREATE TABLE IF NOT EXISTS evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    response_id UUID NOT NULL REFERENCES responses(id) ON DELETE CASCADE,

    -- G-Eval criteria scores (1-5 scale)
    coherence SMALLINT NOT NULL CHECK (coherence >= 1 AND coherence <= 5),
    consistency SMALLINT NOT NULL CHECK (consistency >= 1 AND consistency <= 5),
    fluency SMALLINT NOT NULL CHECK (fluency >= 1 AND fluency <= 5),
    relevance SMALLINT NOT NULL CHECK (relevance >= 1 AND relevance <= 5),

    -- Computed average score (0-100% scale)
    avg_score SMALLINT NOT NULL CHECK (avg_score >= 0 AND avg_score <= 100),

    -- Evaluation metadata
    evaluator_model VARCHAR(100) NOT NULL,
    reasoning TEXT,
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Ensure one evaluation per response
    CONSTRAINT unique_response_evaluation UNIQUE (response_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_evaluations_response_id ON evaluations(response_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_evaluated_at ON evaluations(evaluated_at DESC);
CREATE INDEX IF NOT EXISTS idx_evaluations_avg_score ON evaluations(avg_score DESC);

-- ============================================
-- Trigger: Update updated_at on prompts
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_prompts_updated_at ON prompts;
CREATE TRIGGER update_prompts_updated_at
    BEFORE UPDATE ON prompts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS)
-- Adjust based on your authentication needs
-- ============================================

-- Enable RLS
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations for authenticated users (adjust as needed)
-- For service-to-service communication with service_role key, RLS is bypassed

CREATE POLICY "Allow all for authenticated" ON prompts
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all for authenticated" ON responses
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all for authenticated" ON evaluations
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================
-- Views for aggregated statistics
-- ============================================

-- View: Model performance summary
CREATE OR REPLACE VIEW model_performance_summary AS
SELECT
    r.model_name,
    COUNT(e.id) as total_evaluations,
    ROUND(AVG(e.coherence)::numeric, 2) as avg_coherence,
    ROUND(AVG(e.consistency)::numeric, 2) as avg_consistency,
    ROUND(AVG(e.fluency)::numeric, 2) as avg_fluency,
    ROUND(AVG(e.relevance)::numeric, 2) as avg_relevance,
    ROUND(AVG(e.avg_score)::numeric, 2) as overall_avg_score
FROM responses r
JOIN evaluations e ON e.response_id = r.id
GROUP BY r.model_name
ORDER BY overall_avg_score DESC;

-- View: Recent evaluations with full context
CREATE OR REPLACE VIEW recent_evaluations_detailed AS
SELECT
    e.id as evaluation_id,
    e.evaluated_at,
    e.coherence,
    e.consistency,
    e.fluency,
    e.relevance,
    e.avg_score,
    e.evaluator_model,
    r.model_name as response_model,
    r.response_text,
    p.text as prompt_text,
    p.reference_answer
FROM evaluations e
JOIN responses r ON r.id = e.response_id
JOIN prompts p ON p.id = r.prompt_id
ORDER BY e.evaluated_at DESC;

-- ============================================
-- Sample data (optional - for testing)
-- ============================================

-- Uncomment to insert sample data:
/*
INSERT INTO prompts (text, reference_answer, category) VALUES
('What is the capital of France?', 'The capital of France is Paris.', 'geography'),
('Explain photosynthesis in simple terms.', 'Photosynthesis is the process by which plants convert sunlight, water, and carbon dioxide into glucose and oxygen.', 'science'),
('Write a haiku about autumn.', NULL, 'creative');

INSERT INTO responses (prompt_id, model_name, response_text)
SELECT id, 'gpt-4', 'Paris is the capital city of France, located in the north-central part of the country.'
FROM prompts WHERE text LIKE '%capital of France%';

INSERT INTO responses (prompt_id, model_name, response_text)
SELECT id, 'claude-3', 'The capital of France is Paris, a city known for the Eiffel Tower and rich cultural heritage.'
FROM prompts WHERE text LIKE '%capital of France%';
*/
