# Angular Template

## Overview
This is a starter web application built with **Angular 15**, providing a robust foundation for building modern enterprise-grade web applications. It comes pre-packaged with essential features like authentication, routing, protection guards, and a sample resource module, integrated with popular UI libraries for a polished look and feel.

## Features

### Core Functionality
- **Modular Architecture**: Organized into feature modules (`Auth`, `Book`, `Profile`) and shared resources for scalability.
- **Authentication System**: 
  - Complete Login, Signup, and Forgot Password flows.
  - **JWT Support**: Includes `jwt-decode` for handling tokens.
  - **Auth Guards**: Route protection to ensure only authenticated users access private pages.
- **HTTP Interceptors**:
  - `RequestInterceptor`: Automatically attaches Authentication tokens to outgoing API requests.
  - `ResponseInterceptor`: Global error handling and response processing.

### UI & UX
- **Responsive Design**: Built with **Bootstrap 5** and **Angular Material** components.
- **Interactive Elements**:
  - **Ng-Select**: Advanced dropdowns.
  - **SweetAlert2**: Beautiful, responsive modal popups.
  - **Ngx-Toastr**: Slick, non-blocking notifications.
  - **Font Awesome**: Comprehensive icon library.

### Sample Modules
- **Book Module**: A demonstration feature including:
  - Create Book
  - List Books
  - Book Details View
- **User Profile**: Basic profile management structure.

## Technology Stack

- **Framework**: [Angular 15](https://angular.io/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: SCSS, [Bootstrap 5](https://getbootstrap.com/), [Angular Material](https://material.angular.io/)
- **Reactive Programming**: [RxJS](https://rxjs.dev/)
- **Build Tool**: Angular CLI

## Getting Started

### Prerequisites
Ensure you have the following installed locally:
- **Node.js**: (LTS version recommended, compatible with Angular 15)
- **NPM**: Comes with Node.js
- **Angular CLI**: Install globally via `npm install -g @angular/cli`

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd angular-template
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Running the Application

1. **Start the development server**:
   ```bash
   ng serve
   ```
   
2. **Access the app**:
   Open your browser and navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Backend Configuration
The application is currently configured to look for a backend service at:
`http://localhost:8080/webstarter/`

You can modify this configuration in `src/app/shared/services/constants.service.ts` to match your local or production backend environment.

## Scripts

- **`npm start`**: runs `ng serve` to start the dev server.
- **`npm run build`**: runs `ng build` to compile the app into the `dist/` directory.
- **`npm test`**: runs `ng test` to execute unit tests via [Karma](https://karma-runner.github.io).
- **`npm run watch`**: runs the build in watch mode.

## Project Structure

```text
src/
├── app/
│   ├── components/      # Feature-specific components
│   │   ├── auth/        # Login, Signup, Forgot Password
│   │   ├── book/        # Book CRUD operations
│   │   └── myprofile/   # User profile
│   ├── interceptors/    # HTTP Interceptors (Token, Error)
│   ├── shared/          # Reusable code
│   │   ├── services/    # Global services (Auth, Constants)
│   │   ├── guards/      # Route guards
│   │   └── components/  # Shared UI components
│   ├── app-routing.module.ts  # Main application routes
│   └── app.module.ts          # Root module
└── assets/              # Static files (images, icons)
```

## Contributing
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.
