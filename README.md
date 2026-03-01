# Taskey - GraphQL Task Management API

A modern task management system built with Node.js, Express.js, Prisma, and GraphQL with TypeScript.

> **Migration Note**: This is a conversion of the original PHP/Maestro framework application to a modern Node.js/GraphQL stack.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up the database (initial migration + seed)
npm run prisma:migrate  # This will run migrations and prompt to seed
npm run prisma:seed     # Seed with sample data (LOTR themed)

# Start development server
npm run dev
```

The GraphQL API will be available at: **http://localhost:4000/graphql**

### Build for Production

```bash
# Compile TypeScript
npm run build

# Run production build
npm start
```

---

## 📊 Project Structure

```
src/
├── server.ts              # Express + Apollo GraphQL server setup
├── schema/
│   └── typeDefs.ts        # GraphQL schema definitions
├── resolvers/             # GraphQL resolvers
│   ├── Query.ts           # Query resolvers
│   ├── Mutation.ts        # Mutation resolvers
│   └── index.ts           # DateTime scalar + type definitions
├── services/              # Business logic layer (Prisma interactions)
│   ├── TaskService.ts
│   ├── ProjectService.ts
│   └── TagService.ts
├── types/
│   └── index.ts           # TypeScript type definitions
├── validation/
│   └── schemas.ts         # Zod validation schemas
└── utils/
    └── errors.ts          # Error handling utilities

prisma/
├── schema.prisma          # Prisma data model
└── seed.ts               # Database seed script

database.sqlite           # SQLite database (auto-created)
```

---

## 🗄️ Database Schema

### Projects
```graphql
type Project {
  id: Int!
  title: String!
  description: String
  tasks: [Task!]!
}
```

### Tasks
```graphql
type Task {
  id: Int!
  title: String!
  description: String
  priority: Int!          # 0-3 (lowest to highest)
  status: Int!            # 0-4 (different states)
  progress: Int!          # 0-100 percentage
  createdAt: DateTime!
  completedAt: DateTime
  projectId: Int
  project: Project
  tags: [Tag!]!
}
```

### Tags
```graphql
type Tag {
  id: Int!
  title: String!
  tasks: [Task!]!
}
```

---

## 📝 API Documentation

### Queries

#### Get All Tasks
```graphql
query {
  tasks {
    id
    title
    priority
    status
    progress
    project {
      id
      title
    }
    tags {
      id
      title
    }
  }
}
```

#### Get Tasks with Filters
```graphql
query {
  tasks(priority: 2, status: 1) {
    id
    title
    priority
    status
  }
}

# Get tasks by project
query {
  tasks(projectId: 1) {
    id
    title
  }
}

# Get tasks by tag
query {
  tasks(tagId: 2) {
    id
    title
  }
}
```

#### Get Single Task
```graphql
query {
  task(id: 1) {
    id
    title
    description
    priority
    status
    progress
    createdAt
    completedAt
    project {
      id
      title
    }
    tags {
      id
      title
    }
  }
}
```

#### Get All Projects
```graphql
query {
  projects {
    id
    title
    description
    tasks {
      id
      title
      priority
      status
    }
  }
}
```

#### Get Single Project
```graphql
query {
  project(id: 1) {
    id
    title
    description
    tasks {
      id
      title
      status
      progress
    }
  }
}
```

#### Get All Tags
```graphql
query {
  tags {
    id
    title
    tasks {
      id
      title
    }
  }
}
```

---

### Mutations

#### Create Task
```graphql
mutation {
  createTask(input: {
    title: "New Task"
    description: "Task description"
    priority: 2
    status: 0
    progress: 0
    projectId: 1
  }) {
    id
    title
    priority
    status
  }
}
```

#### Update Task
```graphql
mutation {
  updateTask(id: 1, input: {
    title: "Updated Title"
    status: 2
    progress: 50
  }) {
    id
    title
    status
    progress
  }
}
```

#### Delete Task
```graphql
mutation {
  deleteTask(id: 1)
}
```

#### Create Project
```graphql
mutation {
  createProject(input: {
    title: "New Project"
    description: "Project description"
  }) {
    id
    title
  }
}
```

#### Update Project
```graphql
mutation {
  updateProject(id: 1, input: {
    title: "Updated Project"
  }) {
    id
    title
  }
}
```

#### Delete Project
```graphql
mutation {
  deleteProject(id: 1)
}
```

#### Create Tag
```graphql
mutation {
  createTag(input: {
    title: "New Tag"
  }) {
    id
    title
  }
}
```

#### Update Tag
```graphql
mutation {
  updateTag(id: 1, input: {
    title: "Updated Tag"
  }) {
    id
    title
  }
}
```

#### Delete Tag
```graphql
mutation {
  deleteTag(id: 1)
}
```

#### Add Tag to Task
```graphql
mutation {
  addTagToTask(taskId: 1, tagId: 2) {
    id
    title
    tags {
      id
      title
    }
  }
}
```

#### Remove Tag from Task
```graphql
mutation {
  removeTagFromTask(taskId: 1, tagId: 2) {
    id
    title
    tags {
      id
      title
    }
  }
}
```

---

## ✅ Validation Rules

### Tasks
- **title**: Required, minimum 1 character
- **priority**: Required, must be 0-3
- **status**: Required, must be 0-4
- **progress**: Optional, defaults to 0, must be 0-100
- **description**: Optional, string
- **projectId**: Optional, existing project ID

### Projects
- **title**: Required, minimum 1 character
- **description**: Optional, string

### Tags
- **title**: Required, minimum 1 character

---

## 🔄 Migration from PHP to Node.js

### Key Changes:

| Aspect | PHP Version | Node.js Version |
|--------|------------|-----------------|
| Framework | Custom Maestro MVC | Express.js + Apollo GraphQL |
| ORM | Repository Pattern (PDO) | Prisma ORM |
| API | REST endpoints | GraphQL |
| Templates | Twig server-side | Removed (API-only) |
| Language | PHP 8.2 | TypeScript 5.x |
| Validation | Manual validation | Zod schemas |
| Database | SQLite | SQLite (same) |

### Architecture Comparison:

**PHP MVC Layer:**
```
Controllers → Services/Repositories → Models → Database
```

**Node.js GraphQL Layer:**
```
GraphQL Resolvers → Services → Prisma Client → Database
```

---

## 🛠️ Development Tools

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build           # Compile TypeScript

# Database
npm run prisma:migrate  # Run migrations with prompts
npm run prisma:seed     # Run seed script
npm run prisma:studio   # Open Prisma Studio GUI

# Production
npm start               # Run compiled JS
npm run type-check     # Check TypeScript types without building
```

