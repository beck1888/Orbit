# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Orbit is a Next.js 15 assignment tracker application that helps students manage their classes and assignments. The app uses client-side storage (IndexedDB) for data persistence and includes features like task management, due date tracking, and completion status management.

## Development Commands

- `npm run dev --turbopack` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

### Core Structure

The application follows a component-based architecture with these key parts:

- **Database Layer**: `src/utils/database.ts` - IndexedDB wrapper with `AssignmentDatabase` class managing classes and assignments
- **Main Container**: `src/components/AssignmentTracker.tsx` - Central state management and orchestration
- **Layout Structure**: Split-screen design with sidebar (`ClassList`) and main content area (`Dashboard` or `AssignmentList`)

### Data Models

```typescript
interface Class {
  id: number;
  name: string;
  emoji: string;
  createdAt: string;
}

interface Assignment {
  id: number;
  classId: number;
  title: string;
  description?: string;
  type: string;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}
```

### Key Components

- **Dashboard**: Home view showing task statistics and filtered task lists (today, tomorrow, overdue, etc.)
- **ClassList**: Clean sidebar component focused only on class navigation
- **AssignmentList**: Main content area showing assignments for selected class in categorized columns
- **SettingsManagementPanel**: Full-screen modal containing all management functionality
- **ClassManagementPanel**: Dedicated component for adding/removing classes
- **PreferencesPanel**: User preferences and display settings
- **DataPanel**: Data management and storage information
- **HistoryView**: Completed assignments history with filtering
- **Modal System**: Reusable modal wrapper for forms

### State Management

State is managed at the `AssignmentTracker` level and passed down through props:
- Database instance management
- Class and assignment collections
- Current class selection
- Modal visibility states

### Database Operations

All data operations go through the `AssignmentDatabase` class:
- Classes: add, get all, delete (cascades to assignments)
- Assignments: add, update, delete, get by class, get incomplete/complete
- Automatic timestamp management for creation and completion

### Styling

- Uses Tailwind CSS for styling
- Custom component styling with responsive design
- Icon system using SVGs in `public/icons/`
- Sound effects for task completion in `public/sounds/`

## Important Implementation Notes

- All database operations are async and include error handling
- The app uses client-side only (`'use client'`) components due to IndexedDB requirement
- Assignment completion triggers confetti animation and sound effects
- Date handling uses ISO string format for consistency
- Modal forms validate input and handle cancellation
- Component hierarchy ensures proper data flow and state updates
- Settings and management functionality is properly separated into dedicated panels
- Each component has a single, clear responsibility following SRP (Single Responsibility Principle)