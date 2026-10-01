# Angular Enterprise Starter Template

An enterprise-grade starter web application built with **Angular 15**, **Bootstrap 5**, and **Angular Material**. Designed with multi-tenancy, hierarchical Role-Based Access Control (RBAC), persona scope acting, modern UI/UX design, and modular architecture.

---

## 🚀 Key Features

### 🛡️ Hierarchical Multi-Role RBAC & Persona Acting
- **Hierarchical Role Model**:
  - **`SUPERADMIN` (Rank 3)**: Full platform ownership. Can assume personas: `SUPERADMIN`, `ADMIN`, or `USER`.
  - **`ADMIN` (Rank 2)**: Tenant/organization level management. Can assume personas: `ADMIN` or `USER`.
  - **`USER` (Rank 1)**: Standard tenant member. Operates strictly in `USER` persona.
- **Dynamic Acting Role Scope Switcher**: Switch acting personas on the fly from the navigation bar without logging out to test and verify permission levels in real time.
- **Seed Account Quick-Switcher**: Instant one-click login toggle between demo accounts (`superadmin`, `admin1`, `user1`) directly from the UI.
- **Route Guard (`RoleGuard`)**: Enforces minimum required roles for sensitive feature modules (`/admin/*`, `/superadmin/*`, `/books/create`, `/books/update/:id`).
- **Interactive Access-Denied Prompts (`RbacPromptService`)**: Styled SweetAlert2 modal dialogs explaining required role vs. active role whenever an unauthorized action or route is attempted.
- **HTTP Interceptors**:
  - `RequestInterceptor`: Automatically injects JWT Bearer tokens to backend requests.
  - `ResponseInterceptor`: Catches `401 Unauthorized` and `403 Forbidden` responses, gracefully triggering security modals and redirects.

---

### 📦 Feature Modules

1. **Super Admin Console (`/superadmin`)**:
   - Multi-tenant workspace overview & stats.
   - Cross-tenant workspace directory with tenant provisioning.
   - Global user directory across all tenants.
   - Platform-wide book catalog with status indicators.
   - Swagger / endpoint RBAC permissions matrix.

2. **Tenant Administration (`/admin/users`)**:
   - Workspace member directory with search and role badges.
   - New user onboarding modal (`CreateTenantUserDTO`).
   - Tenant user status and role management.

3. **Book Catalog Management (`/books`)**:
   - **Role-Aware UI**:
     - Standard users receive a clean, read-only catalog browsing view with modal details.
     - Admins & Superadmins have full CRUD capabilities (Add, Edit, Delete).
   - Responsive card and table layouts with search and filter controls.

4. **User Profile (`/user`)**:
   - Modern profile header with avatar display and toggleable cover banner.
   - Account details, security summary, and active role badges.

5. **Authentication System (`/auth`)**:
   - Modern centered card layouts with responsive design.
   - Complete Login, Signup, and Forgot Password flows.
   - JWT decoding (`jwt-decode`) with automated local session management.

---

### 🎨 Modern UI & UX
- **Design System**: Harmonious color palette, glassmorphism accents, and elevated cards.
- **Responsive Layout**: Collapsible sidebar, sticky navigation bar with active tenant and role badge indicators.
- **Component Libraries**:
  - **Angular Material**: Form fields, inputs, dialogs, buttons.
  - **Bootstrap 5**: Grid system, layout utilities, and flexbox helpers.
  - **SweetAlert2**: Styled confirmation and access-denied modal prompts.
  - **Ngx-Toastr**: Non-blocking toast notifications for system alerts.
  - **Ng-Select**: Searchable dropdowns for smooth selections.
  - **Font Awesome**: Icon system for clear navigation and action indicators.

---

## 🛠️ Technology Stack

