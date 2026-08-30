# Contributing to Onchain POAPs

We welcome contributions from developers, designers, and Web3 enthusiasts!

## Development Guidelines

1. **Smart Contract Invariance**: The smart contract deployed at `0xC3249356a483fbe17d5355D39105D2eA666d9de6` is immutable and the source of truth. Integration logic must always adhere to actual Solidity behavior.
2. **Client-Side Architecture**: Keep the frontend client-side without introducing centralized databases or servers. All state should be queried from Base Sepolia JSON-RPC endpoints.
3. **Type Safety**: Maintain strict TypeScript typing. Run `npm run typecheck` before opening pull requests.
4. **Code Formatting & Cleanliness**: Ensure zero unused imports and clean modular structure.

## Local Workflow

```bash
git checkout -b feature/your-feature-name
npm install
npm run dev
npm run typecheck
npm run build
```

## Pull Request Checklist

- [ ] TypeScript checks pass (`npm run typecheck`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Integration tests pass (`node scripts/test-contract-and-crypto.mjs`)
- [ ] New features include tests or documentation updates where applicable
