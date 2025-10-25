# MTG Librarian - Project Documentation

## Overview

MTG Librarian is a Magic: The Gathering card collection management application designed to help users catalog, organize, and manage their MTG cards. The application features image scanning capabilities, user authentication, and a responsive web interface.

**Repository**: https://github.com/Bwarhness/mtgLibrarian
**Production URL**: https://mtgLibrarian.biggestblackest.dk
**Internal URL**: http://192.168.1.200:8081

## Core Features

### Current Implementation
- ✅ User Authentication (Signup/Login)
- ✅ Protected Routes
- ✅ Responsive Dashboard
- ✅ Automated Deployment
- ✅ SSL/HTTPS Support

### Planned Features
- Card scanner with image recognition
- Card database integration (Scryfall API)
- CRUD operations for card management
- Custom categories and tags
- Collection statistics
- Deck builder
- Market value tracking
- Social features (trading, sharing)

## Technology Stack

### Frontend
```
React 19
TypeScript 5.9
Vite 7.1 (build tool)
React Router v7
Tailwind CSS 4.1
```

### Backend
```
Supabase (PostgreSQL + Auth)
Supabase Auth (User management)
```

### Deployment
```
Docker (containerization)
Nginx (reverse proxy)
GitHub Actions (CI/CD)
Tailscale (VPN)
Unraid Server (host)
Nginx Proxy Manager (reverse proxy management)
```

## Project Structure

```
mtgLibrarian/
├── .github/workflows/
│   └── deploy.yml                    # GitHub Actions deployment
├── src/
│   ├── components/
│   │   └── ProtectedRoute.tsx        # Route protection
│   ├── context/
│   │   └── AuthContext.tsx           # Auth state management
│   ├── lib/
│   │   └── supabase.ts               # Supabase client
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   └── DashboardPage.tsx
│   ├── styles/
│   │   ├── auth.css
│   │   └── dashboard.css
│   ├── App.tsx
│   └── main.tsx
├── .env                              # Local env vars (git ignored)
├── .env.example                      # Env template
├── .gitignore
├── Dockerfile                        # Multi-stage Docker build
├── nginx.conf                        # Nginx configuration
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Development Setup

### Prerequisites
- Node.js 20+ (LTS recommended)
- npm 10+
- Git
- Supabase account

### Local Setup
```bash
# Clone repository
git clone https://github.com/Bwarhness/mtgLibrarian.git
cd mtgLibrarian

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
# Access at http://localhost:5173
```

### Build for Production
```bash
npm run build  # Creates optimized bundle in dist/
```

## Authentication System

### Overview
Uses Supabase Auth for user management with email/password authentication.

### Implementation
- **AuthContext**: React Context for auth state management (`src/context/AuthContext.tsx`)
- **ProtectedRoute**: Wrapper component to protect routes (`src/components/ProtectedRoute.tsx`)
- **LoginPage**: Email/password login form (`src/pages/LoginPage.tsx`)
- **SignupPage**: New user registration (`src/pages/SignupPage.tsx`)
- **DashboardPage**: Main app interface for authenticated users

### Flow
1. User lands on `/` → redirected to `/dashboard`
2. Not authenticated → redirected to `/login`
3. User signs up at `/signup` or logs in at `/login`
4. Session stored in browser (Supabase manages persistence)
5. Access to `/dashboard` granted

## Deployment Architecture

### Server Details
- **Host**: Unraid Server
- **IP**: 192.168.1.200
- **SSH User**: root
- **Container Port**: 8081
- **Public Domain**: mtgLibrarian.biggestblackest.dk

### Deployment Flow

#### GitHub Actions Workflow (`deploy.yml`)
1. **Trigger**: Push to `main` branch
2. **Build Stage**:
   - Checkout code
   - Build Docker image with Supabase secrets
   - Create tar.gz archive
3. **Transfer Stage**:
   - Connect via Tailscale VPN
   - Transfer image to server via SSH
4. **Deploy Stage**:
   - Load Docker image
   - Stop old container
   - Start new container on port 8081
   - Run health checks
5. **Verify Stage**:
   - Test container is running
   - Verify health endpoint

#### Reverse Proxy Configuration
- **Proxy Manager**: Nginx Proxy Manager (port 7818)
- **Config Location**: `/mnt/user/appdata/NginxProxyManager/nginx/proxy_host/4.conf`
- **Domain**: mtgLibrarian.biggestblackest.dk
- **Port**: 8081 (internal)
- **SSL**: Let's Encrypt wildcard certificate (npm-9)
- **HTTP2**: Disabled (http2 off)

### GitHub Secrets Required
```
TAILSCALE_AUTHKEY      Tailscale VPN authentication key
SUPABASE_URL           Supabase project URL
SUPABASE_ANON_KEY      Supabase anonymous key
SSH_HOST               192.168.1.200
SSH_USER               root
SSH_PRIVATE_KEY        SSH private key for Unraid access
```

## Environment Variables

### Development (.env)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Build-time (Docker)
```
SUPABASE_URL           Passed as --build-arg
SUPABASE_ANON_KEY      Passed as --build-arg
```

Both are converted to VITE_* prefixed variables for frontend access.

## Docker Deployment

### Build
```bash
docker buildx build \
  --platform linux/amd64 \
  --build-arg SUPABASE_URL="https://..." \
  --build-arg SUPABASE_ANON_KEY="..." \
  -t mtg-librarian:latest \
  .
