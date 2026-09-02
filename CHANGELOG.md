# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2026-09-02

### Changed

- **Breaking:** order methods now return domain objects directly instead of HTTP response envelopes.
- **Breaking:** removed response-oriented aliases from the public order type surface.

## [2.0.0] - 2026-09-01

### Changed

- **Breaking:** renamed the package to `@inttegro/inttegro-sdk`.
- **Breaking:** renamed `InttegroClient`, configuration types, and all SDK-prefixed errors from their former service name to `Inttegro*`.
- Updated runtime metadata, examples, documentation, and repository links to Inttegro.

## [0.1.0] - 2024-01-01

### Added

- Initial release of the Inttegro SDK for TypeScript
- InttegroClient class for SDK initialization
- Orders resource with full CRUD operations:
  - `create()` - Create new orders
  - `lookup()` - Retrieve order details
  - `pay()` - Process payments
  - `confirmPayment()` - Confirm payments with OTP/token
  - `requestConfirmation()` - Request new confirmation codes
- Comprehensive TypeScript type definitions
- Custom error classes:
  - `InttegroAPIError` - Base API error
  - `InttegroValidationError` - Validation errors
  - `InttegroNetworkError` - Network/timeout errors
  - `InttegroAuthenticationError` - Auth errors
  - `InttegroRateLimitError` - Rate limiting errors
- HTTP client with:
  - Automatic retry logic with exponential backoff
  - Request/response interceptors
  - Configurable timeouts
  - Debug logging
- Support for CommonJS and ESM modules
- Full test suite with >80% coverage
- Comprehensive documentation and examples

### Features

- 🎯 Type-safe API with full TypeScript support
- 🔄 Automatic retry with exponential backoff
- 🛡️ Built-in error handling
- 🔌 Request/response middleware via interceptors
- 📦 Dual module support (CJS + ESM)
- 🧪 Thoroughly tested
- 📝 JSDoc documentation throughout

[2.0.0]: https://github.com/zebodotdev/inttegro-sdk-typescript/releases/tag/v2.0.0
[0.1.0]: https://github.com/zebodotdev/inttegro-sdk-typescript/releases/tag/v0.1.0
