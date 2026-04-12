# 🚀 Make Use AI Marketplace: Deployment Guide

This document explains how the **Make Use AI Marketplace** handles its production infrastructure and database migrations.

## 🏗 Infrastructure Overview

We use **Vercel** for hosting both our Frontend and API. This ensures that every time you push to the `main` branch, the following happens automatically:

1.  **Frontend**: Builds the Next.js app (`apps/web-admin`).
2.  **API**: Builds the Express server (`apps/api`).
3.  **Database**: Vercel Postgres handles the managed database.

---

## 🗄 Database Migrations

### 🛑 NEVER use `db push` in Production
Locally, we use `npx prisma db push` for prototyping. In production, we **always** use migrations to prevent data loss.

### ✅ Scaling the Schema (The 3-Step Process)
When you add a new feature (like "Visit Scheduling") that requires new database columns, follow this workflow:

1.  **Modify Schema**: Update `packages/database/prisma/schema.prisma`.
2.  **Generate Migration**:
    ```bash
    cd packages/database
    npx prisma migrate dev --name your_feature_name
    ```
    *This creates a new folder in `prisma/migrations`.*
3.  **Push to GitHub**:
    ```bash
    git add .
    git commit -m "feat: add visit scheduling"
    git push origin main
    ```

### 🚢 Automatic Deployment
Because of the configuration in `render.yaml`, Render will automatically run:
`npx prisma migrate deploy` 

This command safely applies only the **newest** changes without touching your existing user data.

---

## 🛠 Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **"Column does not exist" Error** | Ensure you committed the `prisma/migrations` folder to GitHub. |
| **Render Build Failure** | Check the `DATABASE_URL` environment variable is set in the Render Dashboard. |
| **Database Drift Detected** | Run `npx prisma migrate reset` locally (Warning: clears local data) to sync your dev machine with history. |

---

*Last Updated: April 2026*