```

### Run
```bash
docker run -d \
  --name mtg-librarian \
  --restart unless-stopped \
  -p 8081:80 \
  mtg-librarian:latest
```

### Multi-stage Build Details
**Stage 1: Builder (node:20-alpine)**
- Installs npm dependencies
- Runs Vite build
- Creates optimized dist/ folder

**Stage 2: Production (nginx:alpine)**
- Copies built files to nginx
- Uses custom nginx.conf for SPA routing
- Exposes port 80
- Includes health check

## Database Schema (Supabase)

### Planned Tables
```sql
-- Users (managed by Supabase Auth)
-- Automatically created with auth.users

-- Cards
CREATE TABLE cards (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name VARCHAR(255),
  set VARCHAR(100),
  type VARCHAR(100),
  color VARCHAR(50),
  quantity INT,
  image_url TEXT,
  created_at TIMESTAMP
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name VARCHAR(255),
  description TEXT
);

-- Card_Categories (junction table)
CREATE TABLE card_categories (
  card_id UUID REFERENCES cards(id),
  category_id UUID REFERENCES categories(id),
  PRIMARY KEY (card_id, category_id)
);
```

## Access URLs

| Environment | URL | Notes |
|---|---|---|
| Local Dev | http://localhost:5173 | Development server |
| Production | https://mtgLibrarian.biggestblackest.dk | Public HTTPS |
| Internal LAN | http://192.168.1.200:8081 | Direct container access |
| Admin Panel | http://192.168.1.200:7818 | Nginx Proxy Manager |

## Troubleshooting

### Development Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev

# Clear Vite cache
rm -rf .vite
```

### Build Failures
- Check Node.js version: `node --version` (need 20+)
- Verify Supabase credentials in .env
- Check npm dependencies: `npm ls`

### Deployment Issues
```bash
# SSH to server
ssh root@192.168.1.200

# Check container status
docker ps | grep mtg-librarian
docker logs mtg-librarian

# Check nginx configs
ls -la /mnt/user/appdata/NginxProxyManager/nginx/proxy_host/

# Test DNS
nslookup mtgLibrarian.biggestblackest.dk

# Check Tailscale connection
tailscale status
```

### Port Issues
- 8081: Used by mtg-librarian container
- 8080: Used by NginxProxyManager and JourneyTogether
- 7818: NginxProxyManager admin panel

## Comparison with JourneyTogether

Both apps use similar deployment architecture:

| Aspect | JourneyTogether | MTG Librarian |
|---|---|---|
| Framework | React 18 | React 19 |
| Backend | Supabase | Supabase |
| Container Port | 8080 | 8081 |
| Domain | journey.biggestblackest.dk | mtgLibrarian.biggestblackest.dk |
| Build Tool | Vite | Vite |
| Nginx Config | proxy_host/3.conf | proxy_host/4.conf |
| Deployment | GitHub Actions | GitHub Actions |

## Development Notes

### Important Files
- `src/App.tsx` - Main app routing and provider setup
- `src/context/AuthContext.tsx` - Authentication logic
- `.github/workflows/deploy.yml` - Deployment pipeline
- `Dockerfile` - Container build definition
- `nginx.conf` - Web server configuration
- `package.json` - Dependencies and npm scripts

### Key Dependencies
- `@supabase/supabase-js`: Backend client library
- `react-router-dom`: Client-side routing
- Vite: Build tool and dev server

### Build Artifacts
- `dist/` - Production build output
- `.vite/deps/` - Vite dependency cache
- `node_modules/` - npm packages (git ignored)

## Future Enhancements

### Short Term
1. Implement card database (SQLite schema)
2. Build CRUD UI for cards
3. Add image upload capability
4. Integrate with Scryfall API

### Medium Term
1. Card image scanner with OCR
2. Collection statistics dashboard
3. Advanced search and filtering
4. Card value tracking

### Long Term
1. Multiplayer features (trading)
2. Deck building tools
3. Market analysis
4. Mobile app (React Native)

## Support & Monitoring

### GitHub Actions
Monitor deployments at: https://github.com/Bwarhness/mtgLibrarian/actions

### Logs
- Application: `docker logs mtg-librarian`
- Nginx: `/mnt/user/appdata/NginxProxyManager/log/proxy-host-4_*.log`
- GitHub Actions: Check workflow run logs

### Health Checks
- Automated health check on port 80
- HTTP 200 response required within 3s
- Container restarts on failed health check

## Additional Resources

- Supabase Docs: https://supabase.com/docs
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev
- Docker Docs: https://docs.docker.com
- Nginx Docs: https://nginx.org/en/docs/
- GitHub Actions: https://docs.github.com/en/actions

## Last Updated
Created during initial project setup - October 25, 2025
