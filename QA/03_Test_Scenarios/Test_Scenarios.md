# Test Scenarios & User Workflows

**Project:** Transcendence  
**Version:** 1.0  
**Date:** February 2026

---

## Scenario 1: New User Journey (Registration → First Game)

**Objective:** Verify complete onboarding flow for new user

### Steps:
1. **Registration**
   - User navigates to website
   - Click "Register" button
   - Enter email, password, confirm password
   - Submit registration form

2. **Email Verification** (if implemented)
   - Check confirmation email
   - Click verification link
   - Account activated

3. **Profile Setup**
   - Login with new credentials
   - Set display name
   - (Optional) Upload avatar
   - Save profile

4. **Explore Game**
   - Browse game modes
   - Review rules
   - View leaderboards

5. **First Game**
   - Click "Play 1v1"
   - Wait for opponent (or play vs AI)
   - Complete first Pong game
   - View result

**Expected Outcome:**
✅ New user successfully plays first game
✅ All profile data saved correctly
✅ Game result recorded in history
✅ User stats updated (1 game, 1 win or 1 loss)

**Testing Approach:** Realistic end-to-end test

---

## Scenario 2: Authenticated User Plays Tournament

**Objective:** Verify complete tournament flow

### Steps:
1. **Login**
   - User logs in with existing credentials
   - 2FA challenge (if enabled)
   - Redirected to home

2. **Tournament Registration**
   - Navigate to tournaments
   - Click "Join Tournament"
   - Confirm display name
   - Joined successfully

3. **Wait for Match**
   - View tournament bracket
   - Wait for first match notification
   - Match starts automatically

4. **Play Match #1**
   - Play Pong against assigned opponent
   - Win/Lose the match
   - Result recorded

5. **Play Match #2** (if won)
   - Wait for semifinal match
   - Play against new opponent
   - Advance to finals or eliminated

6. **View Results**
   - See final tournament standings
   - View score on blockchain
   - Check updated stats

**Expected Outcome:**
✅ Tournament completed successfully
✅ All matches recorded
✅ Scores stored on blockchain
✅ User stats updated
✅ Leaderboard updated

**Testing Approach:** Integration test across multiple systems

---

## Scenario 3: Security Test - Login Attempts & Account Recovery

**Objective:** Verify login security and recovery mechanisms

### Steps:
1. **Correct Login**
   - Enter correct email and password
   - 2FA code (if enabled)
   - Success

2. **Failed Login Attempts**
   - Try 5 incorrect passwords
   - Observe account lockout (if implemented)
   - Try login again - locked

3. **Account Recovery**
   - Click "Forgot Password"
   - Enter registered email
   - Check recovery email
   - Click recovery link
   - Set new password
   - Login with new password

4. **Session Management**
   - Login from Device A
   - Logout from Device B (simultaneous sessions)
   - Verify only active session works

**Expected Outcome:**
✅ Brute force attacks prevented
✅ Password recovery works
✅ Sessions properly managed
✅ No unauthorized access

**Testing Approach:** Security-focused scenario

---

## Scenario 4: Real-Time Multiplayer - Network Issues

**Objective:** Verify game resilience to disconnections

### Steps:
1. **Game Start**
   - Player A and Player B start 1v1 game
   - Score 0-0 after 10 seconds

2. **Simulated Disconnection**
   - Player B network disconnected (pull network cable)
   - Player A observes: "Opponent disconnected"
   - Game paused

3. **Reconnection Attempt #1** (within 5 seconds)
   - Player B network restored
   - Automatic reconnection
   - Game resumes from same state
   - Continue playing

4. **Game Completion**
   - Game finishes normally
   - Both players see results
   - Match recorded as completed

**Expected Outcome:**
✅ Graceful disconnection handling
✅ Automatic reconnection
✅ Game state preserved
✅ Fair game experience maintained

**Testing Approach:** Chaos engineering test

---

## Scenario 5: Chat & Invitation Flow

**Objective:** Verify chat and game invitation system

### Steps:
1. **Friend Request**
   - User A finds User B
   - Send friend request
   - User B accepts
   - Both now friends

2. **Send Direct Message**
   - Open chat with User B
   - Send message: "Want to play?"
   - User B receives message in real-time
   - User B replies

3. **Send Game Invitation**
   - Click "Invite to Game" in chat
   - Select game type (1v1)
   - User B sees invitation
   - User B clicks "Accept"

4. **Game Starts**
   - Game launches for both players
   - Both can play
   - Result recorded

**Expected Outcome:**
✅ Real-time messaging works
✅ Invitations delivered
✅ Chat persists across sessions
✅ Game launches from invitation

**Testing Approach:** Integration test - WebSocket + Game

---

## Scenario 6: Cross-Device Experience

**Objective:** Verify application works on desktop and mobile

### Steps:
1. **Desktop Login**
   - Login on laptop
   - Play game
   - View profile

