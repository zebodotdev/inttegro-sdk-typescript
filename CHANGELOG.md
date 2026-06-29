# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-01-01

### Added

- Initial release of the Zebo Commerce SDK for TypeScript
- CommerceClient class for SDK initialization
- Orders resource with full CRUD operations:
  - `create()` - Create new orders
  - `lookup()` - Retrieve order details
  - `pay()` - Process payments
  - `confirmPayment()` - Confirm payments with OTP/token
  - `requestConfirmation()` - Request new confirmation codes
- Comprehensive TypeScript type definitions
- Custom error classes:
  - `CommerceAPIError` - Base API error
  - `CommerceValidationError` - Validation errors
  - `CommerceNetworkError` - Network/timeout errors
  - `CommerceAuthenticationError` - Auth errors
  - `CommerceRateLimitError` - Rate limiting errors
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

[0.1.0]: https://github.com/zebo/commerce-sdk-typescript/releases/tag/v0.1.0

