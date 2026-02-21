# Test Cases - User Management Module

**Module:** User Profile & Friend Management  
**Version:** 1.0  
**Date:** February 2026

---

## TC-USER-001: User Profile Creation

**Objective:** Verify user profile is created with correct information

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-USER-001 |
| **Priority** | P0 (Critical) |
| **Type** | Functional |
| **Precondition** | User registered and logged in |

**Steps:**
1. Navigate to profile page
2. View profile information (email, username, join date)
3. Verify all required fields populated
4. Check default avatar if no custom avatar uploaded

**Expected Results:**
- ✅ Profile displays correctly
- ✅ Email verified and secure
- ✅ Creation date accurate
- ✅ Default avatar shown
- ✅ User display name visible
- ✅ Stats shown (0 wins, 0 losses initially)

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-USER-002: Update User Information

**Objective:** Verify user can update profile information

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-USER-002 |
| **Priority** | P1 (High) |
| **Type** | Functional |
| **Precondition** | User logged in, profile page accessible |

**Steps:**
1. Click "Edit Profile" button
2. Update display name to "NewUsername"
3. (Optional) Update bio
4. Click "Save Changes"
5. Refresh page and verify changes persisted

**Expected Results:**
- ✅ Changes saved to database
- ✅ Changes reflected immediately on profile
- ✅ Changes persist after page refresh
- ✅ Confirmation message displayed
- ✅ Data validated before save

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-USER-003: Avatar Upload

**Objective:** Verify user can upload custom avatar

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-USER-003 |
| **Priority** | P1 (High) |
| **Type** | Functional |
| **Precondition** | User logged in, profile page accessible |

**Steps:**
1. Click "Upload Avatar" button
2. Select image file (PNG, JPG, max 5MB)
3. Confirm upload
4. Verify new avatar displayed on profile
5. Logout and login, verify avatar persists

**Expected Results:**
- ✅ Avatar uploaded successfully
- ✅ Image displayed on profile
- ✅ Image displays on other users' views
- ✅ File size validated (max 5MB)
- ✅ Image format validated
- ✅ Avatar persists in database

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-USER-004: Friend Request Sent

**Objective:** Verify user can send friend request

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-USER-004 |
| **Priority** | P1 (High) |
| **Type** | Functional |
| **Precondition** | Two users registered and logged in |

**Steps:**
1. User A searches for User B
2. User A clicks "Add Friend" button
3. Friend request sent
4. Observe confirmation message

**Expected Results:**
- ✅ Friend request sent successfully
- ✅ Button changes to "Request Pending"
- ✅ User B notified of request
- ✅ Request stored in database
- ✅ No duplicate requests allowed

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-USER-005: Friend Request Acceptance

**Objective:** Verify user can accept friend request

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-USER-005 |
| **Priority** | P1 (High) |
| **Type** | Functional |
| **Precondition** | Friend request sent from User A to User B |

**Steps:**
1. User B receives friend request notification
2. User B opens "Friends" page
3. User B clicks "Accept" on User A's request
4. Friendship established

**Expected Results:**
- ✅ Request accepted
- ✅ Both users now see each other in friends list
- ✅ Confirmation message displayed
- ✅ Friend request removed from pending
- ✅ Relationship stored bidirectionally in database

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-USER-006: Online Status Tracking

**Objective:** Verify online/offline status is tracked correctly

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-USER-006 |
| **Priority** | P1 (High) |
| **Type** | Functional (Real-time) |
| **Precondition** | User A and User B are friends |

**Steps:**
1. User A logs in
2. User B observes User A's status (should show "Online")
3. User A closes browser
4. Wait 5 seconds
5. User B's view updates to show User A as "Offline"

**Expected Results:**
- ✅ Online status appears immediately when user logs in
- ✅ Offline status appears after disconnection
- ✅ Status updates real-time to friends (WebSocket)
- ✅ Last seen timestamp recorded
- ✅ Status accurate across devices

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-USER-007: Block User

**Objective:** Verify user can block another user

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-USER-007 |
| **Priority** | P1 (High) |
| **Type** | Functional |
| **Precondition** | Two users are friends |

**Steps:**
1. User A navigates to User B's profile
2. Click "Block User" button
3. Confirm blocking action
4. User B attempts to send message to User A

**Expected Results:**
- ✅ User B blocked successfully
- ✅ User B's messages are prevented
- ✅ User B cannot see User A in search
- ✅ Confirmation message displayed to User A
- ✅ Block relationship stored in database

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-USER-008: User Statistics Display

**Objective:** Verify user statistics are accurate and displayed

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-USER-008 |
| **Priority** | P1 (High) |
| **Type** | Functional |
| **Precondition** | User has played multiple games |

**Steps:**
1. Navigate to user profile
2. View statistics section
3. Check displayed stats:
   - Total games played
   - Wins
   - Losses
   - Win rate (%)
   - Active since (join date)

**Expected Results:**
- ✅ All statistics displayed correctly
- ✅ Numbers match database records
- ✅ Win rate calculated accurately
- ✅ Statistics update after each game
- ✅ Statistics publicly visible to other users
- ✅ Tournament scores included (if applicable)

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-USER-009: User Search Functionality

**Objective:** Verify user can search for other users

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-USER-009 |
| **Priority** | P1 (High) |
| **Type** | Functional |
| **Precondition** | Multiple users registered |

**Steps:**
1. Navigate to search page
2. Enter username (e.g., "john")
3. Search results displayed
4. Click on user to view profile

**Expected Results:**
- ✅ Search results show matching users
- ✅ User names displayed
- ✅ Avatars shown
- ✅ Online status visible
- ✅ Results paginated if > 10 users
- ✅ Search case-insensitive

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-USER-010: Match History View

**Objective:** Verify user can view complete match history

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-USER-010 |
| **Priority** | P1 (High) |
| **Type** | Functional |
| **Precondition** | User played 5+ games |

**Steps:**
1. Navigate to user profile
2. Click "Match History"
3. View list of games
4. Click on specific match for details

**Expected Results:**
- ✅ All games listed chronologically
- ✅ Opponent name shown
- ✅ Game date and time accurate
- ✅ Final score displayed
- ✅ Win/Loss indicated
- ✅ Game type shown (1v1, 2v2, vs AI, tournament)
- ✅ Details match database records

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## Test Execution Summary

**Total Test Cases:** 10  
**Passed:** [__]  
**Failed:** [__]  
**Blocked:** [__]  
**Pending:** [__]

**Date Completed:** ________________  
**Tested By:** ________________  
**Approved By:** ________________

