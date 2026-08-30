export interface DocSection {
  slug: string;
  title: string;
  category: "Fundamentals" | "Creation & SVG" | "Distribution" | "Security & Mechanics" | "Developer & Integration";
  summary: string;
  content: string;
  technicalDetails?: string;
}

export const DOCS_SECTIONS: DocSection[] = [
  {
    slug: "what-is-onchain-poap",
    title: "1. What is an Onchain POAP?",
    category: "Fundamentals",
    summary: "Understand how Onchain POAPs differ from traditional NFTs and off-chain attendance badges.",
    content: `An Onchain POAP (Proof of Attendance Protocol) is an immutable, decentralized digital badge representing participation in a physical or virtual event.

Unlike legacy POAPs that rely on centralized servers or IPFS gateways that can go offline or suffer link rot, an Onchain POAP stores the entire event record—including its vector SVG artwork, title, location, and timestamps—directly inside the smart contract storage on Base.

Even if all websites, frontends, or hosting providers vanish, your attendance record and artwork remain permanently verifiable and readable directly from the blockchain.`,
    technicalDetails: `The contract follows the ERC-1155 Multi-Token Standard with the ERC-1155 Supply extension. Each Event ID represents an independent token ID. Token artwork is compressed and written to storage contract bytecode using the SSTORE2 library, reducing storage gas costs by over 70% compared to native storage slots.`,
  },
  {
    slug: "creating-a-poap",
    title: "2. Creating a POAP",
    category: "Fundamentals",
    summary: "Step-by-step walkthrough of registering a permanent event memory on Base Sepolia.",
    content: `Registering a POAP is permissionless: anyone with an Ethereum wallet on Base Sepolia can create an event.

The creation flow takes you through four steps:
1. **Artwork**: Design a badge using the built-in POAP Studio, upload an SVG, or paste raw vector code.
2. **Event Details**: Provide the official title, location (e.g., 'Denver, CO' or 'Discord Stage'), event timestamp, and description.
3. **Distribution Strategy**: Decide whether the badge is open to all, restricted by an allowlist, distributed via live QR signatures, or sent directly to recipients.
4. **Preview & Confirm**: Review the exact onchain representation and submit the registration transaction.`,
    technicalDetails: `Executed via the contract method \`registerEvent(name, description, eventDate, location, allowlistRoot, svgImage, externalUrl, flags)\`. The contract assigns an incremental \`eventId\` starting at 1 (0 is reserved for Genesis POAP).`,
  },
  {
    slug: "poap-metadata",
    title: "3. POAP Metadata & ERC-1155 URI",
    category: "Creation & SVG",
    summary: "How JSON metadata and attributes are constructed purely onchain.",
    content: `When OpenSea, Rainbow, MetaMask, or our gallery requests token metadata, the contract dynamically builds an ERC-1155 compliant JSON document entirely onchain in base64 format.

Attributes included in metadata:
- **Event**: The event name
- **Location**: Venue or virtual space
- **Date**: Unix timestamp formatted for collectors
- **EventId**: Local numeric token ID
- **Multichain EventId**: Cross-chain CAIP-2 identifier
- **Creator**: The wallet address that registered the memory
- **Soulbound**: \`true\` or \`false\` flag`,
    technicalDetails: `Function \`uri(uint256 eventId)\` reads the Base64 SVG from the SSTORE2 storage pointer, encodes all traits into a JSON object, and returns \`data:application/json;base64,...\`. No external HTTP servers or IPFS gateways are queried.`,
  },
  {
    slug: "svg-requirements",
    title: "4. SVG Requirements & Best Practices",
    category: "Creation & SVG",
    summary: "Guidelines for crafting vector artwork suitable for onchain permanence.",
    content: `Because every byte of SVG is stored in Ethereum contract storage, optimizing artwork ensures low gas fees while maintaining high visual fidelity.

Rules for Onchain SVGs:
1. Must be valid XML/SVG code starting with \`<svg>\` and ending with \`</svg>\`.
2. Must contain \`xmlns="http://www.w3.org/2000/svg"\` and a \`viewBox\` attribute (e.g., \`0 0 400 400\`).
3. Must not contain active JavaScript (\`<script>\`), event handlers (\`onload\`), or external network references.
4. Avoid embedding huge base64 raster images (\`data:image/png\`); prefer pure vector paths and geometric shapes.`,
    technicalDetails: `The frontend automatically runs DOMPurify to strip any malicious scripting tags and validates that \`bytes(svgImage).length > 0\` before broadcasting the transaction.`,
  },
  {
    slug: "svg-optimization",
    title: "5. SVG Optimization & Gas Savings",
    category: "Creation & SVG",
    summary: "How our built-in optimizer slashes onchain transaction costs.",
    content: `Storing data on Base is very affordable, but unoptimized vector files from Figma or Illustrator often contain hundreds of lines of editor metadata, XML comments, and excessive coordinate precision.

Our integrated optimizer:
- Strips editor metadata (Inkscape, Adobe, Figma namespaces)
- Removes redundant whitespace, comments, and unused tags
- Collapses numeric coordinates to clean 2-decimal precision
- Provides real-time before/after byte count and estimated gas savings`,
    technicalDetails: `Writing bytecode with SSTORE2 costs ~200 gas per byte plus deployment overhead. An unoptimized 15 KB SVG costs ~3.1M gas to register, whereas an optimized 2 KB badge costs under 450k gas—saving over 85% in transaction fees.`,
  },
  {
    slug: "soulbound-vs-transferable",
    title: "6. Soulbound vs Transferable POAPs",
    category: "Security & Mechanics",
    summary: "Choose whether badges remain permanently bound to attendees or can be traded.",
    content: `When creating a POAP, you decide whether it should be:

- **Soulbound (Non-transferable)**: The badge is permanently attached to the recipient's wallet address. It can never be transferred, sold, or gifted to another wallet. This is ideal for authentic attendance, certifications, voting rights, and personal identity.
- **Transferable**: The token behaves like a standard ERC-1155 asset and can be sent, traded, or archived across multiple cold/hot wallets.`,
    technicalDetails: `Enforced by the contract's internal \`_update(from, to, ids, values)\` hook. If \`evt.isSoulbound\` is true and \`from != address(0)\` and \`to != address(0)\`, the transaction reverts with \`POAP__SoulboundNotTransferable()\`.`,
  },
  {
    slug: "public-minting",
    title: "7. Public Minting",
    category: "Distribution",
    summary: "Open attendance claiming for global or permissionless events.",
    content: `Public minting allows anyone with a connected wallet to claim a POAP with a single click.

Key guarantees:
- **One per wallet**: The contract strictly prohibits any address from minting more than one badge per event.
- **Creator toggle**: The event creator can turn public minting on or off during the 30-day management window.`,
    technicalDetails: `Calling \`mint(eventId)\` checks \`events[eventId].isPublic\` and \`!hasClaimed[eventId][msg.sender]\`. Upon minting, \`hasClaimed\` is set to \`true\` and \`_mint(msg.sender, eventId, 1, "")\` is invoked.`,
  },
  {
    slug: "allowlists",
    title: "8. Allowlist Guest Lists",
    category: "Distribution",
    summary: "Restricting POAPs to a curated list of invited attendee wallets.",
    content: `If you have an exclusive guest list (e.g. VIP attendees, hackathon participants, or ticket holders), you can configure an Allowlist.

You simply paste or upload a CSV/TXT list of wallet addresses. Our system automatically parses, deduplicates, and checksums all addresses, then computes a cryptographic Merkle root stored onchain.`,
    technicalDetails: `The Merkle root is set via \`updateAllowlistRoot(eventId, bytes32 newRoot)\`. Attendees claim by providing their cryptographic branch proof via \`allowlistMint(eventId, bytes32[] merkleProof)\`.`,
  },
  {
    slug: "merkle-proofs",
    title: "9. Merkle Proofs Explained",
    category: "Security & Mechanics",
    summary: "How millions of guest addresses are verified with a single 32-byte hash.",
    content: `A Merkle tree allows the blockchain to verify that an attendee is on the guest list without requiring thousands of expensive address writes to contract storage.

Instead of storing 1,000 addresses onchain (which would cost tens of dollars), we store a single 32-byte cryptographic root. When an attendee claims, they submit a tiny ~200-byte proof containing hash siblings that mathematically prove their address belongs to the root.`,
    technicalDetails: `Leaf construction is \`keccak256(abi.encodePacked(msg.sender))\`. Nodes are sorted using OpenZeppelin's standard commutative sorting: \`a < b ? keccak256(abi.encodePacked(a, b)) : keccak256(abi.encodePacked(b, a))\`.`,
  },
  {
    slug: "signature-minting",
    title: "10. Signature-Based Minting",
    category: "Distribution",
    summary: "Real-time, zero-gas creator authorization for live events.",
    content: `Signature minting allows creators to authorize attendance passes in real-time without executing any onchain transaction.

The creator signs a cryptographic message granting a specific attendee permission to mint. The attendee receives the signature (via QR code or link) and submits it to the contract to claim their badge.`,
    technicalDetails: `The signed payload is \`keccak256(abi.encodePacked(eventId, chainId, recipient))\`. In \`mintWithSignature(eventId, signature)\`, the contract recovers the signer with \`message.toEthSignedMessageHash().recover(signature)\` and verifies \`signer == events[eventId].creator\`.`,
  },
  {
    slug: "qr-code-distribution",
    title: "11. QR Codes & Live Event Mode",
    category: "Distribution",
    summary: "Projector mode and printed badge passes for conferences and meetups.",
    content: `Our Live Event feature includes a full-screen Projector Mode designed for conference display screens and stage backdrops.

Features:
- High-contrast scannable QR code
- Live countdown showing remaining claim time
- Standalone attendee claim URLs
- Downloadable high-resolution vector SVGs and PNGs for print materials`,
    technicalDetails: `QR codes encode the claim URL with parameters \`?sig=0x...&recipient=0x...\` or direct event links that automatically trigger the client-side wallet claim flow.`,
  },
  {
    slug: "creator-permissions",
    title: "12. Creator Permissions & Security",
    category: "Security & Mechanics",
    summary: "Strict creator-only access controls enforced by smart contract modifiers.",
    content: `Only the original wallet address that called \`registerEvent\` has administrative permissions over that event.

Protected creator functions:
- \`updateAllowlistRoot\`: Sets the Merkle root
- \`updateEventPublic\`: Opens or closes public minting
- \`creatorMint\`: Executes batch direct drops to recipients`,
    technicalDetails: `Enforced by the \`onlyCreator(eventId)\` modifier, which evaluates \`if (msg.sender != events[eventId].creator) revert POAP__OnlyCreator();\`.`,
  },
  {
    slug: "30-day-rules",
    title: "13. 30-Day Creator Timelock Rules",
    category: "Security & Mechanics",
    summary: "Immutable permanent finality after the 30-day creator window.",
    content: `To ensure true decentralization and prevent creators from modifying events years into the future, the contract enforces a strict **30-Day Creator Control Window**.

During the first 30 days after registration, the creator can update the allowlist root (once), toggle public minting, and batch-drop tokens. Once 30 days elapse from \`createdAt\`, the event is permanently locked and can never be modified.`,
    technicalDetails: `Enforced by the \`onlyBeforeLock(eventId, 0)\` modifier: \`events[eventId].createdAt + CREATOR_TIMELOCK < block.timestamp\`. Timelock cannot be extended or bypassed by anyone.`,
  },
  {
    slug: "37-day-signature-rules",
    title: "14. 37-Day Signature Validity Window",
    category: "Security & Mechanics",
    summary: "Grace period for claiming live-event signature passes.",
    content: `Signature-based claims are permitted for **37 days** from event registration (the standard 30-day creator window plus a 7-day grace period).

This gives attendees plenty of time after a conference or meetup to scan their pass and submit their onchain claim. After 37 days, signature minting is permanently closed.`,
    technicalDetails: `Enforced by \`onlyBeforeLock(eventId, 7 days)\` in \`mintWithSignature\`. Reverts with \`POAP__TimeLockExpired()\` once the block timestamp passes \`createdAt + 37 days\`.`,
  },
  {
    slug: "creator-mint",
    title: "15. Creator Mint Drops (Batch Distribution)",
    category: "Distribution",
    summary: "Directly airdrop badges to up to 101 recipients in a single transaction.",
    content: `Creators can directly deliver POAP badges into attendee wallets without requiring the recipients to pay gas or initiate a transaction.

The creator simply inputs a list of recipient addresses, and the contract mints 1 token to each wallet in a single transaction.`,
    technicalDetails: `Function \`creatorMint(uint256 eventId, address[] calldata recipients)\`. If any recipient has already claimed, the contract gracefully skips that address without reverting the entire batch. Reverts if \`recipients.length > 101\`.`,
  },
  {
    slug: "verification",
    title: "16. Verification & Proof of Attendance",
    category: "Fundamentals",
    summary: "Cryptographically verify token ownership, mint receipts, and CAIP-2 IDs.",
    content: `Our standalone Verification tool allows anyone to inspect whether a specific wallet truly holds a given POAP.

Verification results display:
- Verified attendance badge & onchain artwork
- Holder wallet address
- Mint timestamp & block number
- CAIP-2 multichain identifier
- Direct link to BaseScan onchain transaction receipt`,
    technicalDetails: `Verification queries \`balanceOf(holder, eventId)\` and cross-references contract \`NewMint\` event logs to retrieve the exact block receipt and proof of authenticity.`,
  },
  {
    slug: "contract-reference",
    title: "17. Smart Contract Technical Reference",
    category: "Developer & Integration",
    summary: "Addresses, ABI definitions, and error codes for Base Sepolia deployment.",
    content: `Contract Address: \`0xC3249356a483fbe17d5355D39105D2eA666d9de6\`
Network: Base Sepolia (Chain ID 84532)
Standards: ERC-1155, ERC-1155Supply, EIP-191, CAIP-2

Custom Errors:
- \`POAP__InvalidValue(string field)\`
- \`POAP__TimeLockExpired()\`
- \`POAP__OnlyCreator()\`
- \`POAP__AlreadyClaimed()\`
- \`POAP__EventNotPublic()\`
- \`POAP__AllowlistNotEnabled()\`
- \`POAP__RootAlreadySet()\`
- \`POAP__SoulboundNotTransferable()\``,
    technicalDetails: `All methods and view functions can be queried via standard JSON-RPC or Viem public client. Bit flags: 0 (private + transferable), 1 (private + soulbound), 2 (public + transferable), 3 (public + soulbound).`,
  },
  {
    slug: "base-sepolia-setup",
    title: "18. Base Sepolia Network Setup",
    category: "Developer & Integration",
    summary: "How to configure your wallet and acquire free testnet ETH.",
    content: `Network Details:
- **Network Name**: Base Sepolia
- **RPC URL**: \`https://sepolia.base.org\`
- **Chain ID**: \`84532\`
- **Currency Symbol**: \`ETH\`
- **Block Explorer**: \`https://sepolia.basescan.org\`

Faucets for free testnet ETH:
- Coinbase Developer Faucet
- Superchain Faucet
- QuickNode Base Sepolia Faucet`,
    technicalDetails: `Our frontend automatically detects when your wallet is on the wrong network and triggers an instant one-click switch via \`wallet_switchEthereumChain\` or \`wallet_addEthereumChain\`.`,
  },
  {
    slug: "farcaster-mini-app",
    title: "19. Farcaster Mini App & Frame v2",
    category: "Developer & Integration",
    summary: "Seamlessly create, share, and claim POAPs within Warpcast and Farcaster feeds.",
    content: `This application is fully integrated with the Farcaster Mini App standard.

When accessed from Warpcast:
- The app automatically initializes \`sdk.actions.ready()\`
- Attaches the user's Farcaster context
- Provides an optimized one-click claim button
- Enables sharing interactive casts directly from the POAP detail page`,
    technicalDetails: `The manifest is published at \`/.well-known/farcaster.json\`. We declare standard capabilities and use \`@farcaster/frame-sdk\` for bidirectional communication with the host client.`,
  },
  {
    slug: "self-hosting",
    title: "20. Self-Hosting & Deployment",
    category: "Developer & Integration",
    summary: "Instructions for cloning, building, and deploying your own instance.",
    content: `The entire project is open-source under the MIT license.

Quick Start:
\`\`\`bash
git clone https://github.com/your-username/onchain-poaps-frontend.git
cd onchain-poaps-frontend
npm install
npm run dev
\`\`\`

Deploy to Vercel, Netlify, or Cloudflare Pages with zero configuration needed.`,
    technicalDetails: `No backend database or server environment variables are mandatory. The app reads state directly from Base Sepolia JSON-RPC nodes.`,
  },
  {
    slug: "troubleshooting",
    title: "21. Troubleshooting & FAQ",
    category: "Developer & Integration",
    summary: "Common questions, error resolutions, and support guide.",
    content: `**Q: Why does my transaction fail with 'Already Claimed'?**
A: Each wallet is strictly restricted to 1 token per event. If you need another badge, use a different wallet address.

**Q: Why can't I update my allowlist root?**
A: Contract rules permit setting the allowlist root only once per event, and only within the 30-day creator window.

**Q: Can I transfer my Soulbound POAP?**
A: No. Soulbound badges cannot be transferred, burned, or moved to another wallet by design.`,
    technicalDetails: `Check the browser console and error state indicators. The application translates all internal contract revert selectors into plain-English alerts.`,
  },
];
