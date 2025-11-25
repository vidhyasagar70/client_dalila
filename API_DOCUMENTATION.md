# Millennium Star Inventory API Documentation

## Overview

The Millennium Star Inventory API is a comprehensive diamond inventory management system that provides endpoints for managing diamonds, users, carts, and quotations. The API is built with Node.js, Express, TypeScript, and MongoDB.

## Base URL

```
https://dalila-inventory-service-dev.caratlogic.com
```

## Authentication

Most endpoints require authentication using JWT Bearer tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "data": {},
  "message": "Optional message",
  "count": 10
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message"
}
```

## Rate Limiting

Various endpoints have different rate limits:

- Search endpoints: 50 requests per 15 minutes
- Sync endpoints: 5-10 requests per 5 minutes
- Cart endpoints: 20-30 requests per minute
- Email endpoints: 5 requests per minute

---

## Health Check

### GET `/health`

Check API status and health.

**Access**: Public

**Response**:

```json
{
  "success": true,
  "message": "Diamond Inventory API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

---

## Diamond Endpoints

### GET `/api/diamonds`

Get all diamonds with pagination.

**Access**: Public

**Query Parameters**:

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sortBy` (optional): Sort field
- `sortOrder` (optional): Sort order (asc/desc)

**Response**:

```json
{
  "success": true,
  "data": {
    "diamonds": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 100,
      "itemsPerPage": 10
    }
  },
  "count": 100
}
```

### GET `/api/diamonds/all`

Get all diamonds without pagination.

**Access**: Public

**Response**:

```json
{
  "success": true,
  "data": {
    "diamonds": [...]
  },
  "count": 100
}
```

### GET `/api/diamonds/search`

Search diamonds with advanced filters.

**Access**: Public  
**Rate Limit**: 50 requests per 15 minutes

**Query Parameters**:

- `color`: Filter by color (D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z)
- `clarity`: Filter by clarity (FL, IF, VVS1, VVS2, VS1, VS2, SI1, SI2, I1, I2, I3)
- `cut`: Filter by cut grade (EX, VG, G, F, P)
- `shape`: Filter by shape (ROUND, OVAL, PEAR, MARQUISE, PRINCESS, EMERALD, ASSCHER, RADIANT, CUSHION, HEART)
- `minCarats`: Minimum carat weight
- `maxCarats`: Maximum carat weight
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `lab`: Filter by lab (GIA, AGS, IGI, EGL, etc.)
- `location`: Filter by location
- `stage`: Filter by stage
- `page`: Page number
- `limit`: Items per page

**Response**:

```json
{
  "success": true,
  "data": {
    "diamonds": [...],
    "filters": {
      "applied": {...},
      "available": {...}
    },
    "pagination": {...}
  },
  "count": 25
}
```

### GET `/api/diamonds/filter-options`

Get available filter options for UI dropdowns.

**Access**: Public  
**Rate Limit**: 50 requests per 15 minutes

**Response**:

```json
{
  "success": true,
  "data": {
    "colors": [
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z"
    ],
    "clarities": [
      "FL",
      "IF",
      "VVS1",
      "VVS2",
      "VS1",
      "VS2",
      "SI1",
      "SI2",
      "I1",
      "I2",
      "I3"
    ],
    "cuts": ["EX", "VG", "G", "F", "P"],
    "shapes": [
      "ROUND",
      "OVAL",
      "PEAR",
      "MARQUISE",
      "PRINCESS",
      "EMERALD",
      "ASSCHER",
      "RADIANT",
      "CUSHION",
      "HEART"
    ],
    "labs": ["GIA", "AGS", "IGI", "EGL"],
    "locations": ["BE", "NY", "LA"],
    "stages": ["A", "B", "C"]
  }
}
```

### POST `/api/diamonds/sync`

Sync diamonds from HRC API with provided credentials.

**Access**: Private (Authentication required)  
**Rate Limit**: 5 requests per 5 minutes

**Request Body**:

```json
{
  "username": "your_hrc_username",
  "password": "your_hrc_password"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Diamond sync completed. Total: 150, Successful: 145, Failed: 5",
  "data": {
    "syncedCount": 145,
    "statistics": {
      "total": 150,
      "successful": 145,
      "failed": 5,
      "failureReasons": [
        "STONE_NO is required (2 diamonds)",
        "COLOR validation failed (1 diamond)",
        "Duplicate STONE_NO (2 diamonds)"
      ]
    },
    "failures": [...],
    "timestamp": "2024-01-15T10:30:00.000Z",
    "source": "HRC API"
  }
}
```

### POST `/api/diamonds/refresh`

Refresh diamonds from HRC API using stored credentials.

**Access**: Private (Authentication required)  
**Rate Limit**: 10 requests per 5 minutes

**Note**: Uses HRC_USERNAME and HRC_PASSWORD environment variables.

**Response**:

```json
{
  "success": true,
  "message": "Successfully refreshed 150 diamonds from HRC API",
  "data": {
    "syncedCount": 150,
    "timestamp": "2024-01-15T10:30:00.000Z",
    "source": "HRC API"
  }
}
```

### POST `/api/diamonds/email`

Email diamonds by stone numbers to specified recipients.

**Access**: Private (Authentication required)  
**Rate Limit**: 5 requests per minute

**Request Body**:

```json
{
  "stoneNumbers": ["S-1541", "S-1469", "FRD-1"],
  "emails": ["customer1@example.com", "customer2@example.com"]
}
```

**Response**:

```json
{
  "success": true,
  "message": "Successfully emailed 3 diamonds to 2 recipients",
  "data": {
    "totalRequested": 3,
    "totalFound": 3,
    "totalEmailed": 2,
    "foundStoneNumbers": ["S-1541", "S-1469", "FRD-1"],
    "notFoundStoneNumbers": [],
    "result": "CSV report sent successfully to 2 recipients"
  }
}
```

---

## Cart Endpoints

### POST `/api/diamonds/cart/add`

Add a diamond to the user's cart by stone number.

**Access**: Private (Authentication required)  
**Rate Limit**: 20 requests per minute

**Request Body**:

```json
{
  "stoneNo": "S-1541"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Diamond S-1541 added to cart successfully",
  "data": {
    "cartItem": {
      "stoneNo": "S-1541",
      "diamond": {...},
      "addedAt": "2025-01-01T12:00:00.000Z"
    }
  }
}
```

### GET `/api/diamonds/cart`

Get all items in the user's cart.

**Access**: Private (Authentication required)  
**Rate Limit**: 30 requests per minute

**Response**:

```json
{
  "success": true,
  "data": {
    "cartItems": [
      {
        "stoneNo": "S-1541",
        "diamond": {...},
        "addedAt": "2025-01-01T12:00:00.000Z"
      }
    ]
  },
  "count": 1
}
```

### GET `/api/diamonds/cart/:stoneNo`

Get a specific diamond from cart by stone number.

**Access**: Private (Authentication required)  
**Rate Limit**: 30 requests per minute

**Response**:

```json
{
  "success": true,
  "data": {
    "cartItem": {
      "stoneNo": "S-1541",
      "diamond": {...},
      "addedAt": "2025-01-01T12:00:00.000Z"
    }
  }
}
```

### DELETE `/api/diamonds/cart/:stoneNo`

Remove a specific diamond from cart by stone number.

**Access**: Private (Authentication required)  
**Rate Limit**: 20 requests per minute

**Response**:

```json
{
  "success": true,
  "message": "Diamond S-1541 removed from cart successfully"
}
```

### DELETE `/api/diamonds/cart`

Clear the entire cart.

**Access**: Private (Authentication required)  
**Rate Limit**: 5 requests per 5 minutes

**Response**:

```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

