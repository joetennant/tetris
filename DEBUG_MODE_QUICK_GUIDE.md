# Debug Mode - Quick Reference

## How to Use

### 1. Enable Debug Mode
Press **`D`** during gameplay

### 2. You'll See
```
┌─────────────────────┐
│ 🐛 DEBUG MODE       │
├─────────────────────┤
│ Fall Speed: 1000 ms │
│ Level:      1       │
│ Lock Delay: 500 ms  │
│ Lock Resets: 0 / 15 │
├─────────────────────┤
│ [D] Toggle Debug    │
│ [+] Level Up        │
│ [-] Level Down      │
└─────────────────────┘
```

### 3. Test Speed Differences
- Press **`+`** to increase level → Watch fall speed decrease
- Press **`-`** to decrease level → Watch fall speed increase

## Quick Speed Test

1. Press `D` to show debug panel
2. Note speed at Level 1: **1000 ms** (1 second per drop)
3. Press `+` nine times to reach Level 10
4. Note speed at Level 10: **387 ms** (0.387 seconds per drop)
5. **Result**: Pieces fall **2.6× faster** at level 10!

## Expected Speeds

| Level | Speed (ms) | Drops/Second |
|-------|-----------|--------------|
| 1  | 1000 | 1.0 |
| 2  | 900  | 1.1 |
| 3  | 810  | 1.2 |
| 5  | 656  | 1.5 |
| 10 | 387  | 2.6 |
| 15 | 206  | 4.9 |
| 20 | 122  | 8.2 |

## Keyboard Controls

| Key | Action |
|-----|--------|
| `D` | Toggle debug panel on/off |
| `+` or `=` | Increase level (debug mode only) |
| `-` or `_` | Decrease level (debug mode only) |

## Why Use Debug Mode?

- ✅ Verify speed is actually changing
- ✅ Test high-level gameplay instantly
- ✅ Understand the 10% per level formula
- ✅ See exact timing values
- ✅ Confirm the game is working correctly

## Tips

- The panel stays visible in the top-right corner
- You can adjust level during gameplay
- Press `D` again to hide the panel
- Speed changes take effect immediately
- Level caps at 1 (minimum) and 99 (maximum)

---

**Try it now**: Start the game, press `D`, then press `+` repeatedly and watch the fall speed decrease!
