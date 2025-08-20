# Nutri-Plan

Nutri-Plan is a web application designed to help users create and manage nutrition plans. It features an admin dashboard for managing a database of foods, including their nutritional information, categories, and serving units. The client-side of the application is currently under development and will allow users to build and track their personalized nutrition plans.

## ✨ Features

- **Food Management**: Admins can add, edit, and delete food items, including detailed nutritional information.
- **Categorization**: Organize foods into custom categories.
- **Serving Units**: Define various serving units for accurate portion tracking.
- **User Roles**: The application supports different user roles (Admin, User) for managing access to features.
- **Responsive Design**: A modern and responsive user interface that works on all devices.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20 or later)
- [npm](https://www.npmjs.com/) or any other package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/nutri-plan.git
   cd nutri-plan
   ```
2. Install NPM packages:
   ```bash
   npm install
   ```
3. Set up your environment variables by creating a `.env` file in the root of the project and adding the following:
   ```env
   DATABASE_URL="file:./dev.db"
   ```
4. Apply database migrations:
   ```bash
   npm run db:migrate
   ```
5. Seed the database with initial data:
   ```bash
   npm run db:seed
   ```

### Running the Application

Now you can run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Lints the code for errors and style issues.
- `npm run test`: Runs the test suite.
- `npm run coverage`: Generates a test coverage report.
- `npm run db:migrate`: Applies database migrations.
- `npm run db:pull`: Pulls the database schema from the database.
- `npm run db:generate`: Generates the Prisma client.
- `npm run db:studio`: Opens the Prisma Studio to view and edit data.
- `npm run db:seed`: Seeds the database with initial data.

## 🛠️ Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **Schema Validation**: [Zod](https://zod.dev/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [SQLite](https://www.sqlite.org/index.html)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Testing**: [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/)

