# Responsive Rendering Fix - Task List

**Issue**: Game doesn't render properly at different screen sizes. Pieces overflow playfield, gaps appear between tetromino blocks.

**Root Causes**:
1. Playfield uses fixed grid template (320px × 640px)
2. Cell sizes change in media queries but grid template doesn't update
3. Tetromino blocks positioned absolutely, can overflow
4. Grid gap is set but should always be 0

---

## Phase 1: Fix Core Rendering (Desktop)

### T-FIX-001: Update Playfield CSS Grid System ✅
**Problem**: Grid template uses fixed pixel values instead of CSS variables  
**Solution**: Use CSS variables for cell size and calculate grid from it

**Changes Completed**:
- ✅ Defined `:root { --cell-size: 32px; }` CSS variable
- ✅ Updated `.playfield` to use `repeat(10, var(--cell-size))`
- ✅ Updated `.playfield` height to use `repeat(20, var(--cell-size))`
- ✅ Ensured `gap: 0` is enforced

**Files**: `src/App.css`

---

### T-FIX-002: Remove Fixed Width/Height from Playfield ✅
**Problem**: Playfield has fixed width/height that conflicts with grid sizing  
**Solution**: Let grid template define the size naturally

**Changes Completed**:
- ✅ Removed from all media queries - grid auto-sizes now
- ✅ Grid sizes itself based on `grid-template-columns/rows`

**Files**: `src/App.css`

---

### T-FIX-003: Ensure Zero Grid Gap ✅
**Problem**: Grid gap might create spacing between cells  
**Solution**: Explicitly set gap to 0

**Changes Completed**:
- ✅ Verified `gap: 0` in `.playfield`
- ✅ Ensured no margin/padding on `.cell`

**Files**: `src/App.css`

---

### T-FIX-004: Fix Cell Sizing ✅
**Problem**: Cells have fixed pixel sizes in CSS  
**Solution**: Use CSS variable for consistent sizing

**Changes Completed**:
- ✅ Updated `.cell` to use `var(--cell-size)`
- ✅ Updated `.tetromino-block` to use `var(--cell-size)`
- ✅ Removed explicit width/height declarations

**Files**: `src/App.css`

---

### T-FIX-005: Test Desktop Rendering
**Problem**: Need to verify fixes work at desktop size  
**Solution**: Manual testing

**Test Cases**:
1. Open game at desktop size (1920×1080 or similar)
2. Verify playfield is 320×640px (10×20 cells of 32px)
3. Verify no gaps between cells
4. Verify pieces stay within playfield bounds
5. Verify ghost piece aligns with grid
6. Verify locked pieces align with grid

**Expected Result**: Game renders perfectly at desktop size

---

## Phase 2: Fix Mobile Rendering (Phone Size)

### T-FIX-006: Update Mobile Media Query Variables ✅
**Problem**: Media queries change cell size but not CSS variables  
**Solution**: Update `--cell-size` variable in each breakpoint

**Changes Completed**:
- ✅ `@media (max-width: 1024px)`: Set `--cell-size: 28px`
- ✅ `@media (max-width: 768px)`: Set `--cell-size: 24px`
- ✅ `@media (max-width: 480px)`: Set `--cell-size: 20px`
- ✅ `@media (max-width: 360px)`: Set `--cell-size: 18px`
- ✅ `@media (max-height: 500px) and (orientation: landscape)`: Set `--cell-size: 20px`

**Files**: `src/App.css`

---

### T-FIX-007: Remove Fixed Sizes from Media Queries ✅
**Problem**: Media queries set explicit widths that conflict with grid  
**Solution**: Remove width/height from `.playfield` in all media queries

**Changes Completed**:
- ✅ Removed `.playfield { width: 280px; height: 560px; }` from tablet
- ✅ Removed `.playfield { width: 240px; height: 480px; }` from mobile
- ✅ Removed `.playfield { width: 200px; height: 400px; }` from small mobile
- ✅ Removed `.playfield { width: 180px; height: 360px; }` from tiny mobile
- ✅ Grid now auto-sizes based on `--cell-size`

**Files**: `src/App.css`

---

### T-FIX-008: Remove Cell Size Overrides in Media Queries ✅
**Problem**: Cell sizes are re-declared in media queries  
**Solution**: Remove redundant declarations (CSS variable handles it)

**Changes Completed**:
- ✅ Removed `.cell, .tetromino-block { width: 28px; height: 28px; }` from all media queries
- ✅ CSS variable automatically updates these elements

**Files**: `src/App.css`

---

### T-FIX-009: Test Mobile Rendering (iPhone Size)
**Problem**: Need to verify fixes work at mobile size  
**Solution**: Manual testing with browser DevTools

**Test Cases**:
1. Open DevTools, set to iPhone 12 (390×844)
2. Verify playfield scales down appropriately
3. Verify cells remain square with no gaps
4. Verify pieces stay within playfield
5. Verify all pieces visible and properly aligned

**Expected Result**: Game renders perfectly on mobile

---

### T-FIX-010: Test Very Small Screen (iPhone SE)
**Problem**: Need to verify minimum size works  
**Solution**: Test at smallest modern phone size

**Test Cases**:
1. Set DevTools to iPhone SE (375×667)
2. Verify game is still playable
3. Verify all UI elements visible
4. Verify playfield fits on screen

