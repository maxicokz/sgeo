-- Migration: Add reference answer tracking to evaluations
-- Run this if you already have the evaluations table

-- Add columns for reference answer tracking
ALTER TABLE evaluations
  ADD COLUMN IF NOT EXISTS reference_id UUID REFERENCES reference_answers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS has_reference BOOLEAN DEFAULT false;

-- Index for filtering by reference usage
CREATE INDEX IF NOT EXISTS idx_evaluations_has_reference ON evaluations(has_reference);
CREATE INDEX IF NOT EXISTS idx_evaluations_reference_id ON evaluations(reference_id);

-- Update view to include reference info
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
    e.has_reference,
    e.reference_id,
    ar.id as ai_response_id,
    ar.model_name,
    ar.prompt,
    ar.response,
    ar.language,
    ar.created_at as response_created_at,
    ra.topic as reference_topic,
    ra.reference_short
FROM evaluations e
JOIN ai_responses ar ON ar.id = e.ai_response_id
LEFT JOIN reference_answers ra ON ra.id = e.reference_id
ORDER BY e.evaluated_at DESC;

-- View: Evaluation statistics with/without reference
CREATE OR REPLACE VIEW evaluation_reference_stats AS
SELECT
    has_reference,
    COUNT(*) as total_count,
    ROUND(AVG(coherence)::numeric, 2) as avg_coherence,
    ROUND(AVG(consistency)::numeric, 2) as avg_consistency,
    ROUND(AVG(fluency)::numeric, 2) as avg_fluency,
    ROUND(AVG(relevance)::numeric, 2) as avg_relevance,
    ROUND(AVG(avg_score)::numeric, 0) as overall_avg_score
FROM evaluations
GROUP BY has_reference;
