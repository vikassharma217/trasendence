# Test Cases - Authentication Module

**Module:** User Registration & Login  
**Version:** 1.0  
**Date:** February 2026

---

## TC-AUTH-001: User Registration - Valid Credentials

**Objective:** Verify user can register with valid email and password

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-001 |
| **Priority** | P0 (Critical) |
| **Type** | Functional |
| **Precondition** | User not registered, registration page accessible |

**Steps:**
1. Navigate to registration page
2. Enter valid email (e.g., test@example.com)
3. Enter strong password (min 8 chars, numbers, special chars)
4. Confirm password
5. Click "Register" button

**Expected Results:**
- ✅ User account created successfully
- ✅ Message: "Registration successful"
- ✅ Redirected to login page
- ✅ User data stored in database with hashed password

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-AUTH-002: User Registration - Email Already Exists

**Objective:** Verify system prevents duplicate email registration

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-002 |
| **Priority** | P1 (High) |
| **Type** | Functional |
| **Precondition** | Email already registered in system |

**Steps:**
1. Navigate to registration page
2. Enter email of existing user
3. Enter password
4. Click "Register" button

**Expected Results:**
- ✅ Error message: "Email already exists"
- ✅ User remains on registration page
- ✅ No duplicate account created

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-AUTH-003: User Registration - Invalid Email Format

**Objective:** Verify weak email validation is rejected

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-003 |
| **Priority** | P1 (High) |
| **Type** | Functional |
| **Precondition** | Registration page accessible |

**Steps:**
1. Navigate to registration page
2. Enter invalid email (e.g., "notanemail" or "test@")
3. Enter valid password
4. Click "Register" button

**Expected Results:**
- ✅ Error message: "Invalid email format"
- ✅ Registration form not submitted

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-AUTH-004: User Login - Valid Credentials

**Objective:** Verify registered user can login successfully

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-004 |
| **Priority** | P0 (Critical) |
| **Type** | Functional |
| **Precondition** | User registered, login page accessible |

**Steps:**
1. Navigate to login page
2. Enter registered email
3. Enter correct password
4. Click "Login" button

**Expected Results:**
- ✅ Login successful
- ✅ JWT token generated and stored in localStorage
- ✅ Redirected to home/dashboard page
- ✅ User session established

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-AUTH-005: User Login - Incorrect Password

**Objective:** Verify login denied with wrong password

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-005 |
| **Priority** | P1 (High) |
| **Type** | Functional |
| **Precondition** | User registered, login page accessible |

**Steps:**
1. Navigate to login page
2. Enter registered email
3. Enter incorrect password
4. Click "Login" button

**Expected Results:**
- ✅ Login failed
- ✅ Error message: "Invalid email or password"
- ✅ User remains on login page
- ✅ No token generated

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-AUTH-006: Two-Factor Authentication (2FA) Setup

**Objective:** Verify 2FA can be enabled on user account

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-006 |
| **Priority** | P1 (High) |
| **Type** | Functional |
| **Precondition** | User logged in, 2FA settings accessible |

**Steps:**
1. Navigate to security settings
2. Select "Enable 2FA" option
3. Choose authentication method (authenticator app or email)
4. Follow setup instructions
5. Save configuration

**Expected Results:**
- ✅ 2FA enabled successfully
- ✅ QR code or verification code provided
- ✅ Confirmation message displayed
- ✅ Next login requires 2FA verification

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-AUTH-007: Login with 2FA - Valid Code

**Objective:** Verify login with valid 2FA code succeeds

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-007 |
| **Priority** | P0 (Critical) |
| **Type** | Functional |
| **Precondition** | User has 2FA enabled, login page accessible |

**Steps:**
1. Navigate to login page
2. Enter email and password
3. Get 2FA code from authenticator app
4. Enter 2FA code
5. Click "Verify" button

