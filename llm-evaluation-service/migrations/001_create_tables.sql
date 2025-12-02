-- G-Eval LLM Evaluation Service - Database Schema
-- Run this migration in your Supabase SQL editor
--
-- This migration creates the evaluations table that works with existing ai_responses table

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: evaluations
-- Stores G-Eval evaluation scores for ai_responses
-- ============================================
CREATE TABLE IF NOT EXISTS evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Reference to ai_responses table
    ai_response_id UUID NOT NULL REFERENCES ai_responses(id) ON DELETE CASCADE,

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

    -- Ensure one evaluation per ai_response
    CONSTRAINT unique_ai_response_evaluation UNIQUE (ai_response_id)
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_evaluations_ai_response_id ON evaluations(ai_response_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_evaluated_at ON evaluations(evaluated_at DESC);
CREATE INDEX IF NOT EXISTS idx_evaluations_avg_score ON evaluations(avg_score DESC);
CREATE INDEX IF NOT EXISTS idx_evaluations_evaluator_model ON evaluations(evaluator_model);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations for authenticated users
CREATE POLICY "Allow all for authenticated" ON evaluations
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Allow anonymous read access (for dashboard)
CREATE POLICY "Allow anonymous read" ON evaluations
    FOR SELECT
    TO anon
    USING (true);

-- ============================================
-- View: Model performance summary
-- ============================================
CREATE OR REPLACE VIEW model_performance_summary AS
SELECT
    ar.model_name,
    COUNT(e.id) as total_evaluations,
    ROUND(AVG(e.coherence)::numeric, 2) as avg_coherence,
    ROUND(AVG(e.consistency)::numeric, 2) as avg_consistency,
    ROUND(AVG(e.fluency)::numeric, 2) as avg_fluency,
    ROUND(AVG(e.relevance)::numeric, 2) as avg_relevance,
    ROUND(AVG(e.avg_score)::numeric, 0) as overall_avg_score
FROM ai_responses ar
JOIN evaluations e ON e.ai_response_id = ar.id
GROUP BY ar.model_name
ORDER BY overall_avg_score DESC;

-- ============================================
-- View: Recent evaluations with full context
-- ============================================
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
    e.reasoning,
    ar.id as ai_response_id,
    ar.model_name,
    ar.prompt,
    ar.response,
    ar.language,
    ar.created_at as response_created_at
FROM evaluations e
JOIN ai_responses ar ON ar.id = e.ai_response_id
ORDER BY e.evaluated_at DESC;
