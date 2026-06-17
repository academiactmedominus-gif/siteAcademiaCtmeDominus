# Academia Dominus Security Charter

## Principles

### I. Secrets never live in code or version history
All Firebase configuration keys, private keys, and environment variables must be stored in `.env.local` or host environment variables. No credentials, tokens, or private config files may be committed to the repository.

Why: A leaked key in git history is a full database takeover, and Git history is permanent.

### II. Every database operation is authorized by security rules
All read and write access to Cloud Firestore and Firebase Storage must be secured by server-side Firebase Security Rules (`firestore.rules` and `storage.rules`). Client-side checks are not sufficient for access control.

Why: Client-side logic can be bypassed by malicious actors; only database-level rules ensure students can only see their own workouts and only authorized roles can create database records.

### III. Role-based routes are strictly protected
All dashboard sections (`/dashboard/admin`, `/dashboard/professor`, `/dashboard/aluno`) must perform server-side or on-mount authentication and role checks to immediately block and redirect unauthorized sessions.

Why: Unprotected routes allow regular students to read or write administrative data through client-side routing manipulation.

### IV. All user inputs and media uploads are validated
All incoming payloads and uploads (such as blog post images) must be validated for size (under 5MB), mime-type (images only), and properly sanitized before display to prevent XSS.

Why: Unchecked uploads allow malicious files or scripts to execute in other users' browsers or compromise server integrity.

## Governance
This charter defines the security baseline for the Academia Dominus project. Any changes to these rules must be reviewed and documented, and the version number must be updated accordingly. Code changes are verified against these principles.

Version: 1.0.0 | Ratified: 2026-06-17
