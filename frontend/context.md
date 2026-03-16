# Frontend Context & Strategy: Social Media Aura

This document serves as the architectural blueprint and reference for the frontend development of the Social Media Aura project, a modern hybrid of Medium, Dev.to, and Instagram.

## 1. Project Overview
A high-performance, industry-standard social media application featuring rich-text blogging, image-centric posts, threaded discussions, and a robust social graph (follow/unfollow).

### Core Philosophy
- **Performance First**: Optimized bundle sizes, image optimization, and efficient data fetching.
- **UX Excellence**: Optimistic updates, skeleton loaders, and intuitive navigation.
- **Developer Experience**: Strongly typed (TypeScript), modular components, and clear state boundaries.

---

## 2. Tech Stack
| Technology | Usage |
| :--- | :--- |
| **Next.js (App Router)** | Framework, Routing, SSR/ISR |
| **Material UI (MUI)** | Component Library, Theming (Light/Dark) |
| **TanStack Query (v5)** | Server State Management, Caching, Syncing |
| **Zustand** | Client-side Global State (Auth, UI preferences) |
| **Axios** | HTTP Client with Interceptors (Auth, Error handling) |
| **React Hook Form** | Form Management |
| **Zod** | Schema Validation (Forms & API responses) |
| **Lucide React** | Modern Iconography |
| **Tailwind CSS + clsx** | Utility styling & conditional class management |
| **Date-fns** | Time formatting (Relative time like "2 days ago") |

---

## 3. Backend API Reference

### Base URL: `http://localhost:8000` (Development)

### Authentication
- `POST /api/token/`: Obtain JWT (Access + Refresh).
- `POST /api/token/refresh/`: Refresh Access Token.
- `GET/POST /_allauth/headless/`: Headless social/interactive auth.

### Users & Profiles
- `GET /users/profile/me/`: Get current user's profile.
- `PATCH /users/profile/me/`: Update profile (Bio, social links).
- `GET /users/profile/{id}/`: Public profile view.
- `POST /users/profile-follow/{id}/follow/`: Toggle follow status.
- `GET /users/profile-follow/{id}/followers_list/`: Get followers.
- `GET /users/profile-follow/{id}/following_list/`: Get following.

### Blog & Posts
- `GET /posts/`: List all public posts (Search: `?search=`, Filter: `?category=`, `?author=`).
- `GET /posts/feed/`: Personalized feed (Followed users + self).
- `GET /posts/my-posts/`: Current user's posts.
- `POST /posts/`: Create new post.
- `GET /posts/{slug}/`: Post details.
- `POST /posts/{id}/like/`: Toggle like status.
- `GET /posts/categories/`: List all categories.
- `GET /posts/tags/`: List all tags.

### Comments
- `GET /posts/{post_pk}/comments/`: List comments for a post.
- `POST /posts/{post_pk}/comments/`: Add a comment (supports `parent` ID for replies).
- `POST /comments/like/`: (Check backend implementation for direct comment likes).

---

## 4. Key Features to Implement

### A. Authentication System
- Persistent session using `Zustand` + `Cookies`/`LocalStorage`.
- Axios interceptors to automatically attach `Authorization: Bearer <token>` and handle `401 Unauthorized` by refreshing tokens.

### B. Dynamic Feed (Instagram/Dev.to style)
- **Infinite Scroll**: Using TanStack Query `useInfiniteQuery`.
- **Media Support**: Support for multiple images per post with a lightbox/carousel.
- **Optimistic Likes**: Instant UI feedback when clicking the "Like" button.

### C. Rich Content Creation (Medium style)
- **Drafts**: Save and resume post drafts.
- **Rich Text Editor**: Integration (e.g., TipTap or Quill) for `content` field.
- **Async Uploads**: Progress bars for image uploads (connecting to the Celery backend).

### D. Social Interactions
- **Threaded Comments**: Nested UI for replies.
- **Profile Customization**: verified badge status, social link integration.
- **Follow System**: Global state synchronization (following someone in the feed updates their status on their profile page).

---

## 5. Frontend Architecture & Folder Structure

```text
src/
├── app/                  # Next.js App Router (Pages & Layouts)
├── components/           # UI Components
│   ├── ui/               # Base MUI/Custom components (Buttons, Inputs)
│   ├── layout/           # Sidebar, Navbar, Footer
│   ├── shared/           # PostCard, CommentItem, UserAvatar
│   └── forms/            # RHF + Zod Schema-based forms
├── hooks/                # Custom React hooks (useAuth, useIntersectionObserver)
├── services/             # API Service layers (Axios instances)
├── store/                # Zustand Stores (useAuthStore, useUIStore)
├── types/                # TypeScript Interfaces & Zod Schemas
├── utils/                # Helper functions (Formatters, Validators)
└── lib/                  # Library configurations (QueryClient, MUI Theme)
```

---

## 6. Development Road Map
1. **Infrastructure**: Setup Axios, TanStack Query, and MUI Theme.
2. **Authentication**: Implement Login/Register and Auth Store.
3. **Core Shell**: Build Navbar, Sidebar, and Responsive Layout.
4. **Feed & Post Discovery**: Implement the main feed and post cards.
5. **Post Detail & Comments**: Build the reading experience and threaded comments.
6. **Creation Flow**: Rich text editor and image upload integration.
7. **Profile & Social**: Profile pages and follow/unfollow logic.
8. **Polishing**: SEO, Animations (Framer Motion), and Performance optimization.