### Prisma Studio

To explore your database visually:
```bash
npm run prisma:studio
```

---

## 📦 Dependencies

### Production
- **@apollo/server** (v4.9.5): GraphQL server
- **express** (v4.18.2): Web framework
- **@prisma/client**: Database ORM
- **zod**: Runtime type validation
- **graphql**: GraphQL implementation
- **cors**: CORS middleware

### Development
- **typescript**: TypeScript compiler
- **ts-node-dev**: Hot reload TypeScript runner
- **@types/node**: Node.js type definitions

---

## 🐛 Error Handling

The API provides detailed error messages for:

### Validation Errors (Status: 400)
```json
{
  "errors": [
    {
      "message": "Title is required",
      "extensions": {
        "statusCode": 400
      }
    }
  ]
}
```

### Not Found Errors (Status: 404)
```json
{
  "errors": [
    {
      "message": "Task not found",
      "extensions": {
        "statusCode": 404
      }
    }
  ]
}
```

### Database Errors (Status: 500)
```json
{
  "errors": [
    {
      "message": "Database operation failed",
      "extensions": {
        "statusCode": 500
      }
    }
  ]
}
```

---

## 🌱 Sample Data

The seeded database includes Lord of the Rings themed data:

### Projects (3)
- The Fellowship of the Ring
- The Two Towers
- The Return of the King

### Tags (4)
- Men
- Hobbits
- Elves
- Dwarves

### Tasks (15)
- Pre-populated with sample tasks across projects
- Associated with tags via many-to-many relationships

---

## 🔐 Security Notes

- Input validation is enforced at the resolver level using Zod
- All database queries use Prisma parameterized queries (SQL injection safe)
- CORS is enabled for local development
- GraphQL introspection enabled in development, disabled in production

---

## 📝 Environment Variables

Create a `.env` file:

```env
# Database
DATABASE_URL="file:./database.sqlite"

# Server
PORT=4000
NODE_ENV=development
```

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Run Production Build
```bash
PORT=3000 NODE_ENV=production npm start
```

### Docker (Optional)
You can containerize this application with Docker for deployment to cloud platforms.

---

## 📚 References

- [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [GraphQL Documentation](https://graphql.org/)
- [Express.js Documentation](https://expressjs.com/)

---

## 📄 License

MIT

---

## ✨ Features

- ✅ Full CRUD operations for Tasks, Projects, and Tags
- ✅ GraphQL API with type safety
- ✅ Input validation using Zod
- ✅ Error handling with meaningful messages
- ✅ SQLite database with Prisma ORM
- ✅ Hot reload development environment
- ✅ TypeScript for type safety
- ✅ Many-to-many relationships (Task-Tag)
- ✅ Project organization for tasks
- ✅ Task priority and status tracking
- ✅ Progress percentage for tasks
- ✅ Sample data with seeds

---

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Original Authors**: Frans Blauw, Valeria Stamenova
**Migrated to Node.js/GraphQL**: 2026