**Expected Result**: Game playable on small phones

---

## Phase 3: Fix Intermediate Sizes

### T-FIX-011: Add Intermediate Breakpoint (iPad)
**Problem**: Jump from desktop (32px) to tablet (28px) might be too abrupt  
**Solution**: Add smoother breakpoints

**New Breakpoints**:
- `@media (max-width: 1440px)`: `--cell-size: 30px` (intermediate laptop)
- `@media (max-width: 1200px)`: `--cell-size: 28px` (small laptop)
- Keep existing 1024px, 768px, 480px, 360px

**Files**: `src/App.css`

---

### T-FIX-012: Test All Breakpoints
**Problem**: Need to verify smooth transitions  
**Solution**: Test at multiple sizes

**Test Sizes**:
1. 1920×1080 (Desktop): 32px cells
2. 1440×900 (Laptop): 30px cells
3. 1024×768 (Tablet): 28px cells
4. 768×1024 (iPad Portrait): 24px cells
5. 390×844 (iPhone): 20px cells
6. 375×667 (Small iPhone): 18px cells

**Expected Result**: Smooth scaling at all sizes

---

### T-FIX-013: Fix Landscape Mode
**Problem**: Landscape mode might have different issues  
**Solution**: Test and fix landscape-specific rendering

**Test Cases**:
1. Rotate to landscape at various sizes
2. Verify playfield doesn't overflow
3. Verify layout switches correctly
4. Verify sidebar positioning

**Expected Result**: Landscape works perfectly

---

## Phase 4: Polish & Edge Cases

### T-FIX-014: Fix Preview Cell Sizes
**Problem**: Next piece and hold piece previews might not scale  
**Solution**: Update preview cell sizing

**Changes Needed**:
- Update `.preview-cell` to use calculated size
- Ensure preview pieces scale proportionally
- Preview cells should be slightly smaller than playfield cells

**Files**: `src/App.css`

---

### T-FIX-015: Fix Debug Panel Responsiveness
**Problem**: Debug panel might overlap game at small sizes  
**Solution**: Adjust debug panel positioning

**Changes Needed**:
- Ensure debug panel doesn't overlap playfield
- Consider moving to bottom at very small sizes
- Maintain readability

**Files**: `src/App.css`

---

### T-FIX-016: Test Browser Zoom
**Problem**: Browser zoom might break layout  
**Solution**: Test at different zoom levels

**Test Cases**:
1. Test at 50% zoom
2. Test at 75% zoom
3. Test at 100% zoom (default)
4. Test at 125% zoom
5. Test at 150% zoom

**Expected Result**: Game remains playable at all zoom levels

---

### T-FIX-017: Verify No Overflow
**Problem**: Pieces might overflow playfield bounds  
**Solution**: Add overflow protection

**Changes Needed**:
- Add `overflow: hidden` to `.playfield` if needed
- Verify pieces never render outside bounds
- Test with pieces at edges

**Files**: `src/App.css`

---

### T-FIX-018: Final Cross-Browser Test
**Problem**: Different browsers might render differently  
**Solution**: Test on multiple browsers

**Test Browsers**:
1. Chrome/Edge (Chromium)
2. Firefox
3. Safari (if available)
4. Mobile Safari (iOS)
5. Chrome Mobile (Android)

**Expected Result**: Consistent rendering across browsers

---

## Summary

**Total Tasks**: 18
- **Phase 1 (Desktop)**: 5 tasks
- **Phase 2 (Mobile)**: 5 tasks
- **Phase 3 (Intermediate)**: 3 tasks
- **Phase 4 (Polish)**: 5 tasks

**Priority**:
1. **Critical**: T-FIX-001 through T-FIX-005 (Fix core rendering)
2. **High**: T-FIX-006 through T-FIX-010 (Mobile support)
3. **Medium**: T-FIX-011 through T-FIX-013 (Intermediate sizes)
4. **Low**: T-FIX-014 through T-FIX-018 (Polish)

**Estimated Time**: 2-3 hours for all phases

---

## Technical Approach

### CSS Variables Strategy

```css
:root {
  --cell-size: 32px;
}

.playfield {
  display: grid;
  grid-template-columns: repeat(10, var(--cell-size));
  grid-template-rows: repeat(20, var(--cell-size));
  gap: 0;
}

.cell,
.tetromino-block {
  width: var(--cell-size);
  height: var(--cell-size);
}

@media (max-width: 1024px) {
  :root {
    --cell-size: 28px;
  }
}
```

This approach:
- ✅ Single source of truth for cell size
- ✅ Automatic propagation to all elements
- ✅ Minimal code duplication
- ✅ Easy to maintain
- ✅ Scales naturally at all sizes

---

## Success Criteria

**Desktop (1920×1080)**:
- [  ] Playfield is 320×640px
- [  ] No gaps between cells
- [  ] Pieces contained within bounds
- [  ] Smooth gameplay

**Mobile (390×844)**:
- [  ] Playfield scales to fit screen
- [  ] No horizontal scroll
- [  ] All UI elements visible
- [  ] Playable and responsive

**All Sizes**:
- [  ] Zero gaps between tetromino blocks
- [  ] Pieces align to grid
- [  ] No overflow
- [  ] Consistent rendering

---

**Created**: 2025-12-16  
**Priority**: Critical  
**Impact**: Game usability at all screen sizes
