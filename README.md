# Taskey - Task Management REST API

A task management system built with Node.js, Express.js, Prisma, and TypeScript.

> **Migration Note**: This is a conversion of the original PHP/Maestro framework application to a modern Node.js/REST stack.

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install

# Set up the database
npm run prisma:migrate
npm run prisma:seed     # Seed with LOTR-themed sample data

npm run dev
```

The API will be available at <http://localhost:4000>.

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
├── server.ts              # Express server + REST routes
├── lib/
│   └── prisma.ts          # Shared Prisma client (SQLite adapter)
├── services/              # Business logic (Prisma interactions)
│   ├── TaskService.ts
│   ├── ProjectService.ts
│   └── TagService.ts
├── types/
│   └── index.ts           # TypeScript interfaces
└── validation/
    └── schemas.ts         # Zod validation schemas

prisma/
├── schema.prisma          # Prisma data model
└── seed.ts                # Database seed script

generated/
└── prisma/                # Generated Prisma client (do not edit)

prisma.config.ts           # Prisma 7 configuration
```

---

## Database Schema

### Project

| Field | Type | Notes |
| --- | --- | --- |
| id | Int | Primary key |
| title | String | Required |
| description | String | Optional |
| tasks | Task[] | Relation |

### Task

| Field | Type | Notes |
| --- | --- | --- |
| id | Int | Primary key |
| title | String | Required |
| description | String | Optional |
| priority | Int | 0–3 (low to high) |
| status | Int | 0–4 |
| progress | Int | 0–100 |
| createdAt | DateTime | Auto |
| completedAt | DateTime | Optional |
| projectId | Int | Optional FK |
| tags | Tag[] | Many-to-many |

### Tag

| Field | Type | Notes |
| --- | --- | --- |
| id | Int | Primary key |
| title | String | Required |
| tasks | Task[] | Many-to-many |

---

## API Reference

Base URL: `http://localhost:4000`

### Projects

| Method | Path | Description |
| --- | --- | --- |
| GET | `/projects` | List all projects |
| GET | `/projects/:id` | Get a project |
| POST | `/projects` | Create a project |
| PUT | `/projects/:id` | Update a project |
| DELETE | `/projects/:id` | Delete a project |

**Create / Update body:**

```json
{ "title": "My Project", "description": "Optional" }
```

### Tasks

| Method | Path | Description |
| --- | --- | --- |
| GET | `/tasks` | List tasks (filterable) |
| GET | `/tasks/:id` | Get a task |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |
| POST | `/tasks/:taskId/tags/:tagId` | Add tag to task |
| DELETE | `/tasks/:taskId/tags/:tagId` | Remove tag from task |

**Query parameters for `GET /tasks`:**

- `projectId` — filter by project
- `tagId` — filter by tag
- `priority` — filter by priority (0–3)
- `status` — filter by status (0–4)

**Create body:**

```json
{
  "title": "New Task",
  "description": "Optional",
  "priority": 2,
  "status": 0,
  "progress": 0,
  "projectId": 1
}
```

### Tags

| Method | Path | Description |
| --- | --- | --- |
| GET | `/tags` | List all tags |
| GET | `/tags/:id` | Get a tag |
| POST | `/tags` | Create a tag |
| PUT | `/tags/:id` | Update a tag |
| DELETE | `/tags/:id` | Delete a tag |

**Create / Update body:**

```json
{ "title": "My Tag" }
```

### Health

```
GET /health
```

---

## Error Responses

All errors return JSON with an `error` field:

```json
{ "error": "Task not found" }
```

| Status | Meaning |
| --- | --- |
| 400 | Validation error |
| 404 | Resource not found |
| 500 | Server / database error |

---

## Validation Rules

### Tasks

- `title` — required, min 1 character
- `priority` — required (create), integer 0–3
- `status` — required (create), integer 0–4
- `progress` — optional, integer 0–100, defaults to 0
- `description` — optional
- `projectId` — optional

### Projects & Tags

- `title` — required, min 1 character
- `description` — optional (projects only)

---

## Available Scripts

```bash
npm run dev              # Start dev server with hot reload
npm run build            # Compile TypeScript
npm start                # Run compiled build

npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Seed sample data
npm run prisma:studio    # Open Prisma Studio GUI
npm run type-check       # TypeScript check without building
```

---

## Environment Variables

```env
DATABASE_URL="file:./database.sqlite"
PORT=4000
NODE_ENV=development
```

---

## Dependencies

### Production

- **express** — web framework
- **@prisma/client** (v7) — database ORM
- **@prisma/adapter-better-sqlite3** — SQLite driver for Prisma 7
- **better-sqlite3** — SQLite native driver
- **zod** — runtime validation
- **cors** — CORS middleware

### Development

- **prisma** (v7) — CLI for migrations and codegen
- **typescript**, **ts-node-dev** — TypeScript tooling

---

## Sample Data

The seed script populates Lord of the Rings themed data:

- **3 Projects**: The Fellowship of the Ring, The Two Towers, The Return of the King
- **4 Tags**: Men, Hobbits, Elves, Dwarves
- **15 Tasks**: distributed across projects with tag associations

---

## Security Notes

- Input validated with Zod before reaching the database
- Prisma uses parameterized queries (SQL injection safe)
- CORS enabled for local development

---

## Migration from PHP

| Aspect | PHP | Node.js |
| --- | --- | --- |
| Framework | Custom Maestro MVC | Express.js |
| ORM | Repository Pattern (PDO) | Prisma |
| API | REST | REST |
| Language | PHP 8.2 | TypeScript 5.x |
| Validation | Manual | Zod |
| Database | SQLite | SQLite |

**Original Authors**: Frans Blauw, Valeria Stamenova

---

## License

MIT
