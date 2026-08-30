# Onchain POAPs — Every Event Leaves a Mark ✦

[![Base Sepolia](https://img.shields.io/badge/Network-Base%20Sepolia%20(84532)-0052FF?style=flat-square&logo=ethereum)](https://sepolia.basescan.org/address/0xC3249356a483fbe17d5355D39105D2eA666d9de6#code)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Farcaster Mini App](https://img.shields.io/badge/Farcaster-Mini%20App%20v2-8A63D2?style=flat-square)](https://miniapps.farcaster.xyz/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)

An open-source, museum-grade web application and **Farcaster Mini App** for the **Onchain POAPs protocol** deployed on **Base Sepolia**. 

---

## 🏛️ Design Philosophy: "Onchain Memories"

Traditional POAPs and NFT badges suffer from off-chain fragility: server outages, broken IPFS gateways, and metadata link rot.

**Onchain POAPs** store everything—including vector SVG artwork, event titles, coordinates, timestamps, and permissions—directly inside immutable smart contract storage on Base. Even if every frontend ceases to exist, your attendance record remains readable and verifiable directly from the Ethereum Virtual Machine forever.

---

## 🚀 Key Features & Competitive Advantages

| Feature | Competitor Submissions | **Our Implementation** |
| :--- | :--- | :--- |
| **POAP Studio** | Only raw file upload / paste | **Interactive Vector Studio**: shapes (stamp, circle, hexagon, medallion, shield), orbital textures, custom monograms, emojis, and live 3D preview |
| **SSTORE2 Optimizer** | Basic text counter | **Automated Minifier & Gas Estimator**: Strips namespaces, comments, rounds coordinates, and shows exact Base gas savings |
| **Distribution Wizard** | Exposed Solidity bit flags | **4 Plain-English Flows**: Open to Everyone, Selected Guests, Live Event QR, Direct Delivery + Bit flag calculator (0-3) |
| **Live Event Mode** | None / Static QR | **Fullscreen Projector Console**: High-contrast QR, 37-day countdown clock, EIP-191 signature generator, and printable PNG/SVG download |
| **Allowlists** | Manual Merkle math | **Allowlist Manager**: CSV/TXT parser, address deduplicator, OpenZeppelin-compatible Merkle tree builder, proof exporter |
| **Eligibility Engine** | Basic button state | **Smart Diagnostic Checker**: Evaluates wallet connection, `hasClaimed`, public status, Merkle proofs, signatures, and timelocks |
| **Memory Gallery** | Generic token list | **Museum Album**: Collected vs Created events, 3D badge tilt, year filters, search, and ownership badges |
| **Verification Tool** | None / Explorer redirect | **Standalone Verification Engine**: Shareable `/verify/[id]/[address]` certificate route with onchain receipt and CAIP-2 ID |
| **Farcaster Mini App** | Generic iframe | **Native SDK Integration**: Frame v2 manifest, context detection, automatic `sdk.actions.ready()`, and 1-click cast composer |
| **Contract Timelocks** | Hidden rules | **Live Timelock Visualizer**: Real-time countdowns for 30-day creator controls and 37-day signature claim windows |

---

## 📜 Smart Contract Reference (Base Sepolia)

* **Contract Address**: [`0xC3249356a483fbe17d5355D39105D2eA666d9de6`](https://sepolia.basescan.org/address/0xC3249356a483fbe17d5355D39105D2eA666d9de6#code)
* **Chain ID**: `84532` (`baseSepolia`)
* **Standard**: ERC-1155 Multi-Token with ERC-1155Supply & SSTORE2 Storage
* **Multichain Identifier (CAIP-2)**: `eip155:84532:0xC3249356a483fbe17d5355D39105D2eA666d9de6:{eventId}`

### Supported Contract Methods

1. `registerEvent(name, description, eventDate, location, allowlistRoot, svgImage, externalUrl, flags)`
2. `mint(eventId)` — Public 1-per-wallet mint
3. `allowlistMint(eventId, merkleProof)` — OpenZeppelin sorted-pair Merkle proof claim
4. `mintWithSignature(eventId, signature)` — EIP-191 creator signature pass (`keccak256(abi.encodePacked(eventId, chainId, recipient))`)
5. `creatorMint(eventId, recipients)` — Batch drop up to 101 recipients per transaction
6. `updateAllowlistRoot(eventId, newRoot)` — Creator-only, 1-time update within 30-day window
7. `updateEventPublic(eventId, isPublic)` — Creator-only toggle within 30-day window
8. `uri(eventId)` — Onchain dynamic Base64 JSON metadata & SSTORE2 Base64 SVG

---

## 🛠️ Tech Stack

* **Framework**: Next.js 15 (App Router, Server & Client Components)
* **Language**: TypeScript 5.7 (Strict Mode)
* **Styling**: Tailwind CSS + Custom Museum Design System
* **Web3 Integration**: Viem 2 + Wagmi 2 + TanStack Query 5
* **Farcaster**: `@farcaster/frame-sdk` + Mini App Manifest v2
* **Cryptography**: `merkletreejs` (OpenZeppelin commutative sorting), `viem/crypto`
* **SVG Engineering**: Custom DOMPurify Sanitizer + AST Minifier + Real-time Gas Calculator
* **Graphics & QR**: High-resolution vector QR generator + Canvas Confetti + 3D Specular Tilt

---

## 💻 Local Development Setup

### Prerequisites
* Node.js >= 18.17.0
* npm >= 9.0.0

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/onchain-poaps-frontend.git
cd onchain-poaps-frontend

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Typecheck

```bash
# Run TypeScript compilation check
npm run typecheck

# Build for production
npm run build

# Run cryptographic & smart contract tests
node scripts/test-contract-and-crypto.mjs
```

---

## 🗺️ Information Architecture

* **`/`** — Museum hero, live 3D constellation of registered POAPs, value pillars.
* **`/explore`** — Filterable registry of all onchain POAPs (Public, Allowlist, Soulbound, Transferable).
* **`/create`** — 4-Step Wizard: POAP Studio, Event Metadata, Distribution Strategy, Preview & Register.
* **`/poap/[id]`** — Collectible detail page, smart eligibility diagnostic, claim hub, and social sharing.
* **`/poap/[id]/live`** — Creator Live Event console: Fullscreen Projector mode, high-contrast QR, 37-day claim countdown.
* **`/poap/[id]/allowlist`** — Allowlist Manager: CSV/TXT importer, Merkle tree computation, proof export, 1-click onchain publish.
* **`/poap/[id]/drop`** — Creator batch drop to up to 101 attendee wallets per transaction.
* **`/gallery`** — Personal onchain memory album: Collected vs Created events with timeline and search.
* **`/verify`** & **`/verify/[id]/[address]`** — Standalone zero-trust verification engine and verified certificate.
* **`/dashboard`** — Creator Studio: Manage public toggles, allowlists, drops, and timelocks.
* **`/technical`** — Raw contract storage inspector, SSTORE2 reader, and ABI reference.
* **`/docs`** & **`/docs/[slug]`** — 21 comprehensive guides covering every aspect of the protocol.

---

## 📄 License

MIT License. See [LICENSE](./LICENSE) for details.
