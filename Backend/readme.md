# User Registration API Documentation

## Overview
This API provides user registration functionality with authentication token generation. Users can register with their personal information and receive a JWT token for subsequent authenticated requests.

## Base URL
```
/users
```

## Endpoints

### Register User

**Endpoint:** `POST /users/register`

**Description:** Creates a new user account with the provided information. Returns a JWT authentication token and user details upon successful registration.

#### Request Body

The request body must be in JSON format and include the following fields:

```json
{
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string",
  "password": "string"
}
```

#### Field Requirements

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `fullname.firstname` | String | Yes | Min 3 characters | User's first name |
| `fullname.lastname` | String | Yes | Min 3 characters | User's last name |
| `email` | String | Yes | Valid email format, min 5 characters | User's email address (must be unique) |
| `password` | String | Yes | Min 6 characters | User's password (will be hashed) |

#### Example Request

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }'
```

#### Response

##### Success Response

**Status Code:** `201 Created`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

##### Error Responses

**Status Code:** `400 Bad Request`

**Validation Errors:**
```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

**Common Validation Error Messages:**
- `"Invalid Email"` - Email format is invalid
- `"First name must be at least 3 charater long"` - First name is too short
- `"Password must be at least 6 characters long"` - Password is too short

**Status Code:** `500 Internal Server Error`

**Server Error (e.g., duplicate email):**
```json
{
  "error": "User registration failed",
  "message": "Email already exists"
}
```

## Authentication

Upon successful registration, the API returns a JWT token that should be included in the Authorization header for subsequent authenticated requests:

```
Authorization: Bearer <token>
```

## Data Storage

- Passwords are automatically hashed using bcrypt with a salt rounds of 10
- Email addresses must be unique across all users
- User data is stored in MongoDB using Mongoose ODM

## Security Features

- Password hashing with bcrypt
- JWT token generation for authentication
- Input validation using express-validator
- Email uniqueness enforcement
- Password field excluded from query results by default

## Environment Variables

Make sure to set the following environment variable:

```
JWT_SECRET=your_jwt_secret_key_here
```

## Error Handling

The API implements comprehensive error handling:

- **Validation Errors:** Returns detailed field-specific error messages
- **Duplicate Email:** Handled by MongoDB unique constraint
- **Missing Fields:** Service layer validation ensures required fields are present
- **Server Errors:** Proper HTTP status codes and error messages

## Notes

- The `socketId` field is optional and used for real-time communication features
- The password field is excluded from responses for security
- All validation is performed server-side using express-validator
- The API follows RESTful conventions for HTTP status codes and response formats



# User Registration API Documentation

## Overview
This API provides user registration functionality with authentication token generation. Users can register with their personal information and receive a JWT token for subsequent authenticated requests.

## Base URL
```
/users
```

## Endpoints

### Register User

**Endpoint:** `POST /users/register`

**Description:** Creates a new user account with the provided information. Returns a JWT authentication token and user details upon successful registration.

#### Request Body

The request body must be in JSON format and include the following fields:

```json
{
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string",
  "password": "string"
}
```

#### Field Requirements

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `fullname.firstname` | String | Yes | Min 3 characters | User's first name |
| `fullname.lastname` | String | Yes | Min 3 characters | User's last name |
| `email` | String | Yes | Valid email format, min 5 characters | User's email address (must be unique) |
| `password` | String | Yes | Min 6 characters | User's password (will be hashed) |

#### Example Request

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }'
```

#### Response

##### Success Response

**Status Code:** `201 Created`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

##### Error Responses

**Status Code:** `400 Bad Request`

**Validation Errors:**
```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

**Common Validation Error Messages:**
- `"Invalid Email"` - Email format is invalid
- `"First name must be at least 3 charater long"` - First name is too short
- `"Password must be at least 6 characters long"` - Password is too short

**Status Code:** `500 Internal Server Error`

**Server Error (e.g., duplicate email):**
```json
{
  "error": "User registration failed",
  "message": "Email already exists"
}
```

## Authentication

The API supports two methods of authentication:

1. **Authorization Header**: Include the JWT token in the Authorization header
   ```
   Authorization: Bearer <token>
   ```

2. **HTTP Cookie**: The token is automatically set as an HTTP cookie upon login
   ```
   Cookie: token=<token>
   ```

Upon successful registration or login, the API returns a JWT token and sets it as an HTTP cookie with the following properties:
- `httpOnly: true` - Prevents client-side JavaScript access for security
- `secure: false` - Set to `true` in production with HTTPS
- `sameSite: 'Lax'` - CSRF protection
- `maxAge: 24 hours` - Token expiration time

