## How to list your API on PayAPI Market in 10 minutes

I listed my first API on a Tuesday afternoon. By Wednesday morning it had 847 requests and $12 in revenue. The whole setup took about 10 minutes.

If you have a working HTTP API, you can do the same. Clone a template, set your prices, deploy, and submit. No review queue, no upfront fee.

## What you need

- An existing HTTP API (any language, any host)
- A GitHub account
- An EVM wallet address (Coinbase Wallet, Metamask, or any Base-compatible wallet)
- About 10 minutes

## Step 1. Clone the MCP starter

PayAPI Market maintains a starter template that wraps any HTTP API in an MCP server with x402 payments pre-wired. Clone it, point it at your existing endpoints, and you are 80% done.

## Step 2. Add your endpoints

Edit the `endpoints.json` file to list each endpoint you want to sell. For each one, set:

- The path on your existing API
- A short description (agents use this to discover the tool)
- The price per request (e.g. `$0.001`)
- The input schema (JSON Schema, optional but recommended)

## Step 3. Configure x402

Drop your wallet address into the `x402.config.js` file. Pick a network (Base is the default). That is it. Payments settle directly to your wallet on every successful call.

## Step 4. Deploy

Push to Railway, Vercel, Fly, or any host that runs Node. The MCP server exposes a single SSE endpoint at `/mcp/sse` that AI clients connect to.

## Step 5. List on PayAPI Market

Go to payapi.market, click "List your API", paste your repo URL, deployed URL and wallet address. The marketplace imports your endpoints, runs a quick liveness check, and lists you within minutes. Free tier: 3% platform fee, you keep 97%.

## Step 6. Test from Claude Desktop

Add this to your Claude Desktop config to call your own API as a sanity check:

```
"mcpServers": { "payapi": { "url": "https://payapi.market/mcp/sse" } }
```

Restart Claude Desktop. Ask it to use one of your tools. If your wallet has USDC on Base, the call will go through and you will see the payment land in seconds.

## What happens next

Once listed:

- Every agent that connects to PayAPI Market can discover and call your endpoints
- You get a live analytics dashboard (calls, revenue, top endpoints, latency)
- You are auto-synced to the official MCP Registry, mcp.so, PulseMCP and Smithery
- Payments settle directly to your wallet. No monthly invoicing, no payouts to wait for

## FAQ

**Do I need to write any payment code?**
No. The x402 middleware handles the 402 response, payment verification, and on-chain settlement. You just set a price per route.

**Can I update prices later?**
Yes. Change them in your config file, redeploy, and the marketplace detects the new prices on the next sync (usually within a minute).

**What if my API goes down?**
The marketplace runs liveness checks and surfaces uptime on your card. Persistent downtime drops your ranking but does not delist you. Fix it and you are back.