---

## User Authentication Endpoints

### POST `/api/users/register`

Register a new user.

**Access**: Public

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response**:

```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email.",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isVerified": false,
      "kycStatus": "pending"
    }
  }
}
```

### POST `/api/users/login`

Login with email and password.

**Access**: Public

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isVerified": true,
      "kycStatus": "approved"
    },
    "token": "jwt_token_here"
  }
}
```

### POST `/api/users/otp`

Send OTP for email verification.

**Access**: Public

**Request Body**:

```json
{
  "email": "user@example.com"
}
```

**Response**:

```json
{
  "success": true,
  "message": "OTP sent to your email address"
}
```

### POST `/api/users/verify-otp`

Verify OTP for email verification.

**Access**: Public

**Request Body**:

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### POST `/api/users/logout`

Logout the current user.

**Access**: Private (Authentication required)

**Response**:

```json
{
  "success": true,
  "message": "Logout successful"
}
```

### GET `/api/users/profile`

Get current user's profile.

**Access**: Private (Authentication required)

**Response**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isVerified": true,
      "kycStatus": "approved",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

### PUT `/api/users/update-email`

Update user's email address.

**Access**: Private (Authentication required)

**Request Body**:

```json
{
  "newEmail": "newemail@example.com"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Email updated successfully. Please verify your new email."
}
```

### PUT `/api/users/update-password`

Update user's password (for forgot password functionality).

**Access**: Public

**Request Body**:

```json
{
  "email": "user@example.com",
  "newPassword": "newSecurePassword123"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

### POST `/api/users/customer-data`

Submit customer data for KYC verification.

**Access**: Private (Authentication required)

**Request Body**:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "businessName": "Doe Jewelry",
  "businessType": "retail",
  "taxId": "12-3456789"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Customer data submitted successfully. Awaiting admin approval."
}
```

---

## Admin User Management Endpoints

### GET `/api/users`

Get all users (admin only).

**Access**: Private (Admin authentication required)

**Query Parameters**:

- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by user status

**Response**:

```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {...}
  },
  "count": 50
}
```

### GET `/api/users/:id`

Get user by ID (admin only).

**Access**: Private (Admin authentication required)

**Response**:

```json
{
  "success": true,
  "data": {
    "user": {...}
  }
}
```

### POST `/api/users/create`

Create a new user (admin only).

**Access**: Private (Admin authentication required)

**Request Body**:

```json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "user"
}
```

**Response**:

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {...}
  }
}
```

