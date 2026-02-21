# Test Cases - Gameplay Module

**Module:** Pong Game & Gameplay  
**Version:** 1.0  
**Date:** February 2026

---

## TC-GAME-001: 1v1 Pong Game - Basic Functionality

**Objective:** Verify basic 1v1 Pong game mechanics work correctly

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-GAME-001 |
| **Priority** | P0 (Critical) |
| **Type** | Functional |
| **Precondition** | Both players logged in, game page accessible |

**Steps:**
1. Player 1 initiates 1v1 game
2. Player 2 accepts game invitation
3. Game starts with ball in center
4. Player 1 moves paddle UP/DOWN
5. Player 2 moves paddle UP/DOWN
6. Ball bounce off paddles and walls
7. Continue until ball reaches boundary (point scored)

**Expected Results:**
- ✅ Game initializes correctly
- ✅ Both paddles visible and responsive
- ✅ Ball moves smoothly
- ✅ Ball bounces off paddles
- ✅ Collision detection working
- ✅ Score updates when ball passes paddle
- ✅ Game state synchronized between players

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-GAME-002: Paddle Movement Synchronization

**Objective:** Verify paddle movements are synchronized between remote players

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-GAME-002 |
| **Priority** | P0 (Critical) |
| **Type** | Functional (Integration - Real-time) |
| **Precondition** | 1v1 game in progress, both players connected |

**Steps:**
1. Player 1 moves paddle quickly from bottom to top
2. Observe Player 2's view of Player 1's paddle
3. Verify movement is smooth and real-time (no lag > 200ms)
4. Player 2 makes reciprocal move
5. Observe Player 1's view

**Expected Results:**
- ✅ Paddle movements appear in real-time to opponent
- ✅ No perceptible delay (latency < 200ms)
- ✅ Movement smooth, not jumpy
- ✅ WebSocket messages sent/received correctly
- ✅ Position updates accurate

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-GAME-003: Ball Bounce Physics

**Objective:** Verify ball bounces correctly off paddles and walls

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-GAME-003 |
| **Priority** | P1 (High) |
| **Type** | Functional |
| **Precondition** | 1v1 game in progress |

**Steps:**
1. Ball approaches paddle at different angles
2. Hit ball with paddle at edge (glancing blow)
3. Hit ball with paddle at center (direct hit)
4. Allow ball to hit top wall
5. Allow ball to hit bottom wall

**Expected Results:**
- ✅ Ball bounces at correct angle (reflection)
- ✅ Ball speed consistent (no unexplained acceleration)
- ✅ Wall bounces work correctly
- ✅ No ball clipping through paddles
- ✅ Physics feel natural and consistent with Pong

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-GAME-004: Score Tracking

**Objective:** Verify score increments correctly during gameplay

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-GAME-004 |
| **Priority** | P1 (High) |
| **Type** | Functional |
| **Precondition** | 1v1 game in progress |

**Steps:**
1. Start fresh game (score 0-0)
2. Allow ball to pass Player 2's paddle into goal
3. Verify score updates (Player 1: 1, Player 2: 0)
4. Continue play until Player 2 scores
5. Verify score updates (Player 1: 1, Player 2: 1)
6. Play until win condition (first to 5 points, e.g.)

**Expected Results:**
- ✅ Score increments correctly
- ✅ Score displayed for both players
- ✅ Score synchronized between players
- ✅ Game ends when win condition reached
- ✅ Winner announced

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-GAME-005: Game Disconnection Handling

**Objective:** Verify system handles player disconnection gracefully

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-GAME-005 |
| **Priority** | P1 (High) |
| **Type** | Functional (Error Handling) |
| **Precondition** | 1v1 game in progress |

**Steps:**
1. Game in progress
2. Simulate Player 2 disconnection (close browser/turn off internet)
3. Observe system behavior on Player 1's side
4. Wait 5 seconds, then Player 2 reconnects

