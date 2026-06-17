# Academia Dominus Detect Map

**Scope:** full project scan
**Mapped:** 2026-06-17

## Findings

### Firebase Client Initialization

**What it is:** The system initializes the Firebase client SDK dynamically using configuration options loaded from environment variables.
**Why it matters:** Hardcoding configuration keys exposes project IDs and endpoints in version control; loading them dynamically keeps the configuration environment-specific.
**Evidence:** The initialization logic inside `config.ts` using `process.env`.

### Firebase Database and Storage Rules

**What it is:** Database access and file storage rights are governed by server-side security rules in the Firebase console.
**Why it matters:** Client-side role checks can be bypassed; enforcing rules at the database level guarantees that students cannot access other students' workouts and only admins can write to the blog.
**Evidence:** The security definitions in `firestore.rules` and `storage.rules`.

### Role-based Route Redirection

**What it is:** The application checks user roles client-side and redirects them to their respective dashboard view.
**Why it matters:** Without client-side route guards, regular users could access UI panels intended for teachers or administrators.
**Evidence:** The `useEffect` verification block inside `admin/page.tsx`, `professor/page.tsx`, and `aluno/page.tsx`.

### Unauthenticated API File Upload

**What it is:** The API route at `/api/blog/upload` accepts file uploads and stores them directly on Vercel Blob.
**Why it matters:** The route contains no authentication checks, session checks, or role validation, meaning any anonymous user can upload arbitrary files and consume Vercel Blob storage resources.
**Evidence:** The `POST` request handler in the upload API route.

## Applied sub-skills

- javascript: verified strict equality (`===`) and absence of unsafe dynamic execution (`eval`, `child_process`).
- browser: verified markdown parsing in blog post details to ensure text is rendered safely without dangerous DOM sinks.
