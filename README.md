# MTG Librarian

A Magic: The Gathering card collection management application with image scanning capabilities. Organize your MTG cards by set, type, color, and custom categories.

## Features

- 📸 **Card Scanner** - Scan physical MTG cards to add them to your collection
- 📚 **Collection Management** - Organize and manage cards with full CRUD operations
- 🏷️ **Categorization** - Create custom categories and tags for your collection
- 🔐 **User Authentication** - Secure login and signup system
- 🌐 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **React Router v7** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Supabase** - PostgreSQL database, authentication, and real-time capabilities
- **Supabase Auth** - User authentication and session management

### Deployment
- **Docker** - Containerization with multi-stage builds
- **Nginx** - Reverse proxy and static file serving
- **GitHub Actions** - Automated CI/CD pipeline
- **Tailscale** - Secure VPN tunneling for deployment
- **Unraid Server** - Container orchestration

## Quick Start

### Local Development

1. **Clone and install**
```bash
git clone https://github.com/Bwarhness/mtgLibrarian.git
cd mtgLibrarian
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

3. **Start dev server**
```bash
npm run dev
# Open http://localhost:5173
```

4. **Build for production**
```bash
npm run build
```

## Project Structure

```
src/
├── components/ProtectedRoute.tsx    # Route protection wrapper
├── context/AuthContext.tsx           # Authentication state
├── lib/supabase.ts                   # Supabase client
├── pages/
│   ├── LoginPage.tsx                 # Login form
│   ├── SignupPage.tsx                # Signup form
│   └── DashboardPage.tsx             # Main dashboard
├── styles/                           # Component styling
└── App.tsx                           # Main app
```

## Authentication

- **Sign Up** - Create account at `/signup`
- **Login** - Access account at `/login`
- **Protected Routes** - Dashboard requires authentication
- **Session Management** - Automatic persistence via Supabase

## Deployment

### Production URL
**https://mtgLibrarian.biggestblackest.dk**

### Architecture
- **Host**: Unraid Server (192.168.1.200)
- **Container Port**: 8081
- **Reverse Proxy**: Nginx Proxy Manager
- **VPN Access**: Tailscale
- **SSL**: Let's Encrypt (wildcard certificate)

### Automated Deployment
Every push to `main` triggers:
1. Docker image build
2. Tailscale VPN connection
3. SSH deployment to Unraid
4. Health check verification

### Required GitHub Secrets
```
TAILSCALE_AUTHKEY      - VPN auth key
SUPABASE_URL           - Backend URL
SUPABASE_ANON_KEY      - Backend key
SSH_HOST               - 192.168.1.200
SSH_USER               - root
SSH_PRIVATE_KEY        - SSH private key
```

## Environment Variables

### Development (.env)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Docker

Build and run locally:
```bash
docker build \
  --build-arg SUPABASE_URL="url" \
  --build-arg SUPABASE_ANON_KEY="key" \
  -t mtg-librarian:latest .

docker run -d -p 8081:80 mtg-librarian:latest
```

## Access URLs

| Environment | URL |
|---|---|
| Local Dev | http://localhost:5173 |
| Production | https://mtgLibrarian.biggestblackest.dk |
| Internal LAN | http://192.168.1.200:8081 |

## Development Roadmap

- [ ] Card scanner integration
- [ ] Image processing and OCR
- [ ] Scryfall API integration
- [ ] Collection statistics
- [ ] Market value tracking
- [ ] Deck builder
- [ ] Social features

## Troubleshooting

**Development Issues**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Production Issues**
```bash
# Check container status
ssh root@192.168.1.200
docker ps | grep mtg-librarian
docker logs mtg-librarian

# Check GitHub Actions
# https://github.com/Bwarhness/mtgLibrarian/actions
```

## License

All rights reserved - Private project

## Repository

https://github.com/Bwarhness/mtgLibrarian
