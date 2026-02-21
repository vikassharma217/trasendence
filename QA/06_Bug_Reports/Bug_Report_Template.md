# Bug Report Template

**Project:** Transcendence  
**Version:** 1.0

---

## Bug Report - #[BUG-XXX]

### Summary
**Title:** [Brief description of defect]

**Severity:** ☐ Critical (P0) | ☐ High (P1) | ☐ Medium (P2) | ☐ Low (P3)

**Priority:** ☐ Urgent | ☐ High | ☐ Medium | ☐ Low

**Status:** ☐ Open | ☐ In Progress | ☐ Fixed | ☐ Closed | ☐ Won't Fix

---

### Environment
- **Component:** [e.g., Authentication, Gameplay, Chat]
- **Module:** [Specific module affected]
- **OS:** [Windows, macOS, Linux]
- **Browser:** [Firefox version]
- **Test Date:** YYYY-MM-DD
- **Tested By:** [QA Name]

---

### Reproduction Steps

1. [First step]
2. [Second step]
3. [Third step]
...
N. [Final step to observe bug]

**Preconditions:**
- [What state must be true before starting]
- [Any prerequisites]

---

### Expected Behavior
[What should happen according to requirements]

### Actual Behavior
[What actually happened instead]

---

### Screenshots / Evidence
[Attach screenshots or logs showing the issue]

```
[Paste console errors or log messages here]
```

---

### Severity Justification

**Why is this severity level appropriate?**
[Explain impact and scope of defect]

---

### Related Test Cases
- TC-XXX-001: [Test case name]
- TC-XXX-002: [Test case name]

---

### Root Cause Analysis (After Investigation)

**Component Affected:** [Identified component]

**Suspected Cause:**
```javascript
// Example: Code snippet that might be causing issue
function example() {
  // Issue here: ...
}
```

**Root Cause:** [After investigation by developer]

---

### Fix Applied

**Developer:** [Name]

**Changes Made:**
- [File: Changes made]
- [File: Changes made]

**Fix Verified By:** [QA Name]  
**Verification Date:** YYYY-MM-DD

---

### Additional Notes

- [Any relevant information]
- [Related bugs or features]
- [Performance impact if applicable]

---

## Example: Completed Bug Report

### Summary
**Title:** User cannot login with valid 2FA code

**Severity:** ☑ High (P1)

**Priority:** ☑ High

**Status:** ☑ Fixed

---

### Environment
- **Component:** Authentication
- **Module:** 2FA Login
- **OS:** Windows 10
- **Browser:** Firefox 121
- **Test Date:** 2026-02-21
- **Tested By:** QA Team

---

### Reproduction Steps

1. User registers with 2FA enabled
2. User logs in with correct email/password
3. 2FA dialog appears
4. User gets 6-digit code from authenticator app
5. User enters code in input field
6. User clicks "Verify" button

**Preconditions:**
- User account created with 2FA enabled
- Authenticator app synchronized correctly
- Code is within 30-second validity window

---

### Expected Behavior
- 2FA code accepted
- User logged in successfully
- Redirected to dashboard
- JWT token stored

### Actual Behavior
- Error message: "Invalid 2FA code"
- User remains on 2FA verification screen
- No token generated

---

### Screenshots / Evidence

**Browser Console Error:**
```
Error: Invalid 2FA code at verify (auth.ts:145)
TypeError: Can't read properties of undefined (reading 'secret')
  at verifyToken (myjwt.ts:78)
```

**Network Request:**
```
POST /api/verify-2fa
Status: 400 Bad Request
Response: {"error": "Invalid token"}
```

---

### Severity Justification

This is High severity because:
- Users cannot access system with 2FA enabled
- Affects critical authentication path
- Impacts security feature functionality
- Causes service unavailability for 2FA users
- Blocks all 2FA-enabled accounts from login

---

### Related Test Cases
- TC-AUTH-006: 2FA Setup
- TC-AUTH-007: 2FA Login - Valid Code
- TC-AUTH-008: 2FA Login - Invalid Code

---

### Root Cause Analysis

**Component Affected:** Backend - `Verify2faToken.ts`

**Suspected Cause:** JWT validation comparing TOTP codes incorrectly

**Root Cause (After Investigation by Dev):**
In `myjwt.ts` line 78, the function reads `secret` from `undefined` because the user's 2FA secret was not loaded from database before verification. The lookup query was using wrong parameter name.

---

### Fix Applied

**Developer:** Backend Team

**Changes Made:**
- `Backend/src/router/Verify2faToken.ts`: Fixed query parameter from `userId` to `id`
- `Backend/src/utils/myjwt.ts`: Added null check for secret before comparison

**Fix Verified By:** QA Team  
**Verification Date:** 2026-02-21

**Fix Verification:**
1. ✅ User can now login with valid 2FA code
2. ✅ Invalid codes still rejected
3. ✅ JWT token generated correctly
4. ✅ User redirected to dashboard

---

### Additional Notes

- Fix also prevents information disclosure (doesn't reveal if user exists)
- Performance impact: minimal (one additional database lookup)
- Consider adding rate limiting to prevent brute force
- Recommend additional unit tests for 2FA module

---

**Assigned to:** [Developer Name]  
**Created Date:** 2026-02-21  
**Resolved Date:** 2026-02-21  
**Closed Date:** 2026-02-21

