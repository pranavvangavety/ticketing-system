# Ticketing System

**BY:** Pranav Vangavety  
**GitHub Link:** [https://github.com/pranavvangavety/ticketing-system](https://github.com/pranavvangavety/ticketing-system)

---

## 1. Project Overview

This document outlines the technical architecture and implementation details of a full-stack ticket tracking platform. The system provides role-based functionality for logging, assigning, and resolving support and development issues.

- **Backend:** Spring Boot 3.5 (Java 23) with Maven
- **Frontend:** React 19 + Vite with Tailwind CSS
- **Persistence:**
    - **Production:** PostgreSQL
    - **Development/Test:** In-memory H2
    - **ORM:** Spring Data JPA
- **Authentication:** JWT-based with role-based access control (RBAC)
- **User Roles:** `ADMIN`, `USER`, `RESOLVER`

---

## 2. System Architecture

The application follows a client-server model with a decoupled backend and frontend.  
Communication is handled via a RESTful API. The client-side SPA consumes endpoints exposed by the Spring Boot backend. All state is managed by the client, and secured API endpoints require a Bearer JWT token in the `Authorization` header.

---

## 3. Backend (Spring Boot)

The backend is responsible for business logic, data persistence, and security.

### 3.1 Core Dependencies
Key dependencies are defined in `backend/pom.xml`:

- **Spring Boot:**
    - `spring-boot-starter-web`
    - `spring-boot-starter-data-jpa`
    - `spring-boot-starter-security`
    - `spring-boot-starter-validation`
    - `spring-boot-starter-mail`
- **Security:** `io.jsonwebtoken:jjwt` (JJWT library for token management)
- **Database:** PostgreSQL driver, H2 in-memory database
- **Utilities:** `commons-codec` for hashing operations
- **Build Configuration:** Maven compiler set for Java 23 with `--enable-preview`

### 3.2 Configuration
- **SecurityConfig:**
    - Disables CSRF
    - Configures CORS via `CorsConfig`
    - Defines security filter chain, inserting `JwtAuthenticationFilter` before `UsernamePasswordAuthenticationFilter`
    - Sets endpoint authorization rules, restricting `/admin/**` and `/resolver/**` based on role authorities
- **CorsConfig:** Allows localhost origins for development with `Access-Control-Allow-Credentials` enabled
- **LoadStartupUsers:** Seeds database with essential accounts (`admin`, `deleted_user`) on startup, using credentials from `application.properties`

### 3.3 Security
- **JwtUtil:** Handles JWT operations
    - **Generation:** Creates JWTs signed with HMAC SHA-256, embedding roles as authorities
    - **Parsing & Validation:** Verifies signature & expiration (24-hour TTL)
- **JwtAuthenticationFilter:** A `OncePerRequestFilter` that:
    - Extracts JWT from headers
    - Validates using `JwtUtil`
    - Compares token hash with stored hash in `Auth` to prevent session hijacking
    - Sets authentication in `SecurityContextHolder` if valid

### 3.4 Data Model
- **Auth:** Stores credentials, roles, and active session token hashes
- **User:** Profile details (`username`, `name`, `email`, `empid`, `lastLogin`)
- **Ticket:** Core entity with title, description, type, status, risk, assignedTo, closedBy, attachments (Base64 byte[]), timestamps (`@CreatedDate`, `@LastModifiedDate`)
- **Enums:** `Role`, `TicketStatus`, `TicketType`, `RiskLevel`
- **Supporting:** `PasswordHistory`, `PasswordReset`, `Invites`

### 3.5 Repositories
Standard Spring Data JPA interfaces with custom queries:
- `AuthRepository`
- `TicketRepository`
- `UserRepository`
- `InvitesRepository`
- `PasswordHistoryRepository`
- `PasswordResetRepository`

### 3.6 Service Layer
- **AuthService:**
    - Validates invite token before registration
    - Enforces password history (last 5 passwords)
    - Validates Google reCAPTCHA on login
    - Generates JWT & stores hashed token in `Auth`
    - Handles password reset with expiring tokens via `EmailService`
- **TicketService:**
    - Creates tickets (Base64 encodes attachments)
    - Handles status updates, assignment, and closure
    - Provides secure attachment downloads
- **AnalyticsService:**
    - Aggregates counts, time-series data, and type/risk distributions
    - Exports analytics snapshot
- **UserService / InviteService:**
    - Manages profiles and admin-generated invites

### 3.7 Controller Layer
- **AuthController:** Login, register, logout, password, invite token validation
- **TicketController:** CRUD tickets, attachments, role-specific `/resolver/**` routes
- **AdminController:** User management, role assignments, analytics
- **AnalyticsController:** Provides dashboard datasets

### 3.8 Exception Handling
Global exception handler (`@ControllerAdvice`) maps errors to structured JSON responses:
- 400: Validation
- 403: Authorization failure
- 404: Not found

---

## 4. Frontend (Vite + React)

The frontend is a responsive SPA.

### 4.1 Build & Tooling
- **Build:** Vite
- **Lint/Format:** ESLint + Prettier
- **Styling:** Tailwind CSS (JIT mode)
- **Entry Point:** `src/main.jsx`

### 4.2 Core Libraries & State Management
- **UI:** `react`, `react-dom`
- **Routing:** `react-router-dom`
- **HTTP:** `axios` with JWT interceptor (`src/lib/axios.js`)
- **Security:** `jwt-decode` for role-based UI logic
- **State:** Context API
    - `SessionModalContext` for handling expired sessions via global modal
- **Visuals:** `recharts` for charts, `lucide-react` for icons

### 4.3 UI Components
- **Routing Guards:**
    - `ProtectedRoute` (JWT required)
    - `AdminRoute` (ADMIN role required)
- **Layout:** Navbar, Pagination, MultiSelectDropdown
- **Features:** TicketTable, TicketActionsDropdown, ResolverDropdown, DashboardCard, PasswordFields
- **Charts:** TicketTypeChart, RiskLevelChart, TicketsOverTimeChart

### 4.4 Pages
- **Auth:** Login, Register, ForgotPassword, ResetPassword
- **User:** Dashboard, CreateTicket, ViewTickets
- **Admin:** Dashboard, ViewUsers, InviteUser, Analytics
- **Resolver:** Dashboard, AssignedTickets

---
