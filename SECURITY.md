# Security Policy

## Security Principles

- **No Private Key Storage**: The application never prompts for, stores, or handles private keys directly. All signing is delegated to standard browser wallets (MetaMask, Coinbase Wallet, injected EIP-1193 providers).
- **SVG Sanitization**: All user-supplied SVGs are strictly sanitized using DOMPurify and regex filtering to neutralize XSS vectors, inline JavaScript, or external HTTP lookups.
- **Zero-Trust Verification**: Ownership, allowlist inclusion, and claim eligibility are verified onchain against the smart contract state rather than trusted client assertions.

## Reporting Vulnerabilities

If you discover any security issues with this application or contract integration, please submit a responsible disclosure report via GitHub Security Advisories.