### Token Security Features

- **Token Expiration**: All tokens expire after 24 hours
- **Token Blacklisting**: Logged out tokens are blacklisted and cannot be reused
- **Automatic Cookie Management**: Login sets cookies, logout clears them
- **Multiple Authentication Methods**: Supports both header and cookie authentication

## Data Storage

- Passwords are automatically hashed using bcrypt with a salt rounds of 10
- Email addresses must be unique across all users
- User data is stored in MongoDB using Mongoose ODM

## Security Features

- Password hashing with bcrypt
- JWT token generation for authentication
- Input validation using express-validator
- Email uniqueness enforcement
- Password field excluded from query results by default

## Environment Variables

Make sure to set the following environment variable:

```
JWT_SECRET=your_jwt_secret_key_here
```

## Error Handling

The API implements comprehensive error handling:

- **Validation Errors:** Returns detailed field-specific error messages
- **Duplicate Email:** Handled by MongoDB unique constraint
- **Missing Fields:** Service layer validation ensures required fields are present
- **Server Errors:** Proper HTTP status codes and error messages

### Login User

**Endpoint:** `POST /users/login`

**Description:** Authenticates an existing user with email and password. Returns a JWT authentication token and user details upon successful login.

#### Request Body

The request body must be in JSON format and include the following fields:

```json
{
  "email": "string",
  "password": "string"
}
```

#### Field Requirements

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `email` | String | Yes | Valid email format | User's registered email address |
| `password` | String | Yes | Any length | User's password |

#### Example Request

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }'
```

#### Response

##### Success Response

**Status Code:** `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

##### Error Responses

**Status Code:** `400 Bad Request`

**Validation Errors:**
```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

**Status Code:** `401 Unauthorized`

**Authentication Errors:**
```json
{
  "message": "Invalid email or password"
}
```

**Common scenarios for 401 errors:**
- Email address not found in database
- Password does not match the stored hash
- Malformed or missing credentials

### Get User Profile

**Endpoint:** `GET /users/profile`

**Description:** Retrieves the authenticated user's profile information. Requires a valid JWT token.

#### Authentication Required

This endpoint requires authentication. Include the JWT token in one of the following ways:

**Option 1: Authorization Header**
```
Authorization: Bearer <token>
```

**Option 2: Cookie**
```
Cookie: token=<token>
```

#### Example Request

```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Response

##### Success Response

**Status Code:** `200 OK`

```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "socketId": null
}
```

##### Error Responses

**Status Code:** `401 Unauthorized`

```json
{
  "message": "Unauthorized: No token provided"
}
```

**Status Code:** `401 Unauthorized`

```json
{
  "message": "Unauthorized: Invalid or expired token"
}
```

**Status Code:** `401 Unauthorized`

```json
{
  "message": "Unauthorized: User not found"
}
```

### Logout User

**Endpoint:** `GET /users/logout`

**Description:** Logs out the authenticated user by clearing the authentication cookie and blacklisting the JWT token to prevent reuse.

#### Authentication Required

This endpoint requires authentication. Include the JWT token in one of the following ways:

**Option 1: Authorization Header**
```
Authorization: Bearer <token>
```

**Option 2: Cookie**
```
Cookie: token=<token>
```

#### Example Request

```bash
curl -X GET http://localhost:3000/users/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Response

##### Success Response

**Status Code:** `200 OK`

```json
{
  "message": "Logged out"
}
```

##### Error Responses

**Status Code:** `400 Bad Request`

```json
{
  "message": "Token not found for logout"
}
```

**Status Code:** `401 Unauthorized`

```json
{
  "message": "Unauthorized: No token provided"
}
```

**Status Code:** `500 Internal Server Error`

```json
{
  "message": "Internal server error"
}
```

## Notes

- The `socketId` field is optional and used for real-time communication features
- The password field is excluded from responses for security
- All validation is performed server-side using express-validator
- The API follows RESTful conventions for HTTP status codes and response formats
- Login endpoint uses bcrypt to compare provided password with stored hash
- Both register and login return the same token format for consistent authentication
- Profile endpoint returns user data without the password field for security
- Logout endpoint blacklists tokens in MongoDB with automatic 24-hour expiration
- Authentication middleware checks for blacklisted tokens before processing requests
- Tokens are automatically set as HTTP cookies for web applications



# Captain Routes API Documentation

## Overview
This document describes the API endpoints for captain authentication and profile management in the ride-sharing application.

## Base URL
All captain routes are prefixed with `/captain`

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Tokens can be provided in two ways:
- **Cookie**: `token` cookie
- **Authorization Header**: `Bearer <token>`

## Endpoints

### 1. Captain Registration
**POST** `/captain/register`

Registers a new captain with vehicle information.

#### Request Body
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securepassword123",
  "vehicle": {
    "color": "Red",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

#### Validation Rules
- **email**: Must be a valid email address
- **fullname.firstname**: Must be a string with minimum 3 characters
- **password**: Must be a string with minimum 6 characters
- **vehicle.color**: Must be a string with minimum 3 characters
- **vehicle.plate**: Must be a string with minimum 3 characters
- **vehicle.capacity**: Must be an integer ≥ 1
- **vehicle.vehicleType**: Must be one of: `car`, `motorcycle`, `auto`

#### Response
**Success (201)**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "_id": "captain_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

**Error (400)**
```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

