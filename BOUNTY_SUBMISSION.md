# Onchain POAPs — Bounty Submission

## 🌟 Executive Summary

**Onchain POAPs** is an open-source, museum-grade web application and **Farcaster Mini App** designed for the Onchain POAPs protocol deployed on **Base Sepolia**.

Unlike generic dashboards or competitors with brittle off-chain dependencies, this implementation is built around a single unifying principle: **"Onchain memories — create, share, collect, verify."** It pairs Apple-level visual craftsmanship and Linear-level UI polish with direct, zero-trust smart contract integration.

---

## 🔗 Key Links & Repository

* **Live Application URL**: [https://onchain-poaps-ebon.vercel.app](https://onchain-poaps-ebon.vercel.app)
* **Farcaster Mini App Manifest**: [https://onchain-poaps-ebon.vercel.app/.well-known/farcaster.json](https://onchain-poaps-ebon.vercel.app/.well-known/farcaster.json)
* **GitHub Repository**: [https://github.com/EFTAKHAR-AMIN-SAKIB/onchain-poaps](https://github.com/EFTAKHAR-AMIN-SAKIB/onchain-poaps)
* **Base Sepolia Smart Contract**: [`0xC3249356a483fbe17d5355D39105D2eA666d9de6`](https://sepolia.basescan.org/address/0xC3249356a483fbe17d5355D39105D2eA666d9de6#code)
* **Network & Chain ID**: Base Sepolia (`84532`)
* **Standard**: ERC-1155 Multi-Token + ERC-1155Supply + SSTORE2 + CAIP-2

---

## 🏆 Signature Features

1. **POAP Studio & SVG Engine**:
   - Interactive badge designer: 6 vector shapes (Scallop/Stamp, Classic Circle, Hexagon, Archival Medallion, Orbital Rings, Shield).
   - 8 museum palettes (Archival Gold, Base Cobalt, Obsidian Slate, Emerald Heritage, Wax Crimson, Amethyst Velvet, Amber Ember, Cyber Neon).
   - Emojis, custom monograms/initials, vector icons, curved typography along circular SVG paths.
   - **SSTORE2 Minifier & Gas Estimator**: Automatically strips metadata, comments, rounds coordinates, and shows exact Base gas savings (~85% savings).
   - **DOMPurify Security Sanitizer**: Rejects `<script>`, `onload`, `javascript:`, and unsafe vector injections.

2. **Full-Spectrum Contract Functionality**:
   - `registerEvent`: All 4 bit-flag permutations supported (0: private+transferable, 1: private+soulbound, 2: public+transferable, 3: public+soulbound).
   - `mint`: 1-per-wallet public claim.
   - `allowlistMint`: OpenZeppelin-compatible commutative Merkle tree branch proof verification.
   - `mintWithSignature`: Creator EIP-191 ECDSA signature claim (`keccak256(abi.encodePacked(eventId, chainId, recipient))`).
   - `creatorMint`: Batch direct drop to up to 101 recipient addresses in a single transaction.
   - `updateAllowlistRoot`: Creator-only 1-time update within 30-day window.
   - `updateEventPublic`: Creator-only public toggle within 30-day window.
   - `uri`: Dynamic onchain Base64 JSON and SSTORE2 SVG decoder.

3. **Creator Live Event Console & Projector Mode**:
   - Fullscreen Projector screen for conference stages and meetups with high-contrast scannable QR.
   - Zero-gas creator signature generator.
   - Live 37-day claim window countdown clock.
   - Downloadable printable vector QR codes in PNG and SVG.

4. **Allowlist Manager**:
   - CSV / TXT / multi-line address importer with deduplication and checksum normalization.
   - Instant Merkle tree calculation & downloadable proof bundles (JSON & CSV).
   - 1-click onchain publish button.

5. **Zero-Trust Verification Engine**:
   - Standalone `/verify` route and `/verify/[id]/[address]` shareable certificate page.
   - Real-time onchain balance, mint state, and BaseScan transaction proof checks.

6. **Museum Memory Gallery**:
   - Personal onchain album separating Collected POAPs and Created Events.
   - 3D interactive badge tilt with dynamic specular lighting.
   - Year filters, search, and ownership badges.

7. **21-Chapter Interactive Documentation**:
   - 21 comprehensive guides with plain-English overviews and technical developer deep-dives.

8. **Farcaster Mini App & Frame v2 Integration**:
   - Conforming `/.well-known/farcaster.json` manifest.
   - Automatic `sdk.actions.ready()` initialization.
   - 1-click Farcaster Cast composer for sharing badges directly in Warpcast feeds.

---

## 🧪 Verification & Reproduction Instructions

### 1. Verify Smart Contract State
Run the automated test suite against the live Base Sepolia contract:

```bash
node scripts/test-contract-and-crypto.mjs
```

Expected output:
* Connected to `0xC3249356a483fbe17d5355D39105D2eA666d9de6` on Base Sepolia (`84532`).
* `totalEvents()` queried successfully.
* Genesis POAP #0 queried and Base64 SVG decoded.
* Merkle tree sorted-pair generation and leaf proof verification passed.
* EIP-191 message hash and signer recovery passed.
* Malicious SVG rejected and valid SVG optimized.

### 2. Local Reproduction
```bash
npm install
npm run typecheck
npm run build
npm run dev
```

---

## 📢 Farcaster Cast Announcement

**Cast Text:**
> Every event leaves a mark. ✦
> 
> Proud to introduce the Onchain POAPs Frontend & Farcaster Mini App!
> 
> 🏛️ 100% Onchain SVG & Metadata on @base (no IPFS, no servers)
> 🎨 Built-in POAP Studio & SSTORE2 gas optimizer
> ⚡ 4 distribution flows: Public, Merkle Allowlist, Live Event QR, & Creator Drops
> 🛡️ Zero-trust verification engine & museum memory gallery
> 
> Try the Mini App: https://onchain-poaps-ebon.vercel.app
> GitHub: https://github.com/EFTAKHAR-AMIN-SAKIB/onchain-poaps
> 
> cc @jvaleska.eth @kenny 🔵

**Cast Screenshot Reference:**
![Farcaster Cast Submission Reference](https://onchain-poaps.vercel.app/og.png)