- **Framework**: [Angular 15.0](https://angular.io/)
- **Language**: [TypeScript 4.8](https://www.typescriptlang.org/)
- **State & Reactive**: [RxJS 7.5](https://rxjs.dev/)
- **Styling**: SCSS / CSS3, [Bootstrap 5.2](https://getbootstrap.com/), [Angular Material 15.2](https://material.angular.io/)
- **Notifications & Modals**: [SweetAlert2](https://sweetalert2.github.io/), [Ngx-Toastr](https://www.npmjs.com/package/ngx-toastr)
- **Token Handling**: [jwt-decode](https://www.npmjs.com/package/jwt-decode)
- **Build Tool**: Angular CLI 15.0

---

## 👥 Demo Accounts (Seed Credentials)

Use these accounts to test the hierarchical RBAC capabilities:

| Role | Username | Password | Permitted Acting Personas |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin` | `Super@Admin123!` | `SUPERADMIN`, `ADMIN`, `USER` |
| **Tenant Admin** | `admin1` | `Admin@12345!` | `ADMIN`, `USER` |
| **Standard User** | `user1` | `User@12345!` | `USER` |

> [!TIP]
> Use the **Role Persona** dropdown or the **Quick Switch Account** buttons in the navigation header to toggle between these identities without typing credentials.

---

## 🏁 Getting Started

### Prerequisites
- **Node.js**: v16.x or v18.x (LTS recommended)
- **NPM**: v8.x or higher
- **Angular CLI**: Install globally via:
  ```bash
  npm install -g @angular/cli@15
  ```

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/beingaloksharma/angular-template.git
   cd angular-template
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Backend API Configuration

The application points by default to the backend service at:
```text
http://localhost:8080/webstarter/
```

To customize the backend endpoint, edit [`src/app/shared/services/constants.service.ts`](file:///Users/sharma/go/src/beingaloksharma/angular-template/src/app/shared/services/constants.service.ts):
```typescript
export class ConstantsService {
  readonly SERVER_URL: string = 'http://localhost:8080/webstarter/';
}
```

### Running the Application

1. **Start the development server**:
   ```bash
   npm start
   # or
   ng serve
   ```

2. **Access the application**:
   Open [http://localhost:4200/](http://localhost:4200/) in your browser.

---

## 📜 Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm start` | Starts the Angular development server on `http://localhost:4200/` |
| `npm run build` | Compiles the production build into the `dist/` directory |
| `npm run watch` | Builds in development mode with continuous file watching |
| `npm test` | Executes unit tests via [Karma](https://karma-runner.github.io) |

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── components/
│   │   ├── admin/               # Tenant administration & member management
│   │   │   ├── admin-users/     # User list, role assign, user creation
│   │   │   └── admin.module.ts
│   │   ├── superadmin/          # Superadmin console (workspaces, catalog, directory)
│   │   │   └── superadmin.module.ts
│   │   ├── auth/                # Login, Register, Forgot Password, JWT service
│   │   ├── book/                # Book catalog management (List, Create, Update, View)
│   │   └── myprofile/           # User profile & cover customizer
│   ├── interceptors/
│   │   ├── request.interceptor.ts   # Injects JWT Bearer token into headers
│   │   └── response.interceptor.ts  # Handles 401 & 403 API responses with RBAC alerts
│   ├── shared/
│   │   ├── layout/              # Header, sidebar, role selector, account switcher
│   │   ├── models/              # TypeScript interfaces (RBAC, DecodedToken, etc.)
│   │   ├── routes/              # Content & feature routing definitions
│   │   └── services/
│   │       ├── rbac.service.ts         # Hierarchical role logic, acting state, credentials
│   │       ├── rbac-prompt.service.ts  # SweetAlert2 modal for access denied events
│   │       ├── role.guard.ts           # Route guard checking minimum required role
│   │       ├── auth.guard.ts           # Route guard verifying login status
│   │       └── constants.service.ts    # Backend API configuration URLs
│   ├── app-routing.module.ts
│   └── app.module.ts
└── assets/                      # Icons, styling assets, and static files
```

---

## 🤝 Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'feat: add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the terms of the MIT License.