### PUT `/api/users/:id`

Update user by ID (admin only).

**Access**: Private (Admin authentication required)

**Request Body**:

```json
{
  "firstName": "Updated Name",
  "lastName": "Updated Last Name",
  "kycStatus": "approved"
}
```

**Response**:

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {...}
  }
}
```

### DELETE `/api/users/:id`

Delete user by ID (admin only).

**Access**: Private (Admin authentication required)

**Response**:

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### GET `/api/users/search`

Search users (admin only).

**Access**: Private (Admin authentication required)

**Query Parameters**:

- `q`: Search query
- `field`: Search field (email, firstName, lastName)

**Response**:

```json
{
  "success": true,
  "data": {
    "users": [...]
  },
  "count": 5
}
```

### GET `/api/users/customer-data-pending`

Get users with pending customer data (admin only).

**Access**: Private (Admin authentication required)

**Response**:

```json
{
  "success": true,
  "data": {
    "pendingUsers": [
      {
        "user": {...},
        "customerData": {...},
        "submittedAt": "2025-01-01T12:00:00.000Z"
      }
    ]
  },
  "count": 3
}
```

### POST `/api/users/:id/approve-customer-data`

Approve customer data for a user (admin only).

**Access**: Private (Admin authentication required)

**Response**:

```json
{
  "success": true,
  "message": "Customer data approved successfully"
}
```

### POST `/api/users/:id/reject-customer-data`

Reject customer data for a user (admin only).

**Access**: Private (Admin authentication required)

**Request Body**:

```json
{
  "reason": "Incomplete documentation"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Customer data rejected successfully"
}
```

---

## Quotation Endpoints

### POST `/api/quotations`

Submit a quotation request.

**Access**: Private (Authentication required, KYC approved)

**Request Body**:

```json
{
  "stoneNumbers": ["S-1541", "S-1469"],
  "message": "Please provide quotation for these diamonds",
  "urgency": "normal"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Quotation submitted successfully",
  "data": {
    "quotation": {
      "id": "quotation_id",
      "stoneNumbers": ["S-1541", "S-1469"],
      "message": "Please provide quotation for these diamonds",
      "urgency": "normal",
      "status": "pending",
      "submittedAt": "2025-01-01T12:00:00.000Z"
    }
  }
}
```

### GET `/api/quotations`

Get all quotations (admin only).

**Access**: Private (Admin authentication required)

**Query Parameters**:

- `status` (optional): Filter by status (pending, approved, rejected)
- `userId` (optional): Filter by user ID

**Response**:

```json
{
  "success": true,
  "data": {
    "quotations": [
      {
        "id": "quotation_id",
        "user": {...},
        "stoneNumbers": ["S-1541", "S-1469"],
        "message": "Please provide quotation for these diamonds",
        "urgency": "normal",
        "status": "pending",
        "submittedAt": "2025-01-01T12:00:00.000Z"
      }
    ]
  },
  "count": 10
}
```

### GET `/api/quotations/:quotationId`

Get specific quotation details (admin only).

**Access**: Private (Admin authentication required)

**Response**:

```json
{
  "success": true,
  "data": {
    "quotation": {
      "id": "quotation_id",
      "user": {...},
      "stoneNumbers": ["S-1541", "S-1469"],
      "diamonds": [...],
      "message": "Please provide quotation for these diamonds",
      "urgency": "normal",
      "status": "pending",
      "submittedAt": "2025-01-01T12:00:00.000Z"
    }
  }
}
```

### POST `/api/quotations/:quotationId/approve`

Approve a quotation (admin only).

**Access**: Private (Admin authentication required)

**Request Body**:

```json
{
  "quotedPrice": 50000,
  "validUntil": "2025-02-01T12:00:00.000Z",
  "notes": "Special pricing for bulk purchase"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Quotation approved successfully"
}
```

### POST `/api/quotations/:quotationId/reject`

Reject a quotation (admin only).

**Access**: Private (Admin authentication required)

**Request Body**:

```json
{
  "reason": "Diamonds no longer available"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Quotation rejected successfully"
}
```

---

## Error Codes

| Code | Description                             |
| ---- | --------------------------------------- |
| 400  | Bad Request - Invalid input data        |
| 401  | Unauthorized - Authentication required  |
| 403  | Forbidden - Insufficient permissions    |
| 404  | Not Found - Resource not found          |
| 409  | Conflict - Resource already exists      |
| 429  | Too Many Requests - Rate limit exceeded |
| 500  | Internal Server Error - Server error    |

## Authentication Flow

1. **Register**: POST `/api/users/register`
2. **Verify Email**: POST `/api/users/verify-otp`
3. **Login**: POST `/api/users/login` (returns JWT token)
4. **Use Token**: Include `Authorization: Bearer <token>` in subsequent requests
5. **Submit KYC**: POST `/api/users/customer-data`
6. **Admin Approval**: Admin approves via `/api/users/:id/approve-customer-data`
7. **Access Protected Features**: User can now access cart, quotations, etc.

## Environment Variables

Required environment variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/diamond-inventory

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Server
NODE_ENV=development
PORT=3000

# Security
BCRYPT_SALT_ROUNDS=12
COOKIE_SECRET=your-cookie-secret

# HRC API (for diamond sync)
HRC_USERNAME=your_hrc_username
HRC_PASSWORD=your_hrc_password

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Search endpoints**: 50 requests per 15 minutes
- **Sync endpoints**: 5-10 requests per 5 minutes
- **Cart endpoints**: 20-30 requests per minute
- **Email endpoints**: 5 requests per minute
- **Auth endpoints**: 10 requests per minute

Rate limit headers are included in responses:

- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when the rate limit resets

## CORS Configuration

The API supports CORS with the following configuration:

- **Origins**: All origins allowed
- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization, X-Requested-With, Cookie
- **Credentials**: Enabled for cookie-based authentication

## Logging

The API includes comprehensive logging:

- **Success logs**: Record successful operations
- **Error logs**: Record errors with stack traces
- **Access logs**: Record API requests and responses
- **Log files**: Stored in `logs/` directory with daily rotation

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable salt rounds
- **Rate Limiting**: Prevents abuse and DoS attacks
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Error Handling**: Secure error responses without sensitive data exposure
