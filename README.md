# Spincam POS Hibalag
Digitalization tool for business operations

## Offline POS

The installed PWA stores the product catalog, the latest 30 days of transactions,
drafts, and pending transaction operations in browser IndexedDB through Dexie.
MongoDB remains the authoritative server database. Pending work syncs serially when
the API is reachable, and transaction creates are protected by a client mutation ID.

Before releasing the offline client, deploy the server changes and run the
transaction timestamp migration once from `server/`:

```bash
pnpm migrate-transaction-occurrence
```

The device must sign in online once to seed its offline catalog and transaction
history. Reports, inventory writes, and user administration require the device to
be online with no pending synchronization work.

Run the offline-focused tests with:

```bash
pnpm --filter @spincam/client test
pnpm --filter @spincam/server test
```
