# Full-Stack AI Boilerplate

A production-ready fullstack boilerplate with Next.js, Node.js, PostgreSQL, and OpenAI integration. Perfect starter for modern web applications with AI-powered features.

## 🌟 Features

- **🚀 Next.js 16** - React framework with App Router
- **⚡ Node.js/Express** - RESTful API with Swagger documentation
- **🐘 PostgreSQL** - Robust database with Docker setup
- **🤖 OpenAI Integration** - DALL-E image generation out of the box
- **🐳 Docker** - Containerized backend and database
- **📱 Responsive UI** - Modern, mobile-first design
- **🎯 Custom Hooks** - Reusable AI integration patterns
- **🔧 Professional Setup** - Interactive initialization script

## 🏗️ Architecture

**Hybrid Setup:**

- **Frontend**: Next.js 16 (runs locally for optimal development)
- **Backend**: Node.js/Express (Docker containerized)
- **Database**: PostgreSQL (Docker containerized)
- **AI Integration**: OpenAI DALL-E for automatic thumbnail generation

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm

### 🎯 One-Command Setup

```bash
git clone <repository-url>
cd full-stack-ai-boilerplate
npm run init
```

The init script will:
- ✅ Prompt for your OpenAI API key
- ✅ Create all environment files
- ✅ Install all dependencies
- ✅ Set up the complete development environment

### Manual Setup (Alternative)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd full-stack-ai-boilerplate
   ```

2. **Initialize the project:**
   ```bash
   npm run init
   ```

3. **Start the application:**
   ```bash
   npm run start
   ```

4. **Access the application:**
    - Frontend: http://localhost:3000
    - Backend API: http://localhost:4000
    - API Docs: http://localhost:4000/api-docs

## 📋 Available Scripts

| Command                   | Description                                            |
|---------------------------|--------------------------------------------------------|
| `npm run start`           | Start everything (Docker services + frontend)          |
| `npm run dev`             | Alias for start                                        |
| `npm run stop`            | Stop Docker services                                   |
| `npm run docker:services` | Start only Docker services (backend/DB)                |
| `npm run docker:down`     | Stop Docker services                                   |
| `npm run docker:build`    | Rebuild Docker images                                  |
| `npm run docker:logs`     | View Docker service logs                               |
| `npm run frontend`        | Run frontend only (for development)                    |
| `npm run install:all`     | Install all dependencies (root, frontend, backend, db) |
| `npm run clean`           | Full cleanup (volumes, node_modules, .next)            |

## 🎯 Key Features

### 🤖 AI-Powered Thumbnails

- **Automatic Generation**: Courses without thumbnails get AI-generated images
- **OpenAI DALL-E Integration**: Professional educational thumbnails
- **Smart Detection**: Identifies missing/placeholder images
- **Database Updates**: Automatically saves generated URLs

### 📚 Course Management

- Create courses with titles and descriptions
- Auto-generated educational thumbnails
- Course deletion with cascading relationships
- Lesson count tracking

### 👥 User & Enrollment Management

- User registration and management
- Course enrollment tracking
- Completion percentage calculation
- Search and filtering capabilities

## 🏛️ Project Structure

```
full-stack-ai-boilerplate/
├── package.json                    # Root scripts & dependencies
├── docker-compose.yml             # Backend + Database services
├── README.md                       # This file
├── scripts/
│   └── init.js                     # Interactive setup script
│
├── backend/                        # Node.js API (Dockerized)
│   ├── index.js                    # Express server with Swagger docs
│   ├── Dockerfile                  # Backend container config
│   ├── .dockerignore               # Docker ignore rules
│   ├── .env                        # Environment variables (OpenAI key)
│   └── package.json                # Backend dependencies
│
├── frontend/                       # Next.js App (Local)
│   ├── src/
│   │   ├── app/                    # Next.js app directory
│   │   │   ├── components/
│   │   │   │   └── DashboardClient/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── lib/
│   │   │   ├── api/                # API client functions
│   │   │   │   ├── client.ts       # Base API client
│   │   │   │   └── courses.ts      # Course-specific endpoints
│   │   │   ├── hooks/              # Custom React hooks
│   │   │   │   └── useAutoThumbnails.ts  # AI thumbnail generation
│   │   │   └── state.tsx           # Jotai state management
│   │   ├── styles/                 # SCSS styling
│   │   └── types/                  # TypeScript types
│   ├── public/
│   │   └── placeholder-course.svg  # Local fallback image
│   ├── .env.local                  # Frontend environment
│   ├── next.config.ts              # Next.js configuration
│   └── package.json                # Frontend dependencies
│
└── db/                             # Database setup
    ├── schema.sql                  # Database schema
    ├── seed.sql                    # Initial data
    ├── docker-compose.yml          # Alternative DB-only setup
    └── package.json                # DB utilities
