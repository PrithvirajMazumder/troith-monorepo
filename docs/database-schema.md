# Database Schema Documentation

This document describes the complete database schema for the Troith application.

## Database Configuration

- **Provider**: PostgreSQL
- **ORM**: Prisma with schema folder feature enabled

---

## Models

### 1. User

Core user account, linked to NextAuth.js authentication.

| Field         | Type      | Constraints          | Description             |
| ------------- | --------- | -------------------- | ----------------------- |
| id            | String    | @id @default(cuid()) | Primary key             |
| name          | String?   | nullable             | User's full name        |
| email         | String    | @unique              | User's email (unique)   |
| emailVerified | DateTime? | nullable             | When email was verified |
| image         | String?   | nullable             | Profile picture URL     |
| createdAt     | DateTime  | @default(now())      | Creation timestamp      |
| updatedAt     | DateTime  | @updatedAt           | Last update timestamp   |
| deletedAt     | DateTime? | nullable             | Soft delete timestamp   |

**Relations**:

- One-to-Many: Company, Bank, Uom
- One-to-Many: Account, Session, Authenticator (authentication)

---

### 2. Account

OAuth provider accounts linked to users.

| Field             | Type     | Constraints     | Description                           |
| ----------------- | -------- | --------------- | ------------------------------------- |
| userId            | String   | required        | Foreign key to User                   |
| type              | String   | required        | Account type (e.g., "oauth", "email") |
| provider          | String   | required        | OAuth provider name                   |
| providerAccountId | String   | required        | Provider's account ID                 |
| refresh_token     | String?  | nullable        | OAuth refresh token                   |
| access_token      | String?  | nullable        | OAuth access token                    |
| expires_at        | Int?     | nullable        | Token expiration timestamp            |
| token_type        | String?  | nullable        | Token type                            |
| scope             | String?  | nullable        | OAuth scope                           |
| id_token          | String?  | nullable        | ID token                              |
| session_state     | String?  | nullable        | Session state                         |
| createdAt         | DateTime | @default(now()) | Creation timestamp                    |
| updatedAt         | DateTime | @updatedAt      | Last update timestamp                 |

**Primary Key**: Composite - [provider, providerAccountId]

**Relations**:

- Many-to-One: User (onDelete: Cascade)

---

### 3. Session

User sessions for authentication.

| Field        | Type     | Constraints     | Description           |
| ------------ | -------- | --------------- | --------------------- |
| sessionToken | String   | @unique         | Unique session token  |
| userId       | String   | required        | Foreign key to User   |
| expires      | DateTime | required        | Session expiration    |
| createdAt    | DateTime | @default(now()) | Creation timestamp    |
| updatedAt    | DateTime | @updatedAt      | Last update timestamp |

**Relations**:

- Many-to-One: User (onDelete: Cascade)

---

### 4. VerificationToken

Email verification tokens.

| Field      | Type     | Constraints | Description                      |
| ---------- | -------- | ----------- | -------------------------------- |
| identifier | String   | required    | Token identifier (usually email) |
| token      | String   | required    | Verification token               |
| expires    | DateTime | required    | Token expiration                 |

**Primary Key**: Composite - [identifier, token]

---

### 5. Authenticator

WebAuthn credentials for passwordless authentication.

| Field                | Type    | Constraints | Description                     |
| -------------------- | ------- | ----------- | ------------------------------- |
| credentialID         | String  | @unique     | WebAuthn credential ID          |
| userId               | String  | required    | Foreign key to User             |
| providerAccountId    | String  | required    | Associated account ID           |
| credentialPublicKey  | String  | required    | Public key                      |
| counter              | Int     | required    | Signature counter               |
| credentialDeviceType | String  | required    | Device type                     |
| credentialBackedUp   | Boolean | required    | Whether credential is backed up |
| transports           | String? | nullable    | Available transports            |

**Primary Key**: Composite - [userId, credentialID]

**Relations**:

- Many-to-One: User (onDelete: Cascade)

---

### 6. Company

Business entities owned by users.