**Error (400) - Captain Already Exists**
```json
{
  "message": "Captain already exist"
}
```

---

### 2. Captain Login
**POST** `/captain/login`

Authenticates a captain and returns a JWT token.

#### Request Body
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

#### Validation Rules
- **email**: Must be a valid email address
- **password**: Must be at least 6 characters long

#### Response
**Success (200)**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "_id": "captain_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

**Error (401) - Invalid Credentials**
```json
{
  "message": "Invalid email and password"
}
```

**Error (400) - Validation Error**
```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

#### Notes
- Sets a `token` cookie on successful login
- Password is compared using bcrypt hashing

---

### 3. Get Captain Profile
**GET** `/captain/profile`

Retrieves the authenticated captain's profile information.

#### Authentication Required
Yes - Must include valid JWT token

#### Request Headers
```
Authorization: Bearer <token>
```
OR include `token` cookie

#### Response
**Success (200)**
```json
{
  "captain": {
    "_id": "captain_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

**Error (401) - Unauthorized**
```json
{
  "message": "Unauthorized: No token provided"
}
```

**Error (401) - Invalid Token**
```json
{
  "message": "Unauthorized: Invalid or expired token"
}
```

**Error (401) - Captain Not Found**
```json
{
  "message": "Unauthorized: Captain not found"
}
```

---

### 4. Captain Logout
**GET** `/captain/logout`

Logs out the authenticated captain by blacklisting their token.

#### Authentication Required
Yes - Must include valid JWT token

#### Request Headers
```
Authorization: Bearer <token>
```
OR include `token` cookie

#### Response
**Success (200)**
```json
{
  "message": "Logged out"
}
```

**Error (400) - No Token**
```json
{
  "message": "Token not found for logout"
}
```

**Error (401) - Unauthorized**
```json
{
  "message": "Unauthorized: No token provided"
}
```

**Error (500) - Server Error**
```json
{
  "message": "Internal server error"
}
```

#### Notes
- Clears the `token` cookie
- Adds the token to a blacklist to prevent reuse
- Token becomes invalid for all future requests

## Error Handling

### Common Error Responses

#### 400 Bad Request
- Validation errors
- Missing required fields
- Captain already exists

#### 401 Unauthorized
- Missing or invalid token
- Blacklisted token
- Captain not found
- Invalid credentials

#### 500 Internal Server Error
- Database connection issues
- Server-side errors

## Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt before storage
2. **JWT Tokens**: Secure token-based authentication
3. **Token Blacklisting**: Prevents reuse of logged-out tokens
4. **Input Validation**: Comprehensive validation using express-validator
5. **Duplicate Prevention**: Checks for existing captain email during registration

## Vehicle Types
The following vehicle types are supported:
- `car`: Standard passenger car
- `motorcycle`: Two-wheeler vehicle
- `auto`: Auto-rickshaw/tuk-tuk

## Rate Limiting
Consider implementing rate limiting on these endpoints, especially:
- Login endpoint to prevent brute force attacks
- Registration endpoint to prevent spam

## Usage Examples

### Register a New Captain
```bash
curl -X POST http://localhost:3000/captain/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "password": "password123",
    "vehicle": {
      "color": "Blue",
      "plate": "XYZ789",
      "capacity": 4,
      "vehicleType": "car"
    }
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/captain/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:3000/captain/profile \
  -H "Authorization: Bearer <your_token>"
```

### Logout
```bash
curl -X GET http://localhost:3000/captain/logout \
  -H "Authorization: Bearer <your_token>"
```