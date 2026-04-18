# Manual Test Cases — REM Waste Booking Flow

## Test Environment
- URL: http://localhost:3000
- Browser: Chrome (latest)
- Device: Desktop & Mobile

---

## Functional Tests

| # | Test Case | Description | Precondition | Flow | Expected Result | Priority |
|---|-----------|-------------|--------------|------|-----------------|----------|
| TC-01 | Valid postcode lookup | Enter a valid UK postcode and retrieve addresses | App is loaded | Enter `SW1A 1AA` → Click Find | Address dropdown appears with 12 addresses | High |
| TC-02 | Address selection and proceed | Select an address from dropdown and proceed to Step 2 | TC-01 passed | Select `10 Downing Street` → Click Next | Step 2 loads with waste type options | High |
| TC-03 | General waste selection | Select General Waste and proceed | Step 2 is loaded | Check General Waste → Click Next | Step 3 loads with 8 skip options all enabled | High |
| TC-04 | Heavy waste selection | Select Heavy Waste and proceed | Step 2 is loaded | Check Heavy Waste → Click Next | Step 3 loads with 12-yard and 14-yard disabled | High |
| TC-05 | Plasterboard selection shows options | Selecting Plasterboard reveals 3 handling options | Step 2 is loaded | Check Plasterboard | 3 radio options appear: Separate collection, Mixed with other waste, Dedicated plasterboard skip | High |
| TC-06 | Plasterboard separate collection | Select Plasterboard with separate collection option | Step 2 is loaded | Check Plasterboard → Select Separate collection → Click Next | Step 3 loads, plasterboard option saved | High |
| TC-07 | Plasterboard mixed waste | Select Plasterboard with mixed waste option | Step 2 is loaded | Check Plasterboard → Select Mixed with other waste → Click Next | Step 3 loads, plasterboard option saved | High |
| TC-08 | Plasterboard dedicated skip | Select Plasterboard with dedicated skip option | Step 2 is loaded | Check Plasterboard → Select Dedicated plasterboard skip → Click Next | Step 3 loads, plasterboard option saved | High |
| TC-09 | Skip selection general waste | All 8 skips enabled for general waste | Step 3 loaded with general waste | View skip options | All 8 skips are clickable and enabled, no disabled labels | High |
| TC-10 | Skip selection heavy waste disabled | 12-yard and 14-yard disabled for heavy waste | Step 3 loaded with heavy waste | View skip options | 12-yard and 14-yard show "Not available" label and are not clickable | High |
| TC-11 | Select skip and proceed | Select a skip size and proceed to review | Step 3 is loaded | Click 4-yard → Click Next | Step 4 loads with booking summary | High |
| TC-12 | Review summary accuracy | Review step shows correct booking details | Step 4 loaded after completing all steps | View review summary | Postcode, address, waste type, skip size all match selections made in previous steps | High |
| TC-13 | Price breakdown 4-yard | Price breakdown shows correct VAT for 4-yard | Step 4 loaded with 4-yard skip | View price breakdown | Base: £120.00 → VAT: £24.00 → Total: £144.00 | High |
| TC-14 | Price breakdown 6-yard | Price breakdown shows correct VAT for 6-yard | Step 4 loaded with 6-yard skip | View price breakdown | Base: £150.00 → VAT: £30.00 → Total: £180.00 | High |
| TC-15 | Price breakdown 8-yard | Price breakdown shows correct VAT for 8-yard | Step 4 loaded with 8-yard skip | View price breakdown | Base: £180.00 → VAT: £36.00 → Total: £216.00 | Medium |
| TC-16 | Price breakdown 20-yard | Price breakdown shows correct VAT for largest skip | Step 4 loaded with 20-yard skip | View price breakdown | Base: £450.00 → VAT: £90.00 → Total: £540.00 | Medium |
| TC-17 | Confirm booking | Confirm booking and receive booking ID | Step 4 is loaded | Click Confirm Booking | Booking confirmation screen with BK-XXXXX reference | High |
| TC-18 | Booking ID format | Booking ID follows expected format | Booking confirmed | View booking ID | ID starts with BK- followed by exactly 5 digits | Medium |
| TC-19 | Manual address entry | Enter address manually when not in dropdown | Step 1 loaded, SW1A 1AA looked up | Click "Can't find your address?" → Type custom address → Click Next | Step 2 loads with manual address saved in review | High |
| TC-20 | Heavy and Plasterboard combination | Select both Heavy Waste and Plasterboard | Step 2 is loaded | Check Heavy Waste → Check Plasterboard → Select Separate collection → Click Next | Step 3 loads with 2 disabled skips, both waste types saved | High |

