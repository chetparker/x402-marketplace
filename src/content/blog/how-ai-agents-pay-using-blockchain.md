## How AI agents pay for data using blockchain

Last Tuesday at 3:47 AM, an AI agent hit my Postcode Lookup API. It got back a 402 status code: "pay me $0.001 in USDC on Base." The agent's wallet signed the payment. My server verified it on-chain. The postcode data was returned. Total elapsed time: 380 milliseconds. No human was awake for any of this.

That single transaction explains the entire shift happening in API payments right now.

## Why credit cards don't work for machines

An AI agent cannot fill out a Stripe checkout form. It has no name, no email, no billing address, no credit card number. Even if you pre-loaded credentials into the agent, Stripe's minimum transaction fee is $0.30 plus 2.9%. A $0.001 API call would cost $0.30 in fees. That is a 30,000% surcharge.

Credit cards were designed for humans buying coffee. They were not designed for machines making 11,000 API calls in a month at a tenth of a penny each.

## The x402 payment flow

Here is exactly what happens when an agent pays for an API call:

**Step 1.** The agent sends a normal HTTP request: `GET /api/postcode/SW1A1AA`

**Step 2.** The server responds with HTTP 402 and a JSON body:
```json
{
  "price": "0.001",
  "currency": "USDC",
  "network": "base",
  "recipient": "0x742d35Cc...",
  "nonce": "abc123"
}
```

**Step 3.** The agent's wallet signs a USDC transfer for $0.001 and retries the request with the payment proof in a header.

**Step 4.** The server verifies the signed payment, broadcasts it on Base, and returns the postcode data. Settlement is final.

No accounts created. No API keys exchanged. No subscription started.

## Why USDC on Base specifically

There are thousands of blockchains. Why this one?

**Transaction speed.** Base confirms transactions in under a second. Ethereum mainnet takes 12 seconds. Agents can't wait 12 seconds for every API call.

**Transaction cost.** A payment on Base costs less than $0.001 in gas. On Ethereum mainnet, the same payment costs $0.50 to $5.00. When you are paying $0.001 for a postcode lookup, the gas fee can't be more than the payment itself.

**Coinbase backing.** Base is built by Coinbase. USDC is issued by Circle (co-founded with Coinbase). The x402 protocol was created at Coinbase. The entire stack is designed to work together.

**Stablecoin stability.** USDC is pegged 1:1 to the US dollar. An agent paying $0.001 today will pay $0.001 tomorrow. No volatility risk, no conversion math.

## The cost comparison

| Payment method | Fee on a $0.001 transaction | Settlement time |
|---|---|---|
| Stripe (credit card) | $0.30 (30,000% fee) | 2-7 days |
| PayPal | $0.30 minimum | 1-3 days |
| Wire transfer | $15-30 | 1-5 days |
| USDC on Base (x402) | <$0.0001 | <1 second |

The numbers are not close.

## What this looks like in practice

On PayAPI Market, 10 APIs processed 72,400 requests in the first month. Total revenue: $2,200. Total support tickets: zero.

The most popular API is a simple postcode lookup. It charges $0.001 per request. It processed 11,400 requests and earned $228 last month. The API took me an afternoon to build. I haven't touched it since.

Every one of those 11,400 payments settled on-chain. Each one took less than a second. Each one cost less than a tenth of a penny in fees.

## What this means for API providers

If you have data that software needs, you can sell it to AI agents today. You do not need a Stripe account. You do not need to build a billing system. You do not need to manage API keys or user accounts.

You need three things:

1. An HTTP API (any language, any host)
2. A wallet address to receive USDC
3. x402 middleware (about 20 lines of config)

Set your price per request. Deploy. The agents will find you through MCP, pay you in USDC, and you keep 97% of every transaction.

The boring APIs earn the most. Postcodes, company lookups, email verification, VAT checks. Things every agent needs, thousands of times a day.

---

*List your API on [PayAPI Market](https://payapi.market/list). 10 minutes to set up. $0 upfront.*
