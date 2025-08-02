# Execution Flow Diagram

## Complete Score Update Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant AG as API Gateway
    participant AS as Auth Service
    participant SS as Score Service
    participant ACS as Anti-Cheat Service
    participant DB as MongoDB
    participant R as Redis Cache
    participant WS as WebSocket Server
    participant SUB as Subscribers

    Note over C,SUB: Score Update Flow with Security Validation

    C->>AG: POST /api/v1/scores/update
    Note right of C: JWT + Session Token<br/>+ HMAC Signature<br/>+ Action Data

    AG->>AS: Validate JWT & Session
    AS->>R: Check session validity
    R-->>AS: Session valid
    AS-->>AG: Authentication successful

    AG->>SS: Process score update
    
    SS->>ACS: Validate action integrity
    Note right of ACS: Check HMAC signature<br/>Validate action type<br/>Check time bounds
    
    ACS->>DB: Get user history
    DB-->>ACS: Recent actions & risk score
    
    ACS->>ACS: Anomaly detection
    Note right of ACS: Score velocity check<br/>Pattern analysis<br/>Device fingerprint
    
    alt Anomaly detected
        ACS-->>SS: Validation failed
        SS-->>AG: Reject update
        AG-->>C: Error: Suspicious activity
    else Validation passed
        ACS-->>SS: Validation successful
        
        SS->>SS: Calculate server-side score
        Note right of SS: Base score + multipliers<br/>Time bonus + accuracy
        
        SS->>DB: Update user score
        SS->>DB: Log score entry
        
        par Update leaderboard cache
            SS->>R: Update live leaderboard
            R->>R: ZADD leaderboard:live
        and Get rank changes
            SS->>R: Get new rank
            R-->>SS: Rank position
        end
        
        SS-->>AG: Score updated successfully
        AG-->>C: Success response
        
        Note over SS,SUB: Broadcast to subscribers
        
        SS->>WS: Trigger leaderboard update
        WS->>R: Get top 10 players
        R-->>WS: Current leaderboard
        
        WS->>SUB: Broadcast leaderboard_update
        Note right of SUB: Real-time UI updates<br/>for all connected clients
    end
```

## Anti-Cheat Validation Flow

```mermaid
flowchart TD
    A[Score Update Request] --> B{JWT Valid?}
    B -->|No| C[Reject: Unauthorized]
    B -->|Yes| D{Session Active?}
    D -->|No| E[Reject: Invalid Session]
    D -->|Yes| F{HMAC Signature Valid?}
    F -->|No| G[Reject: Tampered Request]
    F -->|Yes| H{Rate Limit OK?}
    H -->|No| I[Reject: Too Many Requests]
    H -->|Yes| J[Check User Risk Score]
    
    J --> K{Risk Score < Threshold?}
    K -->|No| L[Enhanced Validation]
    K -->|Yes| M[Standard Validation]
    
    L --> N{Manual Review Required?}
    N -->|Yes| O[Queue for Review]
    N -->|No| M
    
    M --> P[Validate Action Type]
    P --> Q{Valid Action?}
    Q -->|No| R[Reject: Invalid Action]
    Q -->|Yes| S[Calculate Expected Score]
    
    S --> T{Score Within Bounds?}
    T -->|No| U[Flag Anomaly]
    T -->|Yes| V[Check Action Sequence]
    
    V --> W{Valid Sequence?}
    W -->|No| X[Flag Anomaly]
    W -->|Yes| Y[Validate Timing]
    
    Y --> Z{Realistic Timing?}
    Z -->|No| AA[Flag Anomaly]
    Z -->|Yes| BB[Update Score]
    
    U --> CC[Increase Risk Score]
    X --> CC
    AA --> CC
    CC --> DD[Log Suspicious Activity]
    DD --> EE{Risk Score Critical?}
    EE -->|Yes| FF[Temporary Ban]
    EE -->|No| BB
    
    BB --> GG[Update Database]
    GG --> HH[Update Cache]
    HH --> II[Broadcast Update]
