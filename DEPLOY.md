# Deploying the Portfolio (Cloudflare Workers)

Saved content is stored in Cloudflare KV, so every device sees the same data. No GitHub repo or token is needed.

## One-time setup

Run these in the project folder.

1. Log in to Cloudflare:
   ```
   npx wrangler login
   ```

2. Create the storage namespace:
   ```
   npx wrangler kv namespace create CONTENT
   ```
   It prints an `id`. Open `wrangler.jsonc` and replace `REPLACE_WITH_KV_NAMESPACE_ID` with that id.

3. Set the Studio passcode (you will be asked to type it):
   ```
   npx wrangler secret put STUDIO_PASSCODE
   ```

## Deploy

```
npm run build
npx wrangler deploy
```

Your site is then live at `https://prashanth-reddy-s-portfolio.prashanthportfolio.workers.dev`.

## Check

- `/api/health` should show `"configured": true`, `"canRead": true`, `"canWrite": true`.
- In the Studio (✎ EDIT), enter the passcode, change something, and click **Save for everyone**. The page reloads with the change.
- Open the site on another device. It should show the same content.

## Local testing

Create a file named `.dev.vars` in this folder with:
```
STUDIO_PASSCODE=your_passcode
```
Then run `npm run build` and `npx wrangler dev`, and open http://127.0.0.1:8787.
