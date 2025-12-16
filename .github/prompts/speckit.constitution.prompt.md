---
agent: speckit.constitution
---

# Project Constitution: Tetris Game

## Code Quality Principles

### 1. TypeScript First
- All new code must be written in TypeScript with strict mode enabled
- Minimize use of `any` type - prefer proper type definitions
- Use interface definitions for component props and state structures

### 2. Component Architecture
- Follow React functional component patterns with hooks
- Implement single responsibility principle - one concern per component
- Use custom hooks to extract and share stateful logic
- Keep components under 200 lines when possible

### 3. Code Organization
- Group related files in feature-based directories
- Use absolute imports with path mapping
- Implement consistent naming conventions: PascalCase for components, camelCase for functions/variables

## Testing Standards

### 4. Test Coverage Requirements
- Maintain minimum 80% code coverage for all business logic
- Unit tests for game logic functions (piece movement, line clearing, scoring)
- Integration tests for component interactions
- E2E tests for critical user flows (game start, pause, game over)

### 5. Testing Best Practices
- Use React Testing Library for component testing
- Mock external dependencies and side effects
- Write descriptive test names that explain the expected behavior
- Follow AAA pattern: Arrange, Act, Assert

## User Experience Consistency

### 6. Responsive Design
- Support mobile, tablet, and desktop screen sizes
- Maintain playable game area on all devices
- Implement touch controls for mobile devices

### 7. Accessibility Standards
- Provide keyboard navigation for all game controls
- Include ARIA labels for screen readers
- Support high contrast mode
- Ensure color-blind friendly color schemes

### 8. Game Experience
- Maintain 60fps gameplay performance
- Provide clear visual feedback for user actions
- Implement consistent animation timing and easing
- Include audio feedback with volume controls

## Performance Requirements

### 9. Runtime Performance
- Game loop must maintain stable 60fps
- Minimize re-renders using React.memo and useMemo
- Implement efficient collision detection algorithms
- Use requestAnimationFrame for smooth animations

### 10. Bundle Optimization
- Keep initial bundle size under 500KB
- Implement code splitting for non-critical features
- Optimize image assets and use modern formats (WebP)
- Remove unused dependencies and dead code

### 11. Memory Management
- Clean up intervals and timeouts in component cleanup
- Avoid memory leaks in game state management
- Implement efficient data structures for game grid
- Profile and monitor memory usage in development
