# Next.js and Firebase Stack for Serverless Deployment

We decided to use Next.js (App Router) hosted on Vercel, paired with Firebase (Firestore, Auth, Storage) as the backend, because the user wants a 100% free hosting solution that never pauses or deactivates the database due to inactivity.

## Status

Accepted

## Context

The project initially lived under a XAMPP root (`htdocs`), suggesting a traditional PHP/MySQL setup. However, the requirement of using Vercel's free tier for hosting makes local MySQL impossible, and services like Supabase free tier pause databases after 7 days of inactivity. A paused database degrades the experience of a low-traffic gym website.

## Decision

We chose Next.js (hosted on Vercel) as the frontend framework and Firebase Spark Plan (free tier) for all backend services:
- **Firebase Firestore** as the NoSQL database. It never pauses due to inactivity, has a permanent free tier, and has low latency.
- **Firebase Auth** for student, teacher, and administrator authentication.
- **Firebase Storage** for storing blog article images and user/profile uploads.

## Consequences

- We do not need a persistent database server or container; the architecture is entirely serverless.
- Since Firestore is NoSQL, relational consistency between workouts, students, and teachers must be handled at the application layer.
- Development requires setup of Firebase config credentials in environment variables.