```

## 🔧 Configuration

### Environment Variables

#### Backend (`backend/.env`)

```env
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@db:5432/your_project_name
OPENAI_API_KEY=sk-proj-your-openai-api-key-here
```

#### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

### Docker Services

The `docker-compose.yml` runs:

- **PostgreSQL 16**: Database with auto-initialization
- **Backend API**: Node.js/Express with OpenAI integration

## 🎨 AI Thumbnail Generation

### How it Works

1. **Detection**: `useAutoThumbnails` hook scans courses on load
2. **Generation**: Calls OpenAI DALL-E with course title/description
3. **Storage**: Updates course record with generated image URL
4. **Display**: Next.js Image component renders the AI thumbnail

### Custom Hook Usage

```typescript
import {useAutoThumbnails} from '@/lib/hooks/useAutoThumbnails';

// In your component:
useAutoThumbnails({
    courses,                    // Array of courses
    onCoursesUpdate: setCourses, // Update callback
    enabled: true              // Enable/disable generation
});
```

### Generated Thumbnail Criteria

Thumbnails are auto-generated for courses with:

- No `thumbnail_url`
- Empty `thumbnail_url`
- Placeholder URLs (starting with "fake_url")

## 📊 Database Schema

### Core Tables

- **users**: User accounts and profiles
- **courses**: Course information and metadata
- **lessons**: Course content structure
- **enrollments**: User-course relationships
- **lesson_progress**: Completion tracking

### Relationships

- Courses → Lessons (1:many)
- Users → Enrollments (1:many)
- Courses → Enrollments (1:many)
- Enrollments → Lesson Progress (1:many)

## 🔌 API Endpoints

| Method | Endpoint                   | Description                        |
|--------|----------------------------|------------------------------------|
| GET    | `/api/health`              | Health check                       |
| GET    | `/api/courses`             | Get all courses with lesson counts |
| PUT    | `/api/courses`             | Create new course                  |
| PATCH  | `/api/courses/:id`         | Update course                      |
| DELETE | `/api/courses/:id`         | Delete course                      |
| POST   | `/api/generate-thumbnail`  | Generate AI thumbnail              |
| GET    | `/api/enrollments`         | Get enrollments with completion %  |
| PUT    | `/api/enrollments`         | Create enrollment                  |
| GET    | `/api/users/:id`           | Get user by ID                     |
| GET    | `/api/users/search?q=term` | Search users                       |
| PUT    | `/api/users`               | Create user                        |

Full API documentation available at: http://localhost:4000/api-docs

## 🛠️ Development

### Frontend Development

```bash
# Frontend only (assumes Docker services running)
npm run frontend

# With hot reload and TypeScript checking
cd frontend && npm run dev
```

### Backend Development

```bash
# View backend logs
npm run docker:logs

# Restart backend after changes
docker-compose restart backend
```

### Database Management

```bash
# Access PostgreSQL directly
docker exec -it fullstack-ai-db psql -U postgres -d your_project_name

# Reset database with fresh data
npm run clean
npm run start
```

## 🐛 Troubleshooting

### Common Issues

#### OpenAI Thumbnails Not Generating

1. Check API key in `backend/.env`
2. Verify backend logs: `npm run docker:logs`
3. Check browser console for generation logs

#### Frontend/Backend Connection Issues

1. Verify `NEXT_PUBLIC_API_BASE_URL` in `frontend/.env.local`
2. Ensure Docker services are running: `docker-compose ps`
3. Check backend health: `curl http://localhost:4000/api/health`

#### Database Connection Problems

1. Ensure PostgreSQL container is healthy: `docker-compose ps`
2. Check database logs: `docker-compose logs db`
3. Reset database: `npm run clean && npm start`

#### Port Conflicts

1. Check if ports 3000, 4000, or 5432 are in use
2. Stop conflicting services
3. Update port mappings in `docker-compose.yml` if needed

### Reset Everything

```bash
# Complete reset (nuclear option)
npm run clean
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install:all
npm run start
```

## 📈 Performance

### Optimizations

- **Local Frontend**: No Docker overhead for UI development
- **Image Optimization**: Next.js handles OpenAI image optimization
- **Caching**: API responses cached appropriately
- **Lazy Loading**: Images loaded on demand

### Monitoring

- Check Docker resource usage: `docker stats`
- Monitor API response times in browser dev tools
- Database query performance via PostgreSQL logs

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Secure API keys
2. **Database**: Use managed PostgreSQL service
3. **Frontend**: Deploy to Vercel/Netlify with API base URL
4. **Backend**: Container deployment to AWS/GCP/Azure
5. **Images**: CDN for generated thumbnails

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Made with ❤️ and powered by AI thumbnail generation**