```

## Real-time Broadcasting Architecture

```mermaid
graph TB
    subgraph "Score Update Triggers"
        A[User Action Completion]
        B[Score Validation Success]
        C[Leaderboard Position Change]
    end
    
    subgraph "Broadcasting Layer"
        D[WebSocket Server]
        E[Redis Pub/Sub]
        F[Event Queue]
    end
    
    subgraph "Client Connections"
        G[Web Clients]
        H[Mobile Apps]
        I[Desktop Apps]
    end
    
    subgraph "Update Types"
        J[Immediate Updates]
        K[Batched Updates]
        L[Throttled Updates]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    
    F --> J
    F --> K
    F --> L
    
    J --> G
    J --> H
    J --> I
    
    K --> G
    K --> H
    K --> I
    
    L --> G
    L --> H
    L --> I
    
    style A fill:#e1f5fe
    style B fill:#e8f5e8
    style C fill:#fff3e0
    style D fill:#fce4ec
    style E fill:#f3e5f5
    style F fill:#e0f2f1
```

## Database and Caching Architecture

```mermaid
graph LR
    subgraph "Application Layer"
        A[Score Service]
        B[Leaderboard Service]
        C[Anti-Cheat Service]
    end
    
    subgraph "Caching Layer"
        D[Redis Cluster]
        E[Leaderboard Cache]
        F[Session Cache]
        G[Rate Limit Cache]
    end
    
    subgraph "Database Layer"
        H[MongoDB Primary]
        I[MongoDB Replica 1]
        J[MongoDB Replica 2]
        K[Analytics DB]
    end
    
    A --> D
    B --> E
    C --> F
    A --> G
    
    D --> H
    E --> H
    F --> H
    G --> H
    
    H --> I
    H --> J
    H --> K
    
    style A fill:#e3f2fd
    style B fill:#e8f5e8
    style C fill:#fff8e1
    style D fill:#fce4ec
    style E fill:#f3e5f5
    style F fill:#e0f2f1
    style G fill:#e1f5fe
    style H fill:#ffebee
    style I fill:#f1f8e9
    style J fill:#f1f8e9
    style K fill:#e8eaf6
```

## Security Layers Visualization

```mermaid
graph TD
    A[Client Request] --> B[Layer 1: API Gateway]
    B --> C[Rate Limiting & DDoS Protection]
    C --> D[Layer 2: Authentication]
    D --> E[JWT Validation]
    E --> F[Session Verification]
    F --> G[Layer 3: Request Integrity]
    G --> H[HMAC Signature Check]
    H --> I[Payload Validation]
    I --> J[Layer 4: Business Logic]
    J --> K[Action Type Validation]
    K --> L[Score Calculation Verification]
    L --> M[Layer 5: Behavioral Analysis]
    M --> N[Anomaly Detection]
    N --> O[Risk Score Assessment]
    O --> P[Pattern Recognition]
    P --> Q[Layer 6: Data Persistence]
    Q --> R[Audit Logging]
    R --> S[Score Update]
    S --> T[Real-time Broadcasting]
    
    style B fill:#ffcdd2
    style D fill:#f8bbd9
    style G fill:#e1bee7
    style J fill:#c5cae9
    style M fill:#bbdefb
    style Q fill:#b2dfdb
```

This comprehensive flow diagram illustrates:

1. **Complete request lifecycle** from client to database and real-time updates
2. **Multi-layered security validation** with specific anti-cheat measures
3. **Real-time broadcasting architecture** for live leaderboard updates
4. **Database and caching strategy** for optimal performance
5. **Security layers** showing the defense-in-depth approach

Each diagram shows the critical decision points, validation steps, and data flow that the engineering team needs to implement for a robust, secure, and performant real-time scoreboard system.
