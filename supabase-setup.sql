-- ══════════════════════════════════════════════════════════
-- Advanced Feedback System Schema
-- ══════════════════════════════════════════════════════════

-- 1. Create feedback table (drop if recreating)
CREATE TABLE IF NOT EXISTS feedback (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  emoji text,
  message text NOT NULL,
  category text DEFAULT 'general' CHECK (category IN ('general', 'ui_design', 'resume_quality', 'feature_request', 'bug_report')),
  sentiment text DEFAULT 'neutral' CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  sentiment_score real DEFAULT 0.5,
  is_approved boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  is_anonymous boolean DEFAULT false,
  nps_score integer CHECK (nps_score >= 0 AND nps_score <= 10),
  priority text CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  screenshot text,
  tags text[] DEFAULT '{}',
  admin_reply text,
  replied_at timestamp with time zone,
  helpful_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- 3. Policy for full access (service role)
CREATE POLICY "Service role full access on feedback"
  ON feedback FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. Add new columns if table already exists (safe migration)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='feedback' AND column_name='category') THEN
    ALTER TABLE feedback ADD COLUMN category text DEFAULT 'general';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='feedback' AND column_name='sentiment') THEN
    ALTER TABLE feedback ADD COLUMN sentiment text DEFAULT 'neutral';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='feedback' AND column_name='sentiment_score') THEN
    ALTER TABLE feedback ADD COLUMN sentiment_score real DEFAULT 0.5;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='feedback' AND column_name='is_featured') THEN
    ALTER TABLE feedback ADD COLUMN is_featured boolean DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='feedback' AND column_name='is_anonymous') THEN
    ALTER TABLE feedback ADD COLUMN is_anonymous boolean DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='feedback' AND column_name='nps_score') THEN
    ALTER TABLE feedback ADD COLUMN nps_score integer;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='feedback' AND column_name='priority') THEN
    ALTER TABLE feedback ADD COLUMN priority text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='feedback' AND column_name='screenshot') THEN
    ALTER TABLE feedback ADD COLUMN screenshot text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='feedback' AND column_name='tags') THEN
    ALTER TABLE feedback ADD COLUMN tags text[] DEFAULT '{}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='feedback' AND column_name='admin_reply') THEN
    ALTER TABLE feedback ADD COLUMN admin_reply text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='feedback' AND column_name='replied_at') THEN
    ALTER TABLE feedback ADD COLUMN replied_at timestamp with time zone;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='feedback' AND column_name='helpful_count') THEN
    ALTER TABLE feedback ADD COLUMN helpful_count integer DEFAULT 0;
  END IF;
END $$;

-- 5. Sample feedback data
INSERT INTO feedback (name, email, rating, emoji, message, category, sentiment, sentiment_score, is_approved, is_featured, tags, helpful_count) VALUES
  ('Rahul Sharma', 'rahul@example.com', 5, '🔥', 'This resume builder is incredible! The LaTeX output is clean and ATS-friendly. Got interview calls within a week of using the generated resume.', 'resume_quality', 'positive', 0.95, true, true, ARRAY['ats-friendly', 'latex', 'interview'], 12),
  ('Priya Patel', 'priya@example.com', 5, '😍', 'Best resume tool I have ever used. The step-by-step form makes it so easy, and the AI-generated LaTeX is professional quality.', 'general', 'positive', 0.92, true, false, ARRAY['easy-to-use', 'professional', 'ai'], 8),
  ('Amit Kumar', 'amit@example.com', 4, '👍', 'Great tool for building structured resumes. The export to Overleaf workflow is smooth. Would love to see more templates in the future!', 'feature_request', 'positive', 0.78, true, false, ARRAY['templates', 'overleaf', 'structured'], 5),
  ('Sneha Reddy', NULL, 5, '✨', 'Absolutely love the dark theme and the attention to detail. My resume looks 10x more professional now. Highly recommended!', 'ui_design', 'positive', 0.90, true, true, ARRAY['dark-theme', 'design', 'professional'], 15),
  ('Vikram Singh', 'vikram@example.com', 4, '💼', 'Very professional output. The AI suggestions for responsibilities section were spot on. Saved me hours of formatting.', 'resume_quality', 'positive', 0.85, true, false, ARRAY['ai-suggestions', 'formatting', 'professional'], 7);

-- Done!
