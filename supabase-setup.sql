-- ══════════════════════════════════════════════════════════
-- Feedback Table Only (submissions already exists)
-- ══════════════════════════════════════════════════════════

-- 1. Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  emoji text,
  message text NOT NULL,
  is_approved boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- 3. Policy for full access
CREATE POLICY "Service role full access on feedback"
  ON feedback FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. Sample feedback data (so you can see ratings immediately)
INSERT INTO feedback (name, email, rating, emoji, message, is_approved) VALUES
  ('Rahul Sharma', 'rahul@example.com', 5, '🔥', 'This resume builder is incredible! The LaTeX output is clean and ATS-friendly. Got interview calls within a week of using the generated resume.', true),
  ('Priya Patel', 'priya@example.com', 5, '😍', 'Best resume tool I have ever used. The step-by-step form makes it so easy, and the AI-generated LaTeX is professional quality.', true),
  ('Amit Kumar', 'amit@example.com', 4, '👍', 'Great tool for building structured resumes. The export to Overleaf workflow is smooth. Would love to see more templates in the future!', true),
  ('Sneha Reddy', NULL, 5, '✨', 'Absolutely love the dark theme and the attention to detail. My resume looks 10x more professional now. Highly recommended!', true),
  ('Vikram Singh', 'vikram@example.com', 4, '💼', 'Very professional output. The AI suggestions for responsibilities section were spot on. Saved me hours of formatting.', true);

-- Done!