2. **Mobile Access** (tablet/smartphone)
   - Navigate to same application on mobile
   - Responsive layout loads
   - Can view profile
   - Can see online status

3. **Game on Mobile**
   - Start game on mobile
   - Check controls (touch-friendly)
   - Game playable on mobile
   - Results sync with desktop

**Expected Outcome:**
✅ Responsive design works
✅ Touch controls work
✅ No broken layouts
✅ Data consistent across devices
✅ Session shared (same user logged in)

**Testing Approach:** Cross-device testing

---

## Scenario 7: Data Persistence & Recovery

**Objective:** Verify data is not lost after crashes/reloads

### Steps:
1. **Start Game**
   - Player at score 3-2 in game (5 points to win)
   - Score persisted in memory

2. **Browser Crash**
   - Force browser close (kill process)
   - Data not manually saved

3. **Reopen Browser**
   - User logs back in
   - Navigate to match history
   - Previous game shown with correct result
   - Stats updated accurately

4. **Verify Blockchain**
   - Check tournament scores stored on blockchain
   - Results match local database

**Expected Outcome:**
✅ No data loss
✅ Game state recoverable
✅ Tournament scores immutable on blockchain
✅ Database integrity maintained

**Testing Approach:** Data integrity test

---

## Scenario 8: Player vs AI

**Objective:** Verify AI opponent functionality

### Steps:
1. **Start AI Game**
   - Click "Play vs AI"
   - Game initializes with AI opponent
   - AI paddle visible

2. **AI Behavior**
   - AI attempts to hit ball
   - AI misses sometimes (not always wins)
   - AI anticipates direction
   - AI reacts within 1 second

3. **Play Full Game**
   - Play until win condition (first to 5)
   - Player may win or lose
   - AI provides competitive challenge

4. **Multiple Rounds**
   - Play 3 games against AI
   - AI difficulty consistent
   - Results recorded for each game

**Expected Outcome:**
✅ AI is functional
✅ AI provides challenge
✅ AI doesn't always win
✅ AI doesn't always lose
✅ Games are fair and enjoyable

**Testing Approach:** Gameplay test with AI

---

## Scenario 9: Browser Compatibility (Firefox Focus)

**Objective:** Verify application works in Firefox

### Steps:
1. **Firefox Latest Stable**
   - Open application in Firefox 121+
   - All pages load correctly
   - No CSS broken

2. **Game in Firefox**
   - Play 1v1 game in Firefox
   - WebSockets work
   - Real-time updates work
   - Ball physics correct

3. **Developer Console**
   - Open Firefox DevTools (F12)
   - Check Console tab
   - No errors or warnings
   - No unhandled exceptions

4. **Features in Firefox**
   - Authentication works
   - Chat works
   - File upload (avatar) works
   - All buttons responsive

**Expected Outcome:**
✅ Application fully functional in Firefox
✅ No console errors
✅ No warnings
✅ Meets mandatory requirement

**Testing Approach:** Compatibility test

---

## Scenario 10: Stress Test - Tournament with 16 Players

**Objective:** Verify system handles large tournament

### Steps:
1. **Tournament Creation**
   - Create tournament bracket for 16 players
   - All players registered

2. **Concurrent Matches**
   - Matches progress simultaneously
   - Monitor server load
   - Monitor WebSocket connections

3. **Real-Time Updates**
   - All bracket updates in real-time
   - Scores pushed to all spectators
   - No lag or delays

4. **Blockchain Transactions**
   - After each match, score stored
   - Multiple transactions processing
   - All succeed or gracefully fail

5. **Leaderboard**
   - Final tournament leaderboard displayed
   - Rankings correct
   - Stats updated for all 16 players

**Expected Outcome:**
✅ System handles 16-player tournament
✅ No crashes or timeouts
✅ All data recorded
✅ Performance acceptable (< 1s latency)

**Testing Approach:** Load/stress test

---

## Test Scenario Matrix

| Scenario ID | Name | Type | Priority | Duration |
|-------------|------|------|----------|----------|
| TS-001 | New User Journey | E2E | P0 | 30 min |
| TS-002 | Tournament Flow | Integration | P0 | 60 min |
| TS-003 | Security & Recovery | Security | P1 | 45 min |
| TS-004 | Network Resilience | Integration | P0 | 45 min |
| TS-005 | Chat & Invitations | Integration | P1 | 30 min |
| TS-006 | Cross-Device | UI/UX | P1 | 45 min |
| TS-007 | Data Persistence | Data Integrity | P1 | 40 min |
| TS-008 | Player vs AI | Gameplay | P1 | 30 min |
| TS-009 | Browser Compat | Compatibility | P0 | 40 min |
| TS-010 | Stress Test | Load | P1 | 90 min |

**Total Estimated Testing Time:** 5.5 hours