| Field        | Type      | Constraints          | Description           |
| ------------ | --------- | -------------------- | --------------------- |
| id           | String    | @id @default(cuid()) | Primary key           |
| userId       | String    | required             | Foreign key to User   |
| name         | String    | required             | Company name          |
| legalName    | String    | required             | Legal business name   |
| gstin        | String    | required             | GSTIN number          |
| image        | String?   | nullable             | Company logo          |
| phone        | String    | required             | Contact phone         |
| email        | String    | required             | Contact email         |
| addressLine1 | String    | required             | Address line 1        |
| addressLine2 | String?   | nullable             | Address line 2        |
| state        | String    | required             | State                 |
| city         | String    | required             | City                  |
| zipCode      | Int       | required             | ZIP code              |
| createdAt    | DateTime  | @default(now())      | Creation timestamp    |
| deletedAt    | DateTime? | nullable             | Soft delete timestamp |

**Relations**:

- Many-to-One: User (onDelete: Cascade)
- One-to-Many: Item, Party, Invoice, Tax

---

### 7. Bank

Bank accounts for transactions.

| Field         | Type      | Constraints          | Description           |
| ------------- | --------- | -------------------- | --------------------- |
| id            | String    | @id @default(cuid()) | Primary key           |
| accountNumber | Int       | required             | Bank account number   |
| name          | String    | required             | Bank name             |
| ifsc          | String    | required             | IFSC code             |
| branch        | String    | required             | Branch name           |
| userId        | String    | required             | Foreign key to User   |
| holderName    | String    | required             | Account holder name   |
| createdAt     | DateTime  | @default(now())      | Creation timestamp    |
| deletedAt     | DateTime? | nullable             | Soft delete timestamp |

**Relations**:

- Many-to-One: User (onDelete: Cascade)
- One-to-Many: Invoice

---

### 8. Uom

Unit of Measure (e.g., kg, piece, liter).

| Field        | Type      | Constraints          | Description                 |
| ------------ | --------- | -------------------- | --------------------------- |
| id           | String    | @id @default(cuid()) | Primary key                 |
| name         | String    | required             | UOM name (e.g., "Kilogram") |
| abbreviation | String    | required             | Short form (e.g., "kg")     |
| userId       | String    | required             | Foreign key to User         |
| createdAt    | DateTime  | @default(now())      | Creation timestamp          |
| deletedAt    | DateTime? | nullable             | Soft delete timestamp       |

**Relations**:

- Many-to-One: User (onDelete: Cascade)
- One-to-Many: Item

---

### 9. Party

Customers or suppliers (vendors).

| Field        | Type      | Constraints          | Description            |
| ------------ | --------- | -------------------- | ---------------------- |
| id           | String    | @id @default(cuid()) | Primary key            |
| nickName     | String?   | nullable             | Friendly name          |
| name         | String    | required             | Party name             |
| addressLine1 | String    | required             | Address line 1         |
| addressLine2 | String?   | nullable             | Address line 2         |
| state        | String    | required             | State                  |
| city         | String    | required             | City                   |
| zipCode      | Int       | required             | ZIP code               |
| companyId    | String    | required             | Foreign key to Company |
| gstin        | String    | required             | GSTIN number           |
| createdAt    | DateTime  | @default(now())      | Creation timestamp     |
| deletedAt    | DateTime? | nullable             | Soft delete timestamp  |

**Relations**:

- Many-to-One: Company (onDelete: Cascade)
- One-to-Many: PartyItem, Invoice

---

### 10. PartyItem

Many-to-many relationship between Parties and Items.

| Field   | Type   | Constraints          | Description          |
| ------- | ------ | -------------------- | -------------------- |
| id      | String | @id @default(cuid()) | Primary key          |
| itemId  | String | required             | Foreign key to Item  |
| partyId | String | required             | Foreign key to Party |

**Relations**:

- Many-to-One: Item (onDelete: Cascade)
- Many-to-One: Party (onDelete: Cascade)

---

### 11. Item

Products or services.

| Field     | Type      | Constraints          | Description            |
| --------- | --------- | -------------------- | ---------------------- |
| id        | String    | @id @default(cuid()) | Primary key            |
| name      | String    | required             | Item name              |
| hsn       | Int       | required             | HSN code               |
| uomId     | String    | required             | Foreign key to Uom     |
| companyId | String    | required             | Foreign key to Company |
| taxId     | String    | required             | Foreign key to Tax     |
| createdAt | DateTime  | @default(now())      | Creation timestamp     |
| deletedAt | DateTime? | nullable             | Soft delete timestamp  |

