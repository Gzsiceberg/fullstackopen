# Agent Development Guide - Bloglist Frontend

This guide provides essential information for AI coding agents working in this React + Vite codebase.

## Project Overview

- **Framework**: React 19.1.0 + Vite 6.3.5
- **Language**: JavaScript (ES2020+) with JSX
- **Module System**: ES Modules (`type: "module"`)
- **Backend Proxy**: API requests to `/api` are proxied to `http://localhost:3003`

## Build, Lint & Test Commands

### Development
```bash
npm run dev              # Start dev server with HMR (default: http://localhost:5173)
```

### Build & Preview
```bash
npm run build            # Build for production (output: ./dist)
npm run preview          # Preview production build locally
```

### Linting
```bash
npm run lint             # Run ESLint on all files
npm run lint -- --fix    # Auto-fix linting issues
```

### Testing
**Note**: No test framework is currently configured in this project. If tests are added:
- Recommended: Vitest (for Vite compatibility)
- Single test: `npm test -- path/to/test.spec.js` (after setup)

## Project Structure

```
bloglist-frontend/
├── src/
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Application entry point
│   ├── components/          # React components
│   │   └── Blog.jsx         # Blog display component
│   └── services/            # API service modules
│       └── blogs.js         # Blog API service
├── public/                  # Static assets
├── index.html               # HTML entry point
├── vite.config.js           # Vite configuration
└── eslint.config.js         # ESLint configuration
```

## Code Style Guidelines

### Import Order & Style
1. React imports first
2. Third-party libraries
3. Local components
4. Service modules

```javascript
import { useState, useEffect } from 'react'
import axios from 'axios'
import Blog from './components/Blog'
import blogService from './services/blogs'
```

### Formatting
- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Not required (project uses optional semicolons)
- **Line endings**: LF (Unix-style)
- **Trailing spaces**: Remove them

### Component Style
- **File naming**: PascalCase for components (e.g., `Blog.jsx`, `App.jsx`)
- **Function components**: Prefer arrow functions with `const`
- **Export**: Use `export default` for components

```javascript
const MyComponent = ({ prop1, prop2 }) => {
  // Component logic
  return (
    <div>
      {/* JSX */}
    </div>
  )
}

export default MyComponent
```

### Service Modules
- **File naming**: camelCase (e.g., `blogs.js`, `users.js`)
- **Base URL**: Use relative paths (`/api/...`) for backend requests
- **Export**: Export object with methods

```javascript
import axios from 'axios'
const baseUrl = '/api/resource'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

export default { getAll, create }
```

### Naming Conventions
- **Components**: PascalCase (e.g., `BlogList`, `LoginForm`)
- **Variables/Functions**: camelCase (e.g., `blogService`, `getAll`)
- **Constants**: UPPER_SNAKE_CASE for true constants (e.g., `API_BASE_URL`)
- **Unused variables**: Prefix with `_` or use pattern `^[A-Z_]` (ignored by ESLint)

### State Management
- Use React hooks (`useState`, `useEffect`, etc.)
- Keep state as local as possible
- Lift state up only when necessary

```javascript
const [items, setItems] = useState([])

useEffect(() => {
  service.getAll().then(data => setItems(data))
}, [])
```

### Error Handling
- Handle promise rejections with `.catch()` or try-catch
- Provide user feedback for errors
- Log errors to console for debugging

```javascript
service.create(newItem)
  .then(returnedItem => {
    setItems(items.concat(returnedItem))
  })
  .catch(error => {
    console.error('Error creating item:', error)
    // Show error message to user
  })
```

### ESLint Rules
- **no-unused-vars**: Error (except variables matching `^[A-Z_]`)
- **react-hooks/rules-of-hooks**: Error
- **react-hooks/exhaustive-deps**: Warning
- **react-refresh/only-export-components**: Warning

## Best Practices

### React Hooks
- Follow Rules of Hooks (only call at top level, only in React functions)
- Include all dependencies in `useEffect` dependency arrays
- Use cleanup functions in `useEffect` when needed

### Performance
- Avoid unnecessary re-renders
- Use `key` prop correctly in lists (use unique IDs, not indices)
- Keep components small and focused

### Accessibility
- Use semantic HTML elements
- Include proper ARIA labels when needed
- Ensure keyboard navigation works

### API Integration
- Centralize API calls in service modules
- Return promises from service functions
- Transform API responses if needed before returning

## Common Patterns

### Fetching Data
```javascript
useEffect(() => {
  blogService.getAll().then(blogs =>
    setBlogs(blogs)
  )
}, [])
```

### Conditional Rendering
```javascript
return (
  <div>
    {user && <p>Welcome, {user.name}</p>}
    {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
  </div>
)
```

## Git Workflow
- Keep commits atomic and focused
- Write clear commit messages
- Don't commit `node_modules/` or `dist/`

## Notes for Agents
- This is a Full Stack Open course project (Part 5)
- The backend runs separately on port 3003
- No TypeScript - use JavaScript with PropTypes if type checking is needed
- No CSS framework configured - use vanilla CSS or inline styles
