# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Orbit is a Next.js-based assignment tracker application that helps students manage their classes and assignments. The app uses IndexedDB for client-side data persistence and is built with React, TypeScript, and Tailwind CSS.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint to check code quality

## Architecture

### Core Structure
- **Next.js App Router**: Uses the new app directory structure (`src/app/`)
- **Client-side Database**: IndexedDB wrapper in `src/utils/database.ts` handles all data persistence
- **Component-based UI**: Modular React components in `src/components/`

### Data Models
The application manages two main entities:
- **Classes**: Have `id`, `name`, `emoji`, and `createdAt` fields
- **Assignments**: Have `id`, `classId`, `title`, `description`, `type`, `dueDate`, `completed`, `createdAt`, and `completedAt` fields

### Key Components
- **AssignmentTracker**: Main orchestrator component that manages global state
- **Dashboard**: Overview component showing task statistics and upcoming assignments
- **ClassList**: Manages the display and interaction with user's classes
- **AssignmentList**: Handles assignment display for a specific class
- **Database Layer**: `AssignmentDatabase` class provides async methods for all CRUD operations

### Database Architecture
The IndexedDB implementation (`src/utils/database.ts`) provides:
- Automatic database initialization and schema versioning
- Class management (add, delete, list)
- Assignment CRUD operations with sorting by due date
- Query methods for dashboard statistics (upcoming, overdue, completed assignments)

### State Management
- Uses React's built-in state management (useState, useEffect)
- Database instance is initialized once and passed down through props
- Components reload data after mutations to maintain consistency

### File Organization
- `src/app/`: Next.js app router files (layout, page, globals)
- `src/components/`: All React components (forms, lists, modals, dashboard)
- `src/utils/`: Utility functions (database operations, date helpers)
- `public/`: Static assets (icons, sounds)

## Development Notes

### TypeScript Configuration
- Uses strict mode with path mapping (`@/*` points to `src/*`)
- Configured for Next.js with bundler module resolution

### Styling
- Uses Tailwind CSS for all styling
- Custom color schemes for different UI states (alerts, completion states)
- Responsive design patterns throughout

### Data Flow
1. Database initialized on app mount in AssignmentTracker
2. Components receive database instance via props
3. UI updates trigger database operations
4. Components reload data to reflect changes
5. Dashboard aggregates data from multiple database queries