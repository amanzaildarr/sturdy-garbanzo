# Express CRUD API with TypeScript and MongoDB

A robust RESTful API built with Express.js, TypeScript, and MongoDB that provides complete CRUD (Create, Read, Update, Delete) operations for user management.

## 🚀 Features

- **Full CRUD Operations**: Create, Read, Update, and Delete users
- **TypeScript**: Full TypeScript support for type safety
- **MongoDB Integration**: Data persistence using MongoDB with Mongoose ODM
- **Input Validation**: Request validation using express-validator
- **Error Handling**: Comprehensive error handling middleware
- **Filtering & Pagination**: Advanced querying capabilities
- **Security**: Helmet.js for security headers and CORS support
- **Environment Configuration**: Configurable via environment variables

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd express-crud-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file and configure your settings:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/express-crud-api
   ```

4. **Start MongoDB**:
   
   **Local MongoDB**:
   ```bash
   # macOS (with Homebrew)
   brew services start mongodb-community
   
   # Ubuntu/Debian
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```
   
   **Or use MongoDB Atlas** (cloud):
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a cluster and get connection string
   - Update `MONGODB_URI` in `.env` file

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## 📡 API Endpoints

Base URL: `http://localhost:3000/api`

### Health Check
```http
GET /health
```

### User Management

#### 1. Create User
```http
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "age": 30,
  "role": "user",
  "isActive": true
}
```

#### 2. Get All Users (with filtering and pagination)
```http
GET /api/users?page=1&limit=10&role=user&isActive=true&search=john
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `role` (optional): Filter by role (`admin`, `user`, `moderator`)
- `isActive` (optional): Filter by active status (`true`, `false`)
- `search` (optional): Search in name and email fields

#### 3. Get User by ID
```http
GET /api/users/:id
```

#### 4. Update User
```http
PUT /api/users/:id
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "age": 28,
  "role": "admin",
  "isActive": false
}
```

#### 5. Delete User
```http
DELETE /api/users/:id
```

## 📊 Data Schema

### User Model
```typescript
{
  _id: ObjectId,           // MongoDB auto-generated ID
  name: string,            // Required, 2-50 characters
  email: string,           // Required, unique, valid email format
  age: number,             // Required, 0-120
  role: string,            // Required, enum: ['admin', 'user', 'moderator']
  isActive: boolean,       // Default: true
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-generated
}
```

## 📝 Request/Response Examples

### Create User Request
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "age": 25,
    "role": "user"
  }'
```

### Success Response
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "_id": "64a7b8c9d1e2f3a4b5c6d7e8",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "age": 25,
      "role": "user",
      "isActive": true,
      "createdAt": "2023-07-07T10:30:00.000Z",
      "updatedAt": "2023-07-07T10:30:00.000Z"
    }
  }
}
```

### List Users Response
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "64a7b8c9d1e2f3a4b5c6d7e8",
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "age": 25,
        "role": "user",
        "isActive": true,
        "createdAt": "2023-07-07T10:30:00.000Z",
        "updatedAt": "2023-07-07T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Validation failed: Name is required, Please provide a valid email"
  }
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/express-crud-api` |

### MongoDB Connection Options

**Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/express-crud-api
```

**MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

## 🛡️ Security Features

- **Helmet.js**: Sets various HTTP headers for security
- **CORS**: Cross-origin resource sharing protection
- **Input Validation**: Request validation and sanitization
- **Error Handling**: Secure error responses (no stack traces in production)

## 🧪 Testing the API

You can test the API using various tools:

### Using cURL
```bash
# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","age":25}'

# Get all users
curl http://localhost:3000/api/users

# Get user by ID
curl http://localhost:3000/api/users/USER_ID

# Update user
curl -X PUT http://localhost:3000/api/users/USER_ID \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name","age":30}'

# Delete user
curl -X DELETE http://localhost:3000/api/users/USER_ID
```

### Using Postman
1. Import the API collection
2. Set base URL to `http://localhost:3000`
3. Test all endpoints with sample data

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity for Atlas

2. **Port Already in Use**:
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   ```

3. **TypeScript Compilation Errors**:
   ```bash
   # Clean build
   rm -rf dist/
   npm run build
   ```

4. **Module Not Found Errors**:
   ```bash
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📈 Performance Considerations

- **Database Indexing**: Indexes are created on email, role, and isActive fields
- **Pagination**: Implemented to handle large datasets efficiently
- **Lean Queries**: Using `.lean()` for better performance on read operations
- **Connection Pooling**: MongoDB connection pooling handled by Mongoose

## 🔄 API Rate Limiting (Recommended)

For production use, consider adding rate limiting:

```bash
npm install express-rate-limit
```

## 📚 Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **ODM**: Mongoose
- **Validation**: express-validator
- **Security**: Helmet.js, CORS
- **Development**: Nodemon, ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section
2. Review the API documentation
3. Create an issue in the repository

---

**Happy Coding! 🎉**
