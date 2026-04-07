## What is the x402 protocol?

**x402 is an open payment protocol that revives HTTP status code 402 ("Payment Required") so that AI agents and software clients can pay for API requests on a per-call basis using stablecoins.** Instead of API keys or monthly subscriptions, an x402-enabled server responds to an unauthenticated request with a signed payment requirement; the client signs a USDC transfer for the exact amount, retries, and gets the response. Settlement is on-chain — typically Base — and finalizes in under a second.

x402 was originally proposed as part of the agent payments stack and is designed specifically for use cases where the client is not a human: autonomous agents, batch jobs, and CI pipelines that need to call APIs they have no prior relationship with.

## How x402 works in 4 steps

1. **Client makes a request** to a protected endpoint with no auth.
2. **Server responds 402** with a JSON body specifying the payment amount, recipient address, asset (USDC), network (Base), and a nonce.
3. **Client signs a USDC transfer** for that exact amount and retries the request with the signed payment as a header.
4. **Server verifies the payment**, broadcasts it on-chain, and returns the response. Settlement is final in ~400ms.

There are no accounts. No API keys. No invoices. The payment *is* the auth.

## Why x402 matters

The current API economy is built around two assumptions: (1) the customer is a human who can sign up, and (2) usage is predictable enough to bill monthly. AI agents break both. They can't fill out signup forms, they don't have credit cards, and their usage spikes from zero to a million calls in a single task.

x402 collapses signup, billing and authentication into a single per-request step. The agent doesn't need to know the API exists in advance, doesn't need to manage credentials, and only pays for the responses it actually gets.

## Comparison to alternatives

| Method | Account needed | Pay per request | Works for agents | Settlement |
|---|---|---|---|---|
| API keys + Stripe | Yes | No (monthly) | Hard | Off-chain |
| OAuth | Yes | No | Very hard | Off-chain |
| HTTP basic auth | Yes | No | Hard | None |
| **x402** | **No** | **Yes** | **Native** | **On-chain (~400ms)** |

## FAQ

**Is x402 a blockchain protocol?**
It's a payment protocol layered on HTTP. Settlement happens on-chain (Base by default), but the protocol itself is just an HTTP convention plus a signed payment header.

**What stablecoin does x402 use?**
USDC is the default. Any ERC-20 stablecoin can be supported with the right facilitator.

**Do I need a wallet to use x402 as a developer?**
Yes — to receive payments you need an EVM wallet address. To make payments your client needs a funded wallet.

**How is x402 different from L402?**
L402 settles over the Bitcoin Lightning Network and is closely tied to Lightning's UX. x402 settles on EVM chains using USDC, which is closer to how today's AI agents already hold value. Both share the spirit of HTTP 402.
