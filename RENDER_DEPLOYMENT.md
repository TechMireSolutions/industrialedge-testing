# Deploying Industrial Edge on Render with SQLite 3

This project is fully migrated to **SQLite 3** and optimized for direct deployment to [Render](https://render.com).

---

## 🗄️ SQLite 3 Architecture Overview

- **Database File**: `data/industrial_edge.sqlite` (or configured via `SQLITE_DB_PATH`).
- **Engine**: Native `sqlite3` + `sqlite` async promise driver with Write-Ahead Logging (`WAL`) mode enabled for high concurrency.
- **Auto-Migration**: On initial boot, the database schema (9 tables: `products`, `categories`, `orders`, `rfqs`, `inquiries`, `deals`, `customers`, `admin_users`, `app_config`) is automatically created and pre-seeded from your catalog data.
- **Zero Configuration**: No separate database server (like PostgreSQL or MySQL) is required. Everything runs in a single unified web service.

---

## 🚀 Deployment Instructions for Render

### Method 1: Automatic Blueprint Deployment (Recommended)

1. Push your repository to **GitHub** or **GitLab**.
2. Log into your [Render Dashboard](https://dashboard.render.com).
3. Click **New +** and choose **Blueprint**.
4. Connect your GitHub/GitLab repository.
5. Render will automatically detect [`render.yaml`](file:///c:/Users/Jawwad%20Abbas/Desktop/industrialedge-testing-main/render.yaml) and configure:
   - **Service Type**: Web Service
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Environment Variables**: `NODE_ENV=production`, `SQLITE_DB_PATH=./data/industrial_edge.sqlite`, and auto-generated `JWT_SECRET`.
6. Click **Apply**. Your app will build and deploy live in ~2 minutes!

---

### Method 2: Manual Web Service Setup on Render

If you prefer to configure manually without Blueprint:

1. In the Render Dashboard, click **New +** > **Web Service**.
2. Connect your Git repository.
3. Configure the following fields:
   - **Name**: `industrial-edge`
   - **Region**: Frankfurt / Oregon (any region closest to your users)
   - **Branch**: `main` (or your current branch)
   - **Runtime**: `Node`
   - **Build Command**:
     ```bash
     npm install && npm run build
     ```
   - **Start Command**:
     ```bash
     npm run start
     ```
   - **Plan**: `Free` (or `Starter` if using a Persistent Disk)

4. Add **Environment Variables** under the *Environment* tab:
   | Key | Value | Description |
   | --- | --- | --- |
   | `NODE_ENV` | `production` | Enables production optimizations |
   | `SQLITE_DB_PATH` | `./data/industrial_edge.sqlite` | SQLite database file path |
   | `JWT_SECRET` | *(click Generate)* | 32-character secret for admin sessions |
   | `ADMIN_JWT_SECRET` | *(same as JWT_SECRET)* | Admin token verification |

5. Click **Create Web Service**.

---

## 💾 Keeping Data Persistent Across Redeploys (Optional)

On Render's **Free tier**, the file system is ephemeral, meaning any *new* products or orders placed after deployment will reset if Render spins down the service due to inactivity.

To keep all customer orders, new products, and settings permanently saved on Render:
1. Upgrade the web service to the **Starter Plan** ($7/mo).
2. Go to **Disks** in the Render service dashboard and click **Add Disk**:
   - **Name**: `industrial-edge-disk`
   - **Mount Path**: `/var/data`
   - **Size**: `1 GB` (or more)
3. Update the Environment Variable:
   - `SQLITE_DB_PATH`: `/var/data/industrial_edge.sqlite`
4. Deploy! Your SQLite database is now stored on permanent, encrypted cloud SSD storage.

---

## 🔐 Default Admin Credentials

Once deployed on Render, visit `/admin` on your Render URL to log in:
- **URL**: `https://<your-render-subdomain>.onrender.com/admin`
- **Email**: `admin@industrialedge.pk`
- **Password**: `admin123`

You can change this password anytime inside the Admin Dashboard under **Settings** or **RBAC**.
