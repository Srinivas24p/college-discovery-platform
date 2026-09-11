# Deploying College Discovery Platform to Render

This project is configured for seamless deployment on **Render** using either **Render Blueprints (1-Click automated)** or **Manual Service Setup**.

---

## Method 1: 1-Click Deployment with Render Blueprint (Recommended)

Render Blueprints read the [`render.yaml`](./render.yaml) file to automatically provision both the **PostgreSQL Database** and the **Next.js Web Service**, linking the `DATABASE_URL` between them automatically.

### Steps:

1. **Commit and push your changes to GitHub**:
   ```bash
   git add .
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. **Go to Render Dashboard**:
   - Visit [dashboard.render.com](https://dashboard.render.com) and log in.

3. **Create a Blueprint Instance**:
   - Click the **"New +"** button at the top right.
   - Select **"Blueprint"**.
   - Connect your GitHub account and select repository: `Srinivas24p/college-discovery-platform`.
   - Give the Blueprint a name (e.g. `college-discovery-app`).
   - Click **"Apply"**.

4. **Automatic Deployment**:
   - Render will provision the PostgreSQL database (`college-discovery-db`).
   - Render will build and deploy the Next.js app (`college-discovery-platform`).
   - During the build step, `npm run build:render` runs `prisma db push` (syncing database tables), `prisma db:seed` (populating demo colleges, courses, cutoffs, placements, and reviews), and `next build`.
   - Once completed, your live URL will be active (e.g., `https://college-discovery-platform.onrender.com`).

---

## Method 2: Manual Setup on Render

If you prefer to configure services individually in the Render UI:

### Step 1: Create PostgreSQL Database on Render
1. In Render Dashboard, click **New +** -> **PostgreSQL**.
2. Name: `college-discovery-db`
3. Database Name: `college_discovery_db`
4. User: `college_user`
5. Plan: **Free**
6. Click **Create Database**.
7. Once created, copy the **Internal Database URL** (if deploying web service in Render) or **External Database URL**.

### Step 2: Create Web Service on Render
1. In Render Dashboard, click **New +** -> **Web Service**.
2. Connect your GitHub repository `Srinivas24p/college-discovery-platform`.
3. Configure the settings:
   - **Name**: `college-discovery-platform`
   - **Language / Runtime**: `Node`
   - **Branch**: `main`
   - **Build Command**: `npm run build:render`
   - **Start Command**: `npm run start`
   - **Instance Type**: `Free`
4. In **Environment Variables**, add:
   - `DATABASE_URL`: *(paste the PostgreSQL connection string from Step 1)*
   - `NODE_VERSION`: `20.18.0`
   - `NODE_ENV`: `production`
5. Click **Deploy Web Service**.

---

## Environment Variables Reference

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db?sslmode=require` |
| `NODE_ENV` | Environment mode | `production` |
| `NODE_VERSION` | Node.js version | `20.18.0` |
| `FORCE_SEED` | Force re-seeding demo data on deploy (optional) | `false` |

---

## Verification After Deployment
Once deployed, test the following endpoints on your Render domain:
- **Home**: `https://<your-app>.onrender.com/`
- **College Directory**: `https://<your-app>.onrender.com/colleges`
- **College Detail**: `https://<your-app>.onrender.com/colleges/iit-bombay`
- **Compare Tool**: `https://<your-app>.onrender.com/compare`
- **Admissions Predictor**: `https://<your-app>.onrender.com/predictor`
- **Health Check API**: `https://<your-app>.onrender.com/api/health`