---

## Negative Tests

| # | Test Case | Description | Precondition | Flow | Expected Result | Priority |
|---|-----------|-------------|--------------|------|-----------------|----------|
| NT-01 | Invalid postcode format | Enter postcode that does not match UK format | App is loaded | Type `INVALID` → Click Find | Error message: "Please enter a valid UK postcode" | High |
| NT-02 | Empty postcode | Click Find without entering postcode | App is loaded | Click Find with empty field | Error message appears, no API call made | High |
| NT-03 | Zero addresses postcode | Enter postcode with no addresses | App is loaded | Enter `EC1A 1BB` → Click Find | Empty state: "No addresses found for this postcode" | High |
| NT-04 | Proceed without address selection | Click Next without selecting address | SW1A 1AA looked up, dropdown visible | Click Next without selecting from dropdown | Next button is disabled, user cannot proceed | High |
| NT-05 | Proceed without waste type | Click Next without selecting any waste type | Step 2 is loaded | Click Next without any checkbox selected | Error: "Please select at least one waste type" | High |
| NT-06 | Plasterboard without handling option | Select Plasterboard but skip radio selection | Step 2 is loaded | Check Plasterboard → Click Next without radio selection | Error: "Please select a plasterboard handling option" | High |
| NT-07 | Proceed without skip selection | Click Next without selecting skip | Step 3 is loaded | Click Next without clicking any skip card | Next button is disabled, user cannot proceed | High |
| NT-08 | Select disabled skip | Attempt to select a disabled skip | Step 3 loaded with heavy waste | Click on 12-yard skip | Nothing happens, skip remains unselected, Next stays disabled | High |
| NT-09 | Duplicate booking | Attempt to book same combination twice | First booking confirmed | Restart flow with same postcode, address and skip | Error: "Duplicate booking" returned by API | High |
| NT-10 | Double submit prevention | Confirm button disappears after submission | Step 4 is loaded | Click Confirm Booking → Wait for confirmation | Confirm button is not present on confirmation screen | High |
| NT-11 | American zip code | Enter US zip code format | App is loaded | Type `10001` → Click Find | Error: "Please enter a valid UK postcode" | Medium |
| NT-12 | Special characters in postcode | Enter postcode with special characters | App is loaded | Type `SW1A@1AA` → Click Find | Error: "Please enter a valid UK postcode" | Medium |

---

## Edge Cases

