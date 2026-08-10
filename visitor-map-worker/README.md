# Visitor map worker

This Cloudflare Worker reads aggregate country statistics from GoatCounter and
returns only the total visitor count and per-country counts. The GoatCounter API
token stays in a Worker secret and is never exposed to the browser.

## Deploy

1. In GoatCounter, create an API token with **Read statistics** permission.
2. Authenticate Wrangler:

   ```sh
   npx wrangler login
   ```

3. Store the token as a secret:

   ```sh
   cd visitor-map-worker
   npx wrangler secret put GOATCOUNTER_TOKEN
   ```

4. Deploy:

   ```sh
   npx wrangler deploy
   ```

5. Set `_config.yml` → `visitor_map.endpoint` to the deployed `/stats` URL.

Never commit the GoatCounter API token.
