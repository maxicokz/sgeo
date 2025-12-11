-- Migration: Add sentiment column to evaluations table
-- Run this in Supabase SQL Editor

ALTER TABLE evaluations
  ADD COLUMN IF NOT EXISTS sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative'));

-- Add index for filtering by sentiment
CREATE INDEX IF NOT EXISTS idx_evaluations_sentiment ON evaluations(sentiment);

COMMENT ON COLUMN evaluations.sentiment IS 'Тональность ответа: positive, neutral, negative';
