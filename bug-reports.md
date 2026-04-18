# Bug Reports — REM Waste Booking Flow

---

## BUG-001: Manual Address Entry Causes Duplicate Booking Error for Different Users

### Summary
When two different users enter different manual addresses for the same postcode and skip size, the system incorrectly rejects the second booking as a duplicate.

### Severity
**High**

### Priority
**High**

### Environment
- URL: http://localhost:3000
- Browser: Chrome 147
- Device: Desktop
- OS: macOS

### Root Cause
The booking key is constructed as `${postcode}-${addressId}-${skipSize}`. When a user enters a manual address, `addressId` is hardcoded to the string `'manual'` regardless of the actual address text entered. This means any two bookings using manual entry with the same postcode and skip size will share an identical key and the second will be rejected as a duplicate.

### Steps to Reproduce
1. Open the app at http://localhost:3000
2. Enter `SW1A 1AA` → Click Find
3. Click "Can't find your address? Enter manually"
4. Type `1 Custom Road, London` → Click Next
5. Select General Waste → Click Next
6. Select 4-yard skip → Click Next
7. Click Confirm Booking → Note the booking ID
8. Refresh the page
9. Enter `SW1A 1AA` → Click Find again
10. Click "Can't find your address? Enter manually"
11. Type `2 Different Road, London` (a completely different address)
12. Select General Waste → Click Next
13. Select 4-yard skip → Click Next
14. Click Confirm Booking

### Actual Result
Step 14 returns: `"Duplicate booking"` error (HTTP 409), even though the address entered is completely different from the first booking.

### Expected Result
The second booking should succeed with a new booking ID, because the addresses entered are different.

### Evidence
The booking key in `app/api/booking/confirm/route.ts`:
```
const bookingKey = `${postcode}-${addressId}-${skipSize}`
```
When manual entry is used, `addressId` is always `'manual'`, so the key becomes `SW1A1AA-manual-4-yard` for any manual entry — regardless of the actual address text.

### Suggested Fix
Use a hash or slug of the actual manual address text as the `addressId` instead of the hardcoded string `'manual'`.

---

## BUG-002: BS1 4DJ Error Counter Is Not Isolated Per User Session

### Summary
The server-side call counter for BS1 4DJ is a shared singleton. If two users (or two browser tabs) trigger the BS1 4DJ postcode lookup simultaneously, the counter increments incorrectly and one user may receive a success response on their first attempt instead of the expected 500 error.

### Severity
**Medium**

### Priority
**Medium**

### Environment
- URL: http://localhost:3000
- Browser: Chrome 147
- Device: Desktop (two tabs)
- OS: macOS

### Root Cause
The `bs14djCallCount` is stored on the `bookingStore` object which lives in server memory as a module-level singleton. It is shared across all incoming requests with no session or user isolation. In a concurrent environment, two simultaneous calls from different users will both increment the same counter, causing unpredictable behaviour.

### Steps to Reproduce
1. Open two browser tabs, both pointing to http://localhost:3000
2. In Tab 1: Enter `BS1 4DJ` → Click Find (do not click yet)
3. In Tab 2: Enter `BS1 4DJ` → Click Find (do not click yet)
4. Click Find in Tab 1 and Tab 2 at the same time (within ~100ms of each other)

### Actual Result
One of the tabs receives a success response with addresses on the first call, instead of the expected 500 error. The fixture behaviour is broken.

### Expected Result
Each user's first call to BS1 4DJ should always return a 500 error, regardless of concurrent usage.

### Evidence
In `lib/store.ts`:
```
bs14djCallCount: 0
```
This is a single shared integer incremented by any request, with no per-session tracking.

### Suggested Fix
Track the call count per session using a session ID passed in the request header, or use a Map keyed by session ID instead of a single counter.

---

## BUG-003: Stale Disabled Skip Cards Briefly Visible During Waste Type State Transition

### Summary
When a user selects Heavy Waste, proceeds to Step 3 (where 12-yard and 14-yard skips are disabled), then navigates back to Step 2 and switches to General Waste, Step 3 briefly renders the previous heavy waste skip list (with disabled cards) before the new API response arrives. This creates a misleading UI state where disabled skips appear clickable for a brief moment.

### Severity
**Medium**

### Priority
**High**

### Environment
- URL: http://localhost:3000
- Browser: Chrome 147
- Device: Desktop
- OS: macOS

### Root Cause
This is a branching and state transition bug. When the user navigates back from Step 3 to Step 2 and changes their waste type selection, the `StepSkipSelect` component re-mounts and immediately triggers a new `fetchSkips` API call. However, the previous `skips` state from the heavy waste selection is not cleared before the new call completes. During the loading window, the stale heavy-waste skip list (including disabled cards) is rendered briefly before being replaced.

### Steps to Reproduce
1. Enter `SW1A 1AA` → Click Find → Select any address → Click Next
2. Select Heavy Waste → Click Next
3. Observe Step 3: 12-yard and 14-yard are shown as disabled
4. Click Back to return to Step 2
5. Uncheck Heavy Waste → Check General Waste → Click Next
6. Observe Step 3 immediately as it loads

### Actual Result
For a brief moment (approximately 200–500ms), the skip list from the Heavy Waste selection is still visible, including the disabled 12-yard and 14-yard cards. A fast user could perceive these cards as the correct state for General Waste.

### Expected Result
When Step 3 loads after a waste type change, a loading spinner should be shown immediately and the stale skip list should not be rendered at any point.

### Evidence
In `StepSkipSelect.tsx`, the `skips` state is not reset before `fetchSkips` is called:
```typescript
const fetchSkips = async () => {
  setLoading(true)  // loading starts
  setError('')
  // skips state is NOT cleared here — stale data remains visible
  ...
}
```
Adding `setSkips([])` before the fetch call would clear the stale state immediately and prevent the brief flash of incorrect skip cards.

### Suggested Fix
Add `setSkips([])` at the start of `fetchSkips`, before the API call is made:
```typescript
const fetchSkips = async () => {
  setLoading(true)
  setError('')
  setSkips([])  // clear stale data immediately
  ...
}
```

