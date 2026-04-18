# CipherStack

A cascade encryption builder. Chain multiple cipher algorithms together, configure each one, and see every intermediate transformation in real time.

## Features

- **8 cipher algorithms** — Caesar, Vigenère, XOR, Rail Fence, Columnar Transposition, ROT13, Reverse, Base64
- **Live intermediate output** — each node shows what it received and what it produced
- **Encrypt & Decrypt** — switch modes; the pipeline automatically reverses for decryption
- **Configurable nodes** — shift amount, keyword, rail count, XOR key — all editable inline
- **Reorderable pipeline** — move nodes up/down to change the encryption order
- **Mobile responsive** — cipher strip at the top on small screens, sidebar on desktop

## Cipher reference

| Cipher | Configurable | Config |
| --- | --- | --- |
| Caesar | yes | shift (number) |
| Vigenère | yes | keyword (text) |
| XOR | yes | key (text) — output is hex |
| Rail Fence | yes | rails (number ≥ 2) |
| Columnar | yes | keyword (text) |
| ROT13 | no | — |
| Reverse | no | — |
| Base64 | no | — |

## How to add a new cipher

Create an object conforming to `CipherDefinition` in [ciphers/registry.ts](ciphers/registry.ts):

```ts
mycipher: {
  id: "mycipher",
  label: "My Cipher",
  description: "What it does",
  configurable: true,
  configSchema: [{ name: "key", label: "Key", type: "text", default: "abc" }],
  defaultConfig: { key: "abc" },
  encrypt: (input, config) => { /* ... */ return output; },
  decrypt: (input, config) => { /* ... */ return original; },
}
```

That's it — the UI picks it up automatically.

## Tech stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 — dark theme, no config file
- All cipher logic is pure TypeScript, no external libraries

## Run locally

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
```
