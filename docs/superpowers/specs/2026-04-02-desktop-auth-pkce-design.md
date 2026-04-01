# Desktop Auth PKCE Utilities Design

## Overview
Create PKCE (Proof Key for Code Exchange) utilities for secure OAuth flow between desktop app and web app. The utilities will be used exclusively in server components and server actions.

## Requirements
- Generate cryptographically random code verifier (32 bytes)
- Generate SHA-256 code challenge from verifier
- Generate random state parameter for CSRF protection (16 bytes)
- Store verifier in httpOnly cookie with 5 minute expiry
- Retrieve verifier, validate state, clear cookies after use
- Build troith:// callback URL with token

## Implementation Approach
**Selected: Node.js Crypto + Custom Base64url**

### Rationale
- No external dependencies required
- Simple implementation using Node.js built-in crypto module
- Compatible with Next.js App Router server components
- Follows existing patterns in the codebase
- Synchronous generation for verifier, state, and challenge

## Technical Design

### File Location
`apps/troithWeb/lib/desktop-auth.ts`

### Constants
```typescript
export const DESKTOP_PROTOCOL = 'troith'
export const DESKTOP_AUTH_CALLBACK_PATH = 'auth/callback'
export const DESKTOP_PKCE_VERIFIER_COOKIE = 'desktop_pkce_verifier'
export const DESKTOP_PKCE_STATE_COOKIE = 'desktop_pkce_state'
```

### Utility Functions

#### 1. Base64url Encoding
Helper function to convert Buffer to base64url string:
- Replace `+` with `-`
- Replace `/` with `_`
- Strip padding `=`

#### 2. generateCodeVerifier(): string
- Generate 32 random bytes using `crypto.randomBytes(32)`
- Convert to base64url string
- Return string

#### 3. generateCodeChallenge(verifier: string): string
- Create SHA-256 hash of verifier string using `crypto.createHash('sha256')`
- Convert hash digest to base64url
- Return string (synchronous)

#### 4. generateState(): string
- Generate 16 random bytes using `crypto.randomBytes(16)`
- Convert to base64url string
- Return string

#### 5. storePkceVerifier(verifier: string, state: string): void
- Use Next.js `cookies()` from `next/headers`
- Set two cookies:
  - `desktop_pkce_verifier` = verifier
  - `desktop_pkce_state` = state
- Cookie options:
  - `httpOnly: true`
  - `secure: process.env.NODE_ENV === 'production'`
  - `sameSite: 'lax'`
  - `path: '/'`
  - `maxAge: 300` (5 minutes)
- Return void

#### 6. retrievePkceVerifier(state: string): Promise<string | null>
- Use Next.js `cookies()` to get cookies
- Get verifier cookie and stored state cookie
- If either missing, return null
- If stored state !== provided state, return null
- Clear both cookies (set maxAge: 0)
- Return verifier string

#### 7. buildDesktopCallbackUrl(token: string, error?: string): string
- Build URL: `troith://auth/callback`
- Add query parameters:
  - `token` if provided
  - `error` if provided
- Return complete URL string

### Security Considerations
1. **CSRF Protection**: State parameter validates OAuth callback authenticity
2. **Short Expiry**: 5 minute cookie lifetime limits exposure window
3. **HttpOnly**: Prevents JavaScript access to cookies (XSS protection)
4. **Secure Flag**: HTTPS-only in production prevents MITM attacks
5. **SameSite**: Lax prevents CSRF while allowing top-level navigation

### Error Handling
- `retrievePkceVerifier` returns `null` on any failure (missing cookie, invalid state)
- No throwing exceptions - graceful failure for calling code to handle
- Cookie operations may throw in edge cases (e.g., cookies() unavailable) - let errors propagate

## Dependencies
- `next/headers` for `cookies()` function
- `crypto` Node.js built-in module

## Testing Considerations
- Unit tests for base64url encoding/decoding
- Unit tests for random generation (deterministic seed for tests)
- Integration tests for cookie storage/retrieval
- Mock cookies() for testing

## Future Considerations
- Potential need for cookie rotation if flow takes longer than 5 minutes
- Consider adding optional logging for debugging OAuth flows
- May need to handle multiple concurrent desktop auth sessions

## Open Questions (Resolved)
1. Should we validate verifier format on retrieval? → No, OAuth provider will reject invalid verifiers
2. Special logging needed? → No, keep simple

## Success Criteria
- All required exports implemented
- TypeScript compiles without errors
- Follows existing code patterns in the monorepo
- Secure cookie configuration as specified
- Clean, readable code with proper documentation