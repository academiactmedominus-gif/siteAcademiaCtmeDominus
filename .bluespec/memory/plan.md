# Academia Dominus Defense Plan

**Scope:** all detect findings
**Planned:** 2026-06-17

## Fixes

### Unauthenticated API File Upload

**Priority:** Critical
**Upholds:** IV. All user inputs and media uploads are validated
**Fix:** Modify the `/api/blog/upload` API route handler to extract the session token from request headers (or cookies). Use Firebase Admin SDK (or client SDK auth session check if applicable) to verify that the token belongs to an active user with the role of `admin`. Block requests that are unauthenticated or unauthorized. Verify file sizes are under 5MB and files are restricted to images only.

### Role-based Route Redirection

**Priority:** Medium
**Upholds:** III. Role-based routes are strictly protected
**Fix:** Maintain the existing client-side `useEffect` checks in the React dashboard page components to immediately verify the user role on mount. Improve UX by immediately showing a loading screen before route check finishes, preventing brief unauthenticated layout flashes.

### Firebase Database and Storage Rules

**Priority:** Low
**Upholds:** II. Every database operation is authorized by security rules
**Fix:** Keep the security configurations in `firestore.rules` and `storage.rules` intact. Whenever a new feature requiring database write operations is introduced, audit the corresponding rule blocks to ensure no loose writes are allowed.

### Firebase Client Initialization

**Priority:** Low
**Upholds:** I. Secrets never live in code or version history
**Fix:** Keep using environment variables (`process.env.NEXT_PUBLIC_FIREBASE_*`) to load configuration dynamically, keeping `.env.local` out of version control systems.
