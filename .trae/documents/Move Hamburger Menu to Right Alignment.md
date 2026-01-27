# Fix Top-Right Hamburger Menu Alignment and Visibility

I will fix the issues with the top-right hamburger menu where it is misaligned and the submenus are not visible.

## Changes to `src/Account/components/AccountContextMenu.tsx`

1.  **Fix Text Visibility**:
    *   Add `text-gray-900` to the menu container's `className`. Currently, the menu inherits `text-white` from the header, making the text invisible against the white background.

2.  **Fix Alignment**:
    *   Update the positioning logic for desktop screens (when `!isSmallScreen`).
    *   Change `position` from `absolute` to `fixed`.
    *   Set `left` to `anchorEl.getBoundingClientRect().right` (instead of `left`).
    *   Add `transform: "translateX(-100%)"`.
    *   This ensures the menu's right edge aligns with the button's right edge, keeping it on-screen.

3.  **Improve Loading & Error Handling**:
    *   Import `InlineLoader` from `~Generic/components/InlineLoader` and `HideOnError` from `~Generic/components/ErrorBoundaries`.
    *   Change `React.Suspense` fallback from `null` to `<InlineLoader />` to show a spinner while data loads.
    *   Wrap `React.Suspense` in `<HideOnError>` to prevent the menu from breaking if account data fetching fails.

## Verification
*   The menu should appear to the left of the button (right-aligned).
*   The menu items (Trade, Deposit, etc.) should be visible (dark text on white).
*   A loading spinner should appear if data is fetching.