**Relations**:

- Many-to-One: Company (onDelete: Cascade)
- Many-to-One: Uom (onDelete: Cascade)
- Many-to-One: Tax (onDelete: Cascade)
- One-to-Many: PartyItem, InvoiceItem

---

### 12. Tax

Tax rates (SGST/CGST) for a company.

| Field     | Type      | Constraints          | Description            |
| --------- | --------- | -------------------- | ---------------------- |
| id        | String    | @id @default(cuid()) | Primary key            |
| sgst      | Int       | required             | SGST percentage        |
| cgst      | Int       | required             | CGST percentage        |
| createdAt | DateTime  | @default(now())      | Creation timestamp     |
| deletedAt | DateTime? | nullable             | Soft delete timestamp  |
| companyId | String    | required             | Foreign key to Company |

**Relations**:

- Many-to-One: Company (onDelete: Cascade)
- One-to-Many: Item, Invoice

---

### 13. Invoice

Invoice records.

| Field         | Type          | Constraints                       | Description                     |
| ------------- | ------------- | --------------------------------- | ------------------------------- |
| id            | String        | @id @default(cuid())              | Primary key                     |
| no            | Int           | @unique @default(autoincrement()) | Invoice number (auto-increment) |
| vehicleNumber | String        | required                          | Vehicle number                  |
| date          | DateTime      | required                          | Invoice date                    |
| status        | InvoiceStatus | required                          | Invoice status (enum)           |
| createdAt     | DateTime      | @default(now())                   | Creation timestamp              |
| deletedAt     | DateTime?     | nullable                          | Soft delete timestamp           |
| shouldUseIgst | Boolean       | @default(false)                   | Use IGST instead of CGST/SGST   |
| partyId       | String        | required                          | Foreign key to Party            |
| companyId     | String        | required                          | Foreign key to Company          |
| bankId        | String        | required                          | Foreign key to Bank             |
| taxId         | String        | required                          | Foreign key to Tax              |

**Relations**:

- Many-to-One: Party (onDelete: Cascade)
- Many-to-One: Company (onDelete: Cascade)
- Many-to-One: Bank (onDelete: Cascade)
- Many-to-One: Tax (onDelete: Cascade)
- One-to-Many: InvoiceItem

---

### 14. InvoiceItem

Line items on invoices.

| Field        | Type    | Constraints          | Description                           |
| ------------ | ------- | -------------------- | ------------------------------------- |
| id           | String  | @id @default(cuid()) | Primary key                           |
| quantity     | BigInt  | required             | Quantity                              |
| price        | Decimal | required             | Price per unit                        |
| isPriceTotal | Boolean | @default(false)      | Whether price is total (not per unit) |
| invoiceId    | String  | required             | Foreign key to Invoice                |
| itemId       | String  | required             | Foreign key to Item                   |

**Relations**:

- Many-to-One: Invoice (onDelete: Cascade)
- Many-to-One: Item (onDelete: Cascade)

---

## Enums

### InvoiceStatus

| Value     | Description                |
| --------- | -------------------------- |
| DRAFT     | Invoice is being prepared  |
| CONFIRMED | Invoice has been confirmed |
| PAID      | Invoice has been paid      |

---

## Relationship Diagram

```
User
├── Company (1:N)
│   ├── Item (1:N)
│   │   ├── InvoiceItem (1:N)
│   │   ├── PartyItem (1:N)
│   │   └── Tax (N:1)
│   ├── Party (1:N)
│   │   ├── PartyItem (1:N)
│   │   └── Invoice (1:N)
│   ├── Invoice (1:N)
│   │   └── InvoiceItem (1:N)
│   └── Tax (1:N)
├── Bank (1:N)
│   └── Invoice (1:N)
└── Uom (1:N)
    └── Item (1:N)

Party (N:1) ─── PartyItem (N:1) Item (N:1) ─── InvoiceItem (N:1) Invoice
```

---

## Notes

- All models use soft deletes via the `deletedAt` field (nullable DateTime)
- Most relations use `onDelete: Cascade` to automatically delete related records
- Invoice numbers auto-increment and are unique
- The database uses PostgreSQL with Prisma schema folder feature
