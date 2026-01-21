# Agent Guide: Blogs Backend

This document provides essential information for AI coding agents working in this repository.

## Project Overview

**Type:** Node.js REST API backend
**Stack:** Express 5.x, MongoDB (Mongoose), JWT Authentication
**Course:** FullStack Open Part 4 - Blog Application Backend

---

## Build, Lint, and Test Commands

### Development
```bash
npm run dev              # Start dev server with hot-reload
npm start                # Start production server
```

### Testing
```bash
npm test                                                    # Run all tests
NODE_ENV=test node --test tests/blogapi.test.js           # Run single test file
NODE_ENV=test node --test --test-name-pattern="pattern"   # Run tests matching pattern
```

**Important:** Tests use separate database (`TEST_MONGODB_URI`). Always ensure MongoDB connection is closed in `after()` hooks.

### Linting
```bash
npx eslint .             # Lint all files
npx eslint path/to/file  # Lint specific file
```

---

## Code Style Guidelines

### Formatting (ESLint - no Prettier)
- **Indentation:** 4 spaces (not 2, not tabs)
- **Quotes:** Single quotes (`'string'`)
- **Semicolons:** None (omit all semicolons)
- **Line endings:** Unix (LF)
- **Object spacing:** `{ key: value }` (spaces inside braces)
- **Arrow spacing:** `() => {}` (spaces around `=>`)

### Module System
**CommonJS** (not ES modules):
```javascript
const express = require('express')
const router = require('express').Router()
module.exports = router
```

### Variable Declarations
- **Always use `const`** (default)
- **Use `let`** only when reassignment is necessary
- **Never use `var`**

### Equality Operators
- **Always use strict equality:** `===` and `!==`
- **Never use:** `==` or `!=`

### Async/Await
**Always use async/await** (no `.then()`/`.catch()` chains):
```javascript
router.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})
```

### Error Handling
**❌ DO NOT use try-catch blocks** in route handlers - Express 5.x handles async errors automatically.

**✅ DO use early returns** for validation:
```javascript
if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url missing' })
}
```

**Error response format:**
```javascript
{ error: 'descriptive error message' }
```

**HTTP Status codes:**
- `200` - Success (GET, PUT)
- `201` - Created (POST)
- `204` - No Content (DELETE)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (auth errors)
- `404` - Not Found

---

## Import Conventions

**Order:**
1. External dependencies
2. Internal modules (models, utils)
3. App/router initialization

**Examples:**
```javascript
// Controllers
const router = require('express').Router()
const Blog = require('../models/blogs')      // PascalCase for models
const jwt = require('jsonwebtoken')

// Tests
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
```

---

## Naming Conventions

### Files
- **Lowercase, descriptive**
- Models: `blogs.js`, `users.js` (plural)
- Controllers: `blogs.js`, `users.js`, `login.js`
- Tests: `*.test.js` (e.g., `blogapi.test.js`)

### Variables
- **Models (imports):** PascalCase - `Blog`, `User`
- **Constants:** camelCase - `config`, `logger`, `token`
- **Functions:** camelCase - `requestLogger`, `errorHandler`

### API Endpoints
- **Pattern:** `/api/resource` (plural nouns)
- Examples: `/api/blogs`, `/api/users`, `/api/login`

---

## Database Patterns (Mongoose)

### Model Definition
```javascript
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        // Delete sensitive fields (e.g., passwordHash)
    }
})

module.exports = mongoose.model('Blog', blogSchema)
```

### Common Queries
```javascript
await Blog.find({}).populate('user', { username: 1, name: 1 })
await Blog.findById(id)
await User.findOne({ username })
await instance.save()
await Blog.deleteMany({})
```

---

## Authentication Patterns

### JWT Token Flow
1. Token extracted by `tokenExtractor` middleware → stored in `request.token`
2. Route handler verifies token:
```javascript
const decodedToken = jwt.verify(request.token, process.env.SECRET)
if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
}
const user = await User.findById(decodedToken.id)
```

### Password Handling
```javascript
// Hashing
const passwordHash = await bcrypt.hash(password, 10)

// Verification
const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
```

---

## Testing Patterns

### Test Structure
```javascript
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
    await Model.deleteMany({})
    // Seed test data
})

describe('feature name', () => {
    test('descriptive behavior test', async () => {
        const response = await api
            .get('/api/endpoint')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        assert.strictEqual(response.body.length, expected)
    })
})

after(async () => {
    await mongoose.connection.close()  // ALWAYS close connection
})
```

### Assertions
- `assert.strictEqual(actual, expected)` - Exact equality
- `assert.deepStrictEqual(obj1, obj2)` - Object comparison
- `assert(condition)` - Truthy check

---

## Middleware Chain Order (app.js)

**Critical:** Middleware order matters in Express:
```javascript
app.use(express.static('dist'))        // 1. Serve frontend
app.use(express.json())                // 2. Parse JSON
app.use(middleware.requestLogger)      // 3. Log requests
app.use(middleware.tokenExtractor)     // 4. Extract JWT
app.use('/api/blogs', blogsRouter)     // 5. Route handlers
app.use(middleware.unknownEndpoint)    // 6. 404 handler
app.use(middleware.errorHandler)       // 7. Error handler (MUST BE LAST)
```

---

## Environment Configuration

**Required variables (.env):**
- `MONGODB_URI` - Production database
- `TEST_MONGODB_URI` - Test database
- `PORT` - Server port (default: 3003)
- `SECRET` - JWT signing secret

**Access via:**
```javascript
const config = require('./utils/config')
config.MONGODB_URI
config.PORT
```

---

## Common Pitfalls to Avoid

❌ **DON'T:**
- Use try-catch in route handlers (Express 5.x handles errors)
- Use `.then()`/`.catch()` chains (use async/await)
- Use `var` or unnecessary `let`
- Use double quotes or semicolons
- Use 2-space indentation
- Forget to close MongoDB connection in tests
- Use `==` instead of `===`

✅ **DO:**
- Use async/await everywhere
- Use early returns for validation
- Use `const` by default
- Follow 4-space indentation
- Write descriptive test names
- Clean database in `beforeEach` hooks
- Populate references when needed

---

## Project Structure

```
controllers/    # Route handlers (business logic)
models/         # Mongoose schemas
utils/          # Middleware, config, helpers
tests/          # Test files (*.test.js)
index.js        # Server entry point
app.js          # Express app configuration
```

---

## Quick Reference

**Create new route:**
1. Add route handler in `controllers/`
2. Register router in `app.js`
3. Add integration tests in `tests/`

**Create new model:**
1. Define schema in `models/`
2. Add `toJSON` transform
3. Export with `mongoose.model()`

**Add authentication:**
1. Extract token with `tokenExtractor` middleware
2. Verify JWT in route handler
3. Return 401 for invalid/missing tokens

---

**Last Updated:** Jan 2026
**Node Version:** 20.x
**Express Version:** 5.2.1