| # | Test Case | Description | Precondition | Flow | Expected Result | Priority |
|---|-----------|-------------|--------------|------|-----------------|----------|
| EC-01 | Postcode with extra spaces | Enter postcode with multiple spaces | App is loaded | Type `SW1A  1AA` (double space) → Click Find | Addresses load correctly, spaces normalised before API call | High |
| EC-02 | Lowercase postcode | Enter postcode in lowercase | App is loaded | Type `sw1a 1aa` → Click Find | Input auto-uppercases as user types, addresses load correctly | Medium |
| EC-03 | Uncheck plasterboard resets option | Uncheck Plasterboard after selecting handling option | Step 2 with Plasterboard checked and option selected | Uncheck Plasterboard checkbox | Plasterboard options disappear, selected option is reset | High |
| EC-04 | Back from Step 3 changes waste type effect | Go back to Step 2, change from general to heavy, proceed | Step 3 loaded with general waste, skip selected | Click Back → Uncheck General → Check Heavy → Click Next | Step 3 reloads, 12-yard and 14-yard now disabled | High |
| EC-05 | Find button disabled during loading | Find button cannot be clicked during API call | App is loaded, M1 1AE entered | Click Find → Immediately try to click Find again | Find button is disabled during loading, only one API call made | High |
| EC-06 | Select last skip in list | Select the last available skip (20-yard) | Step 3 loaded with general waste | Click 20-yard skip → Click Next | Review shows 20-yard at £450 + VAT correctly | Medium |
| EC-07 | Manual address with no text | Click Next with empty manual address field | Step 1, manual entry mode open | Click "Can't find your address?" → Leave field empty → Click Next | Next button is disabled, cannot proceed | High |
| EC-08 | Back to Step 1 after manual entry | Go back from Step 2 after using manual entry | Step 2 loaded after manual entry | Click Back | Step 1 loads, postcode still visible in input | Medium |

---

## API Failure Tests

| # | Test Case | Description | Precondition | Flow | Expected Result | Priority |
|---|-----------|-------------|--------------|------|-----------------|----------|
| AF-01 | Postcode lookup 500 error — first call | BS1 4DJ returns 500 on first call per the fixture | App is loaded, server freshly started | Enter `BS1 4DJ` → Click Find | Error message visible with Retry button | High |
| AF-02 | Retry after 500 error succeeds | Second call to BS1 4DJ returns 200 per the fixture | AF-01 completed, error message visible | Click Retry | Addresses load successfully (1 Broad Quay, 2 Broad Quay) | High |
| AF-03 | Skips API failure shows retry | GET /api/skips returns error — simulate via DevTools Network block | Step 2 completed, Step 3 loading | In DevTools → Network → Block `api/skips` → Complete Step 2 | Error message with Retry button visible in Step 3 | High |
| AF-04 | Booking confirm API failure shows retry | POST /api/booking/confirm returns error — simulate via DevTools Network block | Step 4 loaded → Block `api/booking/confirm` in DevTools | Click Confirm Booking | Error message shown, Confirm button remains active for retry attempt | High |
| AF-05 | Simulated latency shows loading state | M1 1AE simulates 3 second delay per the fixture | App is loaded | Enter `M1 1AE` → Click Find | Loading state visible for ~3 seconds → addresses appear → Find button re-enables | Medium |

---

## State Transition Tests

| # | Test Case | Description | Precondition | Flow | Expected Result | Priority |
|---|-----------|-------------|--------------|------|-----------------|----------|
| ST-01 | Back from Step 2 to Step 1 | Navigate back from waste type to postcode | Step 2 is loaded | Click Back | Step 1 loads, postcode input visible, progress bar shows Step 1 active | High |
| ST-02 | Back from Step 3 to Step 2 | Navigate back from skip select to waste type | Step 3 is loaded | Click Back | Step 2 loads, previously selected waste type still checked | High |
| ST-03 | Back from Step 4 to Step 3 | Navigate back from review to skip select | Step 4 is loaded | Click Back | Step 3 loads, previously selected skip still highlighted | High |
| ST-04 | Progress bar reflects current step | Progress bar updates correctly at each step | App is loaded | Complete each step in sequence | Steps 1→2→3→4 each show correct active and completed states | High |
| ST-05 | Completed steps show checkmark | Previous steps show checkmark in progress bar | Step 3 is loaded | View progress bar | Steps 1 and 2 show ✓, Step 3 circle is active with dark border | Medium |
| ST-06 | Confirmation state is final | After booking confirmed no navigation back | Booking confirmed | View confirmation screen | Back button is not present, only booking ID and reference shown | High |

