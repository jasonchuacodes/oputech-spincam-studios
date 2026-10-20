# Oputech POS

**Oputech** POS is an installable, offline-capable point-of-sale and business operations system. It combines sales processing, expense tracking, reporting, product management, and user administration in a responsive PWA.

## Features

### Point of sale

- Searchable product catalog grouped into main products and add-ons
- Desktop and mobile cart experiences
- Cash and online payment methods
- Automatic cart draft recovery after a refresh or app restart
- Local-first transaction creation so sales can continue without a connection

### Offline support and synchronization

- Installable Progressive Web App with a cached application shell
- IndexedDB storage, powered by Dexie, for products, drafts, pending operations, and the latest 30 days of transactions
- Offline transaction creation and deletion through a durable outbox
- Automatic synchronization when the API becomes reachable, the app regains focus, or the device reconnects
- Serial outbox processing with retries, exponential backoff, and blocked-operation reporting
- Idempotent transaction creation through client mutation IDs
- Visible online, offline, syncing, pending, and blocked states with manual retry support
- Cached authentication allows an existing session to be used offline for up to seven days

MongoDB remains the authoritative data store. A device must sign in online once to cache its session, product catalog, and transaction history. Reports, product changes, and user administration are only available while online and after pending transactions have synchronized.

### Transactions and expenses

- Daily transaction history with date filtering
- Separate sale and expense records
- Cash and online payment tracking
- Expense logging with custom labels and amounts
- Per-transaction synchronization and reporting status
- Deletion of transactions that have not yet been included in a report

### Reports

- Daily report preview before generation
- Product-level quantity, unit price, sales total, and print-count breakdowns
- Cash, online payment, total income, expense, and total print summaries
- Included expense details
- Generated report history and report detail views
- Remittance tracking for administrators

### Dashboard and analytics

- Sales and expense summary cards
- Sales-versus-expenses chart
- Top-selling products
- Today, 7-day, 15-day, monthly, and 6-month reporting ranges

### Product management

- Product catalog split into main products and add-ons
- Product search
- Product name, price, image, category, and print-count management
- Administrator-controlled product creation, editing, and deletion

### Users and access control

- User and administrator roles with protected routes
- Secure JWT authentication with access and refresh cookies
- User creation, editing, deletion, and password reset
- User activity status and optional status messages
- Separate administrator sign-in flow

## Technology stack

This repository is a pnpm workspace containing:

- **Client:** React 19, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS, Chart.js, Dexie, and Workbox
- **Server:** NestJS 10, TypeScript, GraphQL/Apollo, Mongoose, MongoDB, Passport JWT, and bcrypt
- **API:** REST endpoints for authentication and health checks, plus GraphQL queries and mutations for application data

## Project structure

```text
.
├── client/   # React PWA
├── server/   # NestJS API and GraphQL server
└── package.json
```

## Getting started

### Prerequisites

- Node.js 20 or newer
- pnpm 10
- A MongoDB database

### 1. Install dependencies

From the repository root:

```bash
pnpm install
```

### 2. Configure the environment

Copy both example environment files:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Client variables:

```dotenv
VITE_API_URL=http://localhost:3000/api
VITE_GRAPHQL_URL=http://localhost:3000/graphql
```

Server variables:

| Variable | Purpose |
| --- | --- |
| `PORT` | API port; defaults to `3000` |
| `CLIENT_URL` | Allowed client origin for CORS |
| `TZ` | Server timezone; defaults to `Asia/Manila` |
| `MONGO_URI` | MongoDB connection string |
| `JWT_ACCESS_SECRET` | Access-token signing secret |
| `JWT_ACCESS_EXPIRES_IN` | Access-token lifetime |
| `JWT_REFRESH_SECRET` | Refresh-token signing secret |
| `JWT_REFRESH_EXPIRES_IN` | Refresh-token lifetime |
| `ADMIN_SCRIPT_SECRET` | Secret used by the initial admin registration script |

Use strong, unique secrets outside local development.

### 3. Start the application

Start the server from the repository root:

```bash
pnpm --filter @spincam/server dev
```

In another terminal, start the client:

```bash
pnpm --filter @spincam/client dev
```

The client runs at `http://localhost:5173` and the server at `http://localhost:3000` by default.

### 4. Create the initial administrator

With the server running and `ADMIN_SCRIPT_SECRET` configured, run:

```bash
pnpm --filter @spincam/server register-admin -- --username admin --password <password>
```

The script uses `http://localhost:3000/api` by default. Set `API_URL` in the server environment when registering against another deployment.

## Available commands

| Command | Description |
| --- | --- |
| `pnpm --filter @spincam/client dev` | Start the Vite client |
| `pnpm --filter @spincam/server dev` | Start the NestJS server |
| `pnpm --filter @spincam/client build` | Build the production client |
| `pnpm --filter @spincam/server build` | Build the production server |
| `pnpm --filter @spincam/client lint` | Lint the client |
| `pnpm --filter @spincam/server lint` | Lint the server |
| `pnpm --filter @spincam/client test` | Run client tests |
| `pnpm --filter @spincam/server test` | Run server tests |

## Offline operation notes

- Open and sign in to the app online before relying on offline mode.
- The locally cached catalog and recent history are refreshed after synchronization completes.
- Offline sales and eligible transaction deletions are queued in the order they occurred.
- Keep the app open after reconnecting until the pending count reaches zero.
- Resolve blocked synchronization items before generating reports or changing products and users.
- Browser storage can be cleared by the browser or operating system, so pending data should be synchronized as soon as a connection is available.
