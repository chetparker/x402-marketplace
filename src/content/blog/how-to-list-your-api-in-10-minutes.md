## How to list your API on PayAPI Market in 10 minutes

**Listing an API on PayAPI Market takes about 10 minutes if you already have a working HTTP API.** You wrap it in an MCP server using a template, add x402 payment middleware (one config block, around 20 lines), deploy to Railway or Vercel, and submit the URL plus your wallet address to PayAPI Market. Within minutes your endpoints are live in the marketplace and discoverable by every AI agent on the network. There is no review queue and no upfront fee.

## What you need before you start

- An existing HTTP API (any language, any host)
- A GitHub account
- An EVM wallet address (Coinbase Wallet, Metamask, or any Base-compatible wallet)
- About 10 minutes

## Step 1 — Clone the MCP starter

PayAPI Market maintains a starter template that wraps any HTTP API in an MCP server with x402 payments pre-wired. Clone it, point it at your existing endpoints, and you're 80% done.

## Step 2 — Add your endpoints

Edit the `endpoints.json` file to list each endpoint you want to monetise. For each one, set:

- The path on your existing API
- A short description (used by agents to discover the tool)
- The price per request (e.g. `$0.001`)
- The input schema (JSON Schema — optional but recommended)

## Step 3 — Configure x402

Drop your wallet address into the `x402.config.js` file. Pick a network (Base is the default). That's it — payments will be settled directly to your wallet on every successful call.

## Step 4 — Deploy

Push to Railway, Vercel, Fly, or any host that runs Node. The MCP server exposes a single SSE endpoint at `/mcp/sse` that AI clients connect to.

## Step 5 — List on PayAPI Market

Go to payapi.market, click "List your API", paste your repo URL, deployed URL and wallet address. The marketplace auto-imports your endpoints, runs a quick liveness check, and lists you within minutes. Free tier — 3% platform fee, you keep 97%.

## Step 6 — Test from Claude Desktop

Add this to your Claude Desktop config to call your own API as a sanity check:

```
"mcpServers": { "payapi": { "url": "https://payapi.market/mcp/sse" } }
```

Restart Claude Desktop. Ask it to use one of your tools. If your wallet has USDC on Base, the call will go through and you'll see the payment land in seconds.

## What happens next

Once listed:

- Every agent that connects to PayAPI Market can discover and call your endpoints
- You get a live analytics dashboard (calls, revenue, top endpoints, latency)
- You're auto-synced to the official MCP Registry, mcp.so, PulseMCP and Smithery
- Payments settle directly to your wallet — no monthly invoicing, no payouts to wait for

## FAQ

**Do I need to write any payment code myself?**
No. The x402 middleware handles the 402 response, payment verification, and on-chain settlement. You just set a price per route.

**Can I update prices later?**
Yes — change them in your config file, redeploy, and the marketplace auto-detects the new prices on the next sync (usually within a minute).

**What if my API goes down?**
The marketplace runs liveness checks and surfaces uptime in your card. Persistent downtime drops your ranking but doesn't delist you. Fix it and you're back.
