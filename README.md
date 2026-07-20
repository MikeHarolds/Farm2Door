# Farm2Door Web Portal

A web portal for managing farmers, harvested produce, delivery companies, drivers, logistics orders, and agricultural marketplace activities.

This runs on **PostgreSQL** (via [Neon](https://neon.tech), a free hosted Postgres service) for both local development and production, so the same setup works everywhere — see [Deploying to a Live Server](#deploying-to-a-live-server) below for hosting on Vercel or Railway.

## Technology Stack

* **Runtime:** Node.js
* **Framework:** Next.js
* **Language:** TypeScript
* **Frontend:** React
* **Backend:** Next.js API Route Handlers
* **ORM:** Drizzle ORM
* **Database:** PostgreSQL (Neon recommended; any standard Postgres connection string works)
* **Authentication:** Custom email and password authentication
* **Access Control:** Role-based access for administrators, farmers, delivery partners, and drivers

## Database

The app connects to Postgres using a single `DATABASE_URL` environment variable — the same format for local development and production. The easiest option, including for local development, is a **free Neon database**:

1. Sign up at [neon.tech](https://neon.tech) and create a project (free tier).
2. Copy the connection string it gives you.
3. Paste it into `.env.local` as `DATABASE_URL` (see [Database Configuration](#database-configuration) below).

You do not need to install Postgres locally to work on this project — a free Neon database works fine for local development too. If you'd rather run Postgres on your own machine instead, that works as well; see [Database Configuration](#database-configuration).

You do not need to install or configure:

* MySQL
* MongoDB
* Docker
* Firebase
* Supabase
* SQLite

An internet connection is required for installing Node.js packages, and for reaching your Postgres database (Neon databases are always reached over the internet; a local Postgres install does not require one).

## System Requirements

Before running the project, install:

* Node.js 22 LTS or newer
* npm
* Git, if you intend to contribute to the project

Confirm that Node.js and npm are installed:

```powershell
node --version
npm --version
```

## Recommended Project Location

On Windows, extract or clone the project into a normal local folder outside OneDrive.

Recommended location:

```text
C:\Projects\farm2market-local
```

Avoid running the project directly from:

```text
C:\Users\YourName\OneDrive\Desktop
```

OneDrive can lock files inside `node_modules` and cause installation errors.

## First-Time Setup

Open PowerShell or Command Prompt inside the project folder.

Install the project dependencies:

```powershell
npm install
```

Copy the environment template and set your database connection string:

```powershell
copy .env.example .env.local
```

Then open `.env.local` and set `DATABASE_URL` to your Neon (or local Postgres) connection string — see [Database Configuration](#database-configuration).

Create the database tables and load the demonstration data:

```powershell
npm run setup:local
```

Start the development server:

```powershell
npm run dev
```

Open the application in your browser:

```text
http://localhost:3000
```

## Windows Quick Setup

Windows users can also run the included setup file:

```text
setup-local.bat
```

This still requires you to set `DATABASE_URL` in `.env.local` first (the script copies `.env.example` to `.env.local` for you if it doesn't exist yet, but you must fill in the real connection string before continuing).

After the setup is complete, start the application using:

```text
start-local.bat
```

Keep the Command Prompt window open while using the portal.

## Starting the Application Later

After completing the initial setup, you only need to run:

```powershell
npm run dev
```

Then open:

```text
http://localhost:3000
```

You do not need to reinstall the dependencies or recreate the database tables every time.

## Demo Accounts

| Role             | Email                     | Password     |
| ---------------- | ------------------------- | ------------ |
| Administrator    | `admin@farm2market.com`   | `admin123`   |
| Farmer           | `farmer@farm2market.com`  | `farmer123`  |
| Delivery Partner | `partner@farm2market.com` | `partner123` |
| Driver           | `driver@farm2market.com`  | `driver123`  |

Each account opens a dashboard based on the assigned user role.

## Available User Roles

### Administrator

Administrators can manage:

* Farmers
* Delivery companies
* Drivers
* Produce listings
* Logistics orders
* Platform activities

### Farmer

Farmers can:

* Register and sign in
* View their dashboard
* Record harvested crops
* Manage harvest records
* List produce for sale
* Book logistics services
* Track delivery orders

### Delivery Partner

Delivery partners can:

* Register their delivery company
* View assigned logistics orders
* Manage registered drivers
* Assign deliveries to drivers
* Monitor delivery activity

### Driver

Drivers can:

* Sign in to their dashboard
* View assigned delivery orders
* Accept and manage deliveries
* Update delivery progress
* Confirm pickup and delivery status

## Database Backup

Neon takes automatic backups on paid plans; on the free tier, Neon retains a short point-in-time restore window (check your project's Neon dashboard for the current retention period). For an explicit backup you control yourself, use `pg_dump` against your connection string:

```powershell
pg_dump "your-database-url-here" > backup.sql
```

To restore it into a (Postgres) database:

```powershell
psql "your-database-url-here" < backup.sql
```

If you're running Postgres locally instead of Neon, the same `pg_dump` / `psql` commands work identically against your local connection string.

## Reset the Demo Data

The following command deletes the current records and recreates the demonstration accounts and sample data:

```powershell
npm run db:seed
```

This may recreate:

* Demonstration users
* Farmers
* Harvest records
* Produce listings
* Logistics orders
* Drivers
* Delivery companies
* Activity records

> **Warning:** Do not run this command after entering important data unless you intend to reset the database.

## View or Edit the Database

Run Drizzle Studio:

```powershell
npm run db:studio
```

The terminal will display a local address.

Open that address in your browser to view and manage the database tables.

(Neon also has its own web-based SQL editor and table browser in the Neon console, if you'd rather use that.)

## Database Configuration

Local environment settings are stored in:

```text
.env.local
```

Example configuration using a free Neon database (works the same for local development and production):

```env
DATABASE_URL=postgresql://user:password@your-neon-host.neon.tech/farm2market?sslmode=require
JWT_SECRET=replace-with-a-long-random-secret
```

Example configuration using a **locally installed Postgres** instead of Neon:

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/farm2market
JWT_SECRET=replace-with-a-long-random-secret
```

After setting or changing `DATABASE_URL`, run:

```powershell
npm run db:push
npm run db:seed
```

Whichever `DATABASE_URL` you set is what the app connects to — the exact same variable is used for local development, staging, and production. There is no separate "local-only" database mode anymore.

## Available Commands

### Install Dependencies

```powershell
npm install
```

### Prepare the Database

```powershell
npm run setup:local
```

### Start the Development Server

```powershell
npm run dev
```

### Create or Update Database Tables

```powershell
npm run db:push
```

### Load Demonstration Data

```powershell
npm run db:seed
```

### Open Drizzle Studio

```powershell
npm run db:studio
```

### Create a Production Build

```powershell
npm run build
```

### Start the Production Build

```powershell
npm run start
```

## Production-Style Local Run

Create an optimized production build:

```powershell
npm run build
```

Start the production server:

```powershell
npm run start
```

Open:

```text
http://localhost:3000
```

## Troubleshooting

### `next` Is Not Recognized

Example error:

```text
'next' is not recognized as an internal or external command
```

This usually means the dependencies were not installed successfully.

Run:

```powershell
npm install
```

Then start the application again:

```powershell
npm run dev
```

### `drizzle-kit` Is Not Recognized

Example error:

```text
'drizzle-kit' is not recognized as an internal or external command
```

Run:

```powershell
npm install
```

Then:

```powershell
npm run setup:local
```

### `DATABASE_URL is not set` Error

This means `.env.local` is missing or doesn't have `DATABASE_URL` filled in. Copy the template and fill it in:

```powershell
copy .env.example .env.local
```

Then open `.env.local` and set `DATABASE_URL` to a real Postgres connection string (see [Database Configuration](#database-configuration)).

### Connection / TLS Errors Connecting to Neon

If you see an error mentioning `self signed certificate`, `SSL`, or `TLS` when connecting to Neon (this is a common issue inside WSL in particular), it's almost always a certificate-verification problem, not a real security issue with your connection. This project already handles it automatically: `src/db/index.ts` detects Neon hosts and connection strings with `sslmode=require` and relaxes strict certificate-chain verification (`rejectUnauthorized: false`) while still using an encrypted connection.

If you still hit a TLS error after pulling this update:

1. Confirm your `DATABASE_URL` in `.env.local` is the **exact** string Neon gave you (including `?sslmode=require` at the end).
2. Confirm you reinstalled dependencies after this update (`npm install`), since the database driver package changed.
3. If you're on WSL, try the same `DATABASE_URL` from a native Windows terminal (PowerShell) to confirm whether it's WSL-specific — if it only fails in WSL, it's a WSL root-certificate issue rather than an app issue.

### npm Registry Timeout

If npm reports an `ETIMEDOUT` error involving an `applied-caas-gateway` address, set npm to use the public registry:

```powershell
npm config set registry https://registry.npmjs.org/
```

Confirm the registry:

```powershell
npm config get registry
```

It should return:

```text
https://registry.npmjs.org/
```

Then reinstall:

```powershell
npm install --registry=https://registry.npmjs.org/
```

### Interrupted or Incomplete Installation

Close Visual Studio Code, Command Prompt, and any running Node.js process.

Then run:

```powershell
taskkill /F /IM node.exe
```

Delete the incomplete installation folders:

```powershell
rmdir /S /Q node_modules
rmdir /S /Q .next
```

Reinstall the packages:

```powershell
npm install
```

Then prepare the database:

```powershell
npm run setup:local
```

Windows users can also double-click:

```text
repair-install.bat
```

### OneDrive File-Locking Errors

Errors such as `EBUSY` or `EPERM` may occur when the project is stored inside OneDrive.

Move the project to:

```text
C:\Projects\farm2market-local
```

Then reinstall:

```powershell
npm install
```

### Port 3000 Is Already in Use

Start the application on another port:

```powershell
npm run dev -- -p 3001
```

Open:

```text
http://localhost:3001
```

### Homepage Images Are Not Showing

Confirm that the following files exist:

```text
public\images\hero-farm.jpg
public\images\farmer-smile.jpg
public\images\fresh-produce.jpg
public\images\delivery-truck.jpg
public\images\farmer-harvest.jpg
```

Stop and restart the development server after adding or replacing images.

## Security Notes

* Keep `.env.local` private.
* Do not commit `.env.local` to GitHub.
* Change `JWT_SECRET` before entering real user data — the app will refuse to start in production without it set.
* Never commit your `DATABASE_URL` (it contains your database password) or any real database credentials to source control.
* Do not store production passwords directly in the source code.
* Use strong passwords for real user accounts.
* Review authentication and authorization before deploying publicly.

## Git Repository Notes

The following files and folders should not be committed:

```text
node_modules/
.next/
.env
.env.local
npm-debug.log*
```

Each developer should create their own `.env.local` with their own `DATABASE_URL` (either their own Neon project/branch, or their own local Postgres) by running:

```powershell
npm install
copy .env.example .env.local
:: then edit .env.local to set DATABASE_URL
npm run setup:local
npm run dev
```

Tip: Neon supports database branching (similar to Git branches) — each teammate can create their own branch off the main Neon project for isolated local development without needing a separate signup.

## Deploying to a Live Server

The app can be deployed to Vercel, Railway, or any other Node.js host, since it now connects to a real hosted Postgres database (Neon) rather than a local file — no code changes are needed between local development and production.

### 1. Create a free Neon database (if you haven't already)

1. Sign up at [neon.tech](https://neon.tech).
2. Create a project — this gives you a connection string that looks like:
   ```text
   postgresql://user:password@ep-example-123456.us-east-2.aws.neon.tech/farm2market?sslmode=require
   ```
3. Save this connection string — you'll use it as `DATABASE_URL` in the steps below.

### 2. Push the schema to your database

Run this locally, with `DATABASE_URL` set in `.env.local` to your Neon connection string, so drizzle-kit creates the tables:

```powershell
npm run db:push
npm run db:seed
```

### 3a. Deploying on Vercel

1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New** → **Project** → import your repository.
3. Vercel auto-detects Next.js (Build Command `npm run build`, Output uses Next.js defaults) — no changes needed there.
4. Under **Environment Variables**, add:

   | Key | Value |
   | --- | --- |
   | `DATABASE_URL` | your Neon connection string |
   | `JWT_SECRET` | a long random string — generate with `openssl rand -base64 32` |
   | `NODE_ENV` | `production` |

5. Click **Deploy**.

Every subsequent `git push` to your default branch automatically redeploys.

### 3b. Deploying on Railway

1. Push your code to GitHub.
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo** → select your repository.
3. Under the service's **Variables** tab, add the same three variables as above: `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`.
4. Under **Settings**, confirm the build command is `npm run build` and the start command is `npm run start` (Railway usually detects this automatically for Next.js).
5. Deploy. Railway gives you a live `*.up.railway.app` URL, and (like Vercel) redeploys automatically on every push.

> You can use the same Neon database for both a Vercel and a Railway deployment if you're just comparing hosts — just be aware they'd be sharing the same live data.

### Notes

* `JWT_SECRET` is required in production — the app intentionally refuses to start without it, so a real deployment can never silently run with the insecure local default.
* Neon's free tier is generous enough for demos, pilots, and small production use; check [neon.tech/pricing](https://neon.tech/pricing) for current limits.
* If you ever need to move off Neon to a different Postgres provider (e.g. Railway's own Postgres, Supabase, RDS), you only need to change `DATABASE_URL` — no code changes required, since the app speaks standard Postgres via `pg` and Drizzle ORM.

## Project Status

This repository represents a working Farm2Market MVP with PostgreSQL (Neon) support, ready for deployment to Vercel or Railway.

Further production work may include:

* Payment integration
* Live vehicle tracking
* Notifications
* Email and SMS integration
* Marketplace checkout
* Delivery pricing rules
* Automated testing
* Audit and security improvements

## Licence

Add the appropriate project licence here before distributing the application publicly.
