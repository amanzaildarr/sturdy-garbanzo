# Implementation Guide

## Quick Start for Development Team

This guide provides practical implementation steps for the real-time scoreboard system specified in the main README.

## Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB 6.0+
- Redis 7.0+
- TypeScript knowledge
- Basic understanding of WebSockets and JWT

## Project Setup

### 1. Initialize Project Structure

```bash
npm init -y
npm install express mongoose redis socket.io jsonwebtoken helmet cors
npm install -D typescript @types/node @types/express ts-node nodemon
```

### 2. Core Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "redis": "^4.6.0",
    "socket.io": "^4.7.0",
    "jsonwebtoken": "^9.0.0",
    "helmet": "^7.0.0",
    "cors": "^2.8.5",
    "express-validator": "^7.0.0",
    "express-rate-limit": "^6.8.0",
    "winston": "^3.10.0",
    "crypto": "^1.0.1"
  }
}
```

## Critical Implementation Points

### 1. Anti-Cheat Priority Items

**MUST IMPLEMENT FIRST:**
- Server-side score calculation (never trust client)
- HMAC request signing for action integrity
- Rate limiting per user and per IP
- Anomaly detection for impossible scores

### 2. Database Indexes (Critical for Performance)

Create these MongoDB indexes immediately:
- `{ "totalScore": -1, "updatedAt": -1 }` on users collection
- `{ "userId": 1 }` (unique) on users collection  
- `{ "userId": 1, "timestamp": -1 }` on scoreHistory collection
- `{ "timestamp": -1 }` on scoreHistory collection

### 3. Redis Key Patterns

Use standardized key patterns:
- `scoreboard:live` - Live leaderboard
- `user:{userId}:score` - User score cache
- `rate:{userId}:score` - Rate limiting
- `session:{sessionId}` - Session validation
- `risk:{userId}` - Risk scores

## Security Implementation Checklist

### ✅ Authentication Layer
- [ ] JWT token validation middleware
- [ ] Session token verification
- [ ] Token refresh mechanism
- [ ] Secure token storage

### ✅ Request Integrity
- [ ] HMAC signature validation
- [ ] Nonce/timestamp validation to prevent replay attacks
- [ ] Request payload size limits
- [ ] Content-type validation

### ✅ Rate Limiting
- [ ] Per-user score update limits (5 updates/minute)
- [ ] Per-IP global limits (100 requests/minute)
- [ ] Sliding window implementation
- [ ] Progressive penalties for violations

### ✅ Anti-Cheat Detection
- [ ] Score velocity analysis
- [ ] Action sequence validation
- [ ] Time-bound checks for actions
- [ ] Device fingerprinting
- [ ] Pattern recognition for bot behavior

## Performance Optimization Checklist

### ✅ Caching Strategy
- [ ] Redis leaderboard with 30s TTL
- [ ] User score caching
- [ ] Database query result caching
- [ ] WebSocket connection pooling

### ✅ Database Optimization
- [ ] Proper indexing strategy
- [ ] Query optimization
- [ ] Connection pooling
- [ ] Read replica for leaderboard queries

### ✅ Real-time Optimization
- [ ] Message batching for non-critical updates
- [ ] Connection management
- [ ] Room-based broadcasting
- [ ] Compression for large payloads

## Monitoring & Alerting Setup

### Key Metrics to Track

**Performance**: Response time, requests/second, error rate
**Security**: Anomaly detection rate, blocked requests, risk scores  
**Business**: Active users, score updates/minute, leaderboard changes

### Alert Thresholds

- High error rate: >5% for 5 minutes
- Anomaly spike: >10% for 2 minutes
- Slow response: >500ms for 3 minutes
- Database lag: >1000ms for 1 minute

## Testing Strategy

### 1. Unit Tests
- Score calculation algorithms
- Anti-cheat detection logic
- HMAC signature validation
- Rate limiting functionality

### 2. Integration Tests
- API endpoint functionality
- Database operations
- Redis caching
- WebSocket connections

### 3. Load Testing
- Concurrent score updates
- WebSocket connection limits
- Database performance under load
- Redis performance benchmarks

### 4. Security Testing
- Penetration testing for common vulnerabilities
- Rate limiting effectiveness
- Anti-cheat bypass attempts
- JWT token security

## Deployment Considerations

### Environment Variables
Set up: Database URIs, JWT/HMAC secrets, performance limits, monitoring settings

### Docker
Use Node.js Alpine image, multi-stage builds, proper port exposure

## Common Pitfalls to Avoid

### 1. Security Pitfalls
❌ **Never trust client-side scores**
❌ **Don't skip rate limiting**
❌ **Avoid weak HMAC secrets**
❌ **Don't log sensitive data**

### 2. Performance Pitfalls
❌ **Don't query database for every leaderboard request**
❌ **Avoid N+1 query problems**
❌ **Don't broadcast every minor change**
❌ **Avoid synchronous operations in request handlers**

### 3. Architecture Pitfalls
❌ **Don't couple WebSocket with HTTP endpoints**
❌ **Avoid tight coupling between services**
❌ **Don't ignore proper error handling**
❌ **Avoid single points of failure**

## Implementation Timeline Breakdown

### Week 1: Foundation
- [ ] Project setup and basic structure
- [ ] Database models and connections
- [ ] Basic API endpoints without security
- [ ] Unit tests for core logic

### Week 2: Security Implementation
- [ ] JWT authentication system
- [ ] HMAC signature validation
- [ ] Rate limiting middleware
- [ ] Basic anomaly detection

### Week 3: Real-time Features
- [ ] WebSocket server setup
- [ ] Redis integration
- [ ] Live leaderboard updates
- [ ] Connection management

### Week 4: Anti-Cheat & Optimization
- [ ] Advanced anomaly detection
- [ ] Performance optimization
- [ ] Comprehensive testing
- [ ] Monitoring setup

## Code Review Checklist

### Security Review
- [ ] All inputs validated and sanitized
- [ ] Proper authentication on all endpoints
- [ ] Rate limiting implemented correctly
- [ ] Secrets not hardcoded
- [ ] Proper error handling without information leakage

### Performance Review
- [ ] Database queries optimized
- [ ] Proper caching implemented
- [ ] No blocking operations in event loop
- [ ] Memory leaks checked
- [ ] Connection pooling configured

### Code Quality Review
- [ ] TypeScript types properly defined
- [ ] Error handling comprehensive
- [ ] Logging appropriate and structured
- [ ] Code properly documented
- [ ] Tests covering critical paths

This implementation guide should provide your engineering team with concrete steps and checkpoints to build a secure, performant real-time scoreboard system. Focus on security first, then performance, then additional features.
