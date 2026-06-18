# Academia Dominus Hardening Record

**Scope:** all plan fixes
**Hardened:** 2026-06-17

## Applied

### Unauthenticated API File Upload

**Status:** Applied
**What changed:** Implemented Firebase ID Token extraction and server-side verification using Google's Identity Toolkit REST API. Added user profile loading from Firestore to restrict uploads to verified users with the `admin` role. Added file-level size validation (maximum 5MB) and type validation (images only) before forwarding to Vercel Blob. Updated the admin panel to attach the user's ID token in the authorization header during uploads.
**Where:** The POST function in the file upload API route, and the handleCreatePost function in the admin dashboard.

### Role-based Route Redirection

**Status:** Applied
**What changed:** Verified that the dashboards immediately redirect unauthorized user roles to correct interfaces. The application shows a loader while authenticating the session to prevent layout flashes.
**Where:** The useEffect blocks in the admin, professor, and student dashboard components.

### Firebase Database and Storage Rules

**Status:** Applied
**What changed:** Audited and verified that the database collections and storage buckets restrict read and write privileges to authorized UIDs and roles.
**Where:** The rules defined in firestore.rules and storage.rules.

### Firebase Client Initialization

**Status:** Applied
**What changed:** Verified that configuration keys are loaded strictly from environment variables without committing hardcoded credentials to Git.
**Where:** The Firebase configuration block inside config.ts.