**Expected Results:**
- ✅ Player 1 notified of disconnection
- ✅ Game paused or suspended
- ✅ Message: "Opponent disconnected, waiting for reconnection..."
- ✅ If Player 2 reconnects within time limit, game resumes
- ✅ If timeout, game ends, option to play again
- ✅ Game state recovered correctly on reconnection

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-GAME-006: 2v2 Multiplayer Game

**Objective:** Verify 2v2 game mode works with 4 players

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-GAME-006 |
| **Priority** | P1 (High) |
| **Type** | Functional (Integration) |
| **Precondition** | 4 players logged in, game page accessible |

**Steps:**
1. Player 1 initiates 2v2 game
2. Players 2, 3, 4 accept invitation
3. Game starts with proper team assignment
4. All players move paddles simultaneously
5. Play continues until scoring conditions

**Expected Results:**
- ✅ All 4 players' paddle movements synchronized
- ✅ Correct team assignments (Team A: P1+P3, Team B: P2+P4)
- ✅ Scoring logic accounts for teams
- ✅ All game mechanics work with 4 paddles
- ✅ No client crashes or hangs

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-GAME-007: AI Opponent Behavior

**Objective:** Verify AI opponent plays competitively

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-GAME-007 |
| **Priority** | P1 (High) |
| **Type** | Functional |
| **Precondition** | Game vs AI mode accessible |

**Steps:**
1. Player initiates game against AI
2. AI starts playing (paddle moves automatically)
3. Play multiple rounds against AI
4. Observe AI strategy (anticipation, reaction time)
5. Test edge cases (AI at boundaries, rapid ball changes)

**Expected Results:**
- ✅ AI paddle moves to intercept ball
- ✅ AI does not always win (player can beat it)
- ✅ AI does not always lose (provides challenge)
- ✅ AI refreshes view once per second (as per spec)
- ✅ AI uses keyboard simulation correctly
- ✅ AI paddle speed matches human player speed
- ✅ AI can react to unexpected ball movement

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-GAME-008: Tournament Matchmaking

**Objective:** Verify tournament system correctly schedules matches

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-GAME-008 |
| **Priority** | P1 (High) |
| **Type** | Functional |
| **Precondition** | Tournament page accessible, 4+ players registered |

**Steps:**
1. Create new tournament
2. Register 4 players with display names
3. System auto-generates bracket
4. Observe proposed matches (e.g., P1 vs P2, P3 vs P4)
5. Verify next match schedule is shown

**Expected Results:**
- ✅ Tournament bracket created automatically
- ✅ All players assigned fairly
- ✅ Next match clearly indicated
- ✅ Display names shown (not system IDs)
- ✅ Players notified of their matches
- ✅ Match order logical and fair

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-GAME-009: Tournament Score Blockchain Storage

**Objective:** Verify tournament scores stored on blockchain

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-GAME-009 |
| **Priority** | P1 (High) |
| **Type** | Functional (Integration - Blockchain) |
| **Precondition** | Tournament completed, blockchain connected |

**Steps:**
1. Complete tournament match (winner determined)
2. Final results submitted
3. System initiates smart contract transaction
4. Monitor blockchain transaction status
5. Query blockchain for stored score

**Expected Results:**
- ✅ Transaction submitted to Avalanche testnet
- ✅ Smart contract executes successfully
- ✅ Score stored immutably on blockchain
- ✅ Winner verified on blockchain
- ✅ Transaction hash provided to user
- ✅ Data retrievable from blockchain

**Actual Results:**
- [To be filled during execution]

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## TC-GAME-010: Game History & Stats Display

**Objective:** Verify user game history is recorded and displayed

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-GAME-010 |
| **Priority** | P1 (High) |
| **Type** | Functional |
| **Precondition** | User played multiple games |

**Steps:**
1. Navigate to user profile
2. View "Game History" section
3. Verify all played games listed
4. Check game details (opponent, date, score, result)
5. Verify statistics (wins, losses, win rate)

**Expected Results:**
- ✅ All games displayed in chronological order
- ✅ Correct opponent names shown
- ✅ Accurate scores recorded
- ✅ Win/Loss status correct
- ✅ Timestamps accurate
- ✅ Statistics calculated correctly
- ✅ Data persists across sessions

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

