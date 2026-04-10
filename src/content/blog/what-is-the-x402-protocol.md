## What is the x402 protocol?

HTTP status code 402 was reserved for "future use" in 1997. Twenty-nine years later, Coinbase built a payment protocol on top of it. That protocol is x402.

**x402 lets AI agents pay for API calls using USDC.** No API keys. No accounts. No subscriptions. The agent makes a request, the server says "pay me $0.001", the agent signs a USDC transfer, and the server returns the data. The whole thing takes about 400 milliseconds.

Settlement happens on Base (Coinbase's L2 network). The payment is the auth.

## How x402 works in 4 steps

1. **Client makes a request** to a protected endpoint with no auth.
2. **Server responds 402** with a JSON body: price, recipient wallet address, asset (USDC), network (Base), and a nonce.
3. **Client signs a USDC transfer** for that exact amount and retries the request with the signed payment as a header.
4. **Server verifies the payment**, broadcasts it on-chain, and returns the response. Settlement is final in about 400ms.

No accounts. No API keys. No invoices. The payment *is* the auth.

## Why this matters

The current API economy assumes two things: the customer is a human who can sign up, and usage is predictable enough to bill monthly. AI agents break both assumptions. They can't fill out forms. They don't have credit cards. Their usage spikes from zero to a million calls in a single task.

x402 collapses signup, billing, and authentication into a single per-request step. The agent doesn't need to know the API exists in advance, doesn't need to manage credentials, and only pays for the responses it actually gets.

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
Yes. To receive payments you need an EVM wallet address. To make payments your client needs a funded wallet.

**How is x402 different from L402?**
L402 settles over the Bitcoin Lightning Network. x402 settles on EVM chains using USDC, which is closer to how today's AI agents already hold value. Both use the spirit of HTTP 402.
