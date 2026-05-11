# Resume Builder — ITech Next Gen Pvt Ltd

A production-ready, AI-powered resume builder that generates ATS-optimized LaTeX resumes using OpenAI GPT-4o.

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 + Framer Motion
- **AI:** OpenAI GPT-4o API
- **Database:** Supabase (PostgreSQL)
- **State:** Zustand
- **PDF Workflow:** LaTeX → Overleaf → PDF

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local

# 3. Fill in your API keys in .env.local
# OPENAI_API_KEY=sk-...
# PRIVATE_ACCESS_PASSWORD=your_password
# ADMIN_PASSWORD=your_admin_password
# NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
# SUPABASE_SERVICE_ROLE_KEY=your_service_key

# 4. Start development server
npm run dev
```

## Supabase Setup

Create a `submissions` table in your Supabase project:

```sql
CREATE TABLE submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text,
  email text,
  phone text,
  linkedin text,
  github text,
  portfolio text,
  experience jsonb,
  education jsonb,
  skills jsonb,
  projects jsonb,
  generated_latex text,
  tokens_used integer,
  created_at timestamp with time zone DEFAULT now()
);
```

Create a `feedback` table for the feedback system:

```sql
CREATE TABLE feedback (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  emoji text,
  message text NOT NULL,
  is_approved boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/unlock` | Password-protected access gate |
| `/resume/enroll` | 5-step resume form |
| `/resume/preview` | LaTeX preview + export |
| `/feedback` | User feedback / rating form |
| `/admin` | Submissions + feedback dashboard |

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/unlock` | Validate access password |
| POST | `/api/generate-resume` | Generate LaTeX via GPT-4o |
| POST | `/api/save-submission` | Save to Supabase |
| GET | `/api/admin/submissions` | Fetch all submissions |
| POST | `/api/admin/login` | Admin authentication |
| POST | `/api/feedback` | Submit feedback (public) |
| GET | `/api/feedback?approved=true` | Fetch approved feedback |
| GET | `/api/feedback?key=...` | Fetch all feedback (admin) |
| PATCH | `/api/feedback?key=...` | Toggle feedback approval |
| DELETE | `/api/feedback?key=...&id=...` | Delete feedback |

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## License

Private — © 2026 ITech Next Gen Pvt Ltd  
For inquiries: nextgenlabs.edu@gmail.com  

This project and its source code are proprietary and confidential.  
Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited without explicit permission from ITech Next Gen Pvt Ltd.