**Expected Results:**
- ✅ 2FA verification successful
- ✅ JWT token generated
- ✅ Redirected to home page
- ✅ User session established

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-AUTH-008: Login with 2FA - Invalid Code

**Objective:** Verify login fails with incorrect 2FA code

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-008 |
| **Priority** | P1 (High) |
| **Type** | Functional |
| **Precondition** | User has 2FA enabled, login page accessible |

**Steps:**
1. Navigate to login page
2. Enter email and password
3. Enter incorrect 2FA code
4. Click "Verify" button

**Expected Results:**
- ✅ Verification failed
- ✅ Error message: "Invalid 2FA code"
- ✅ User allowed to retry (max 5 attempts)
- ✅ No token generated

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-AUTH-009: JWT Token Expiration

**Objective:** Verify expired JWT token triggers re-authentication

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-009 |
| **Priority** | P1 (High) |
| **Type** | Security |
| **Precondition** | User logged in with valid token |

**Steps:**
1. User logged in (JWT token obtained)
2. Wait for token expiration time (e.g., 1 hour)
3. Attempt to access protected resource
4. Observe system behavior

**Expected Results:**
- ✅ Expired token rejected
- ✅ User redirected to login page
- ✅ Session invalidated
- ✅ Message: "Session expired, please login again"

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-AUTH-010: Google OAuth Login

**Objective:** Verify Google OAuth authentication works

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-010 |
| **Priority** | P1 (High) |
| **Type** | Functional |
| **Precondition** | Google OAuth configured, login page accessible |

**Steps:**
1. Navigate to login page
2. Click "Login with Google" button
3. Select/authenticate with Google account
4. System processes OAuth response

**Expected Results:**
- ✅ Redirected to Google login (if not authenticated)
- ✅ Permission consent screen shown
- ✅ Redirected back to application
- ✅ User account created/linked
- ✅ JWT token generated
- ✅ User logged in successfully

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-AUTH-011: SQL Injection Prevention - Login Field

**Objective:** Verify application is protected against SQL injection

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-011 |
| **Priority** | P0 (Critical) |
| **Type** | Security |
| **Precondition** | Login page accessible |

**Steps:**
1. Navigate to login page
2. Enter SQL injection payload in email field: `' OR '1'='1`
3. Enter any password
4. Click "Login" button

**Expected Results:**
- ✅ Injection attempt rejected
- ✅ Error message: "Invalid email or password"
- ✅ No unauthorized access granted
- ✅ Payload safely escaped/parameterized

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-AUTH-012: Password Strength Validation

**Objective:** Verify password meets complexity requirements

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-012 |
| **Priority** | P1 (High) |
| **Type** | Functional |
| **Precondition** | Registration page accessible |

**Test Data:**

| Password | Expected Result |
|----------|-----------------|
| `pass` | ❌ Rejected (too short) |
| `password` | ❌ Rejected (no numbers/special chars) |
| `Pass123!` | ✅ Accepted |
| `MyP@ss2026` | ✅ Accepted |

**Expected Results:**
- ✅ Weak passwords rejected with specific feedback
- ✅ Strong passwords accepted
- ✅ Requirements clearly communicated to user

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-AUTH-013: Logout Functionality

**Objective:** Verify user can logout and session is cleared

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-013 |
| **Priority** | P1 (High) |
| **Type** | Functional |
| **Precondition** | User logged in |

**Steps:**
1. User logged in with valid session
2. Click "Logout" button
3. Observe redirect and state

**Expected Results:**
- ✅ User logged out successfully
- ✅ JWT token removed from localStorage
- ✅ Session cleared from backend
- ✅ Redirected to login page
- ✅ Cannot access protected pages (401 Unauthorized)

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## Test Execution Summary

**Total Test Cases:** 13  
**Passed:** [__]  
**Failed:** [__]  
**Blocked:** [__]  
**Pending:** [__]

**Date Completed:** ________________  
**Tested By:** ________________  
**Approved By:** ________________

