# Overview

InverseLens is an AI-powered image analysis application that provides detailed descriptions and mood analysis of uploaded images. The application uses Google's Gemini 2.5-pro model to analyze images in two perspectives: original analysis and "inverse universe" analysis, offering different interpretative views of the same image. Built with a modern full-stack TypeScript architecture, it features a React frontend with shadcn/ui components and an Express.js backend.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development tooling
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **File Handling**: Native browser File API with drag-and-drop support

## Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Database ORM**: Drizzle ORM with PostgreSQL schema definitions
- **File Processing**: Multer middleware for multipart form handling
- **API Design**: RESTful endpoints with JSON responses
- **Error Handling**: Centralized error middleware with proper HTTP status codes

## Data Storage
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: Shared TypeScript schema definitions using Drizzle's table definitions
- **Storage Strategy**: Base64 image encoding for database storage
- **Development Fallback**: In-memory storage implementation for development environments

## Authentication & Authorization
- **Current State**: No authentication system implemented
- **Session Management**: Express sessions configured but not actively used
- **Security**: Basic CORS and request parsing middleware

## External Dependencies
- **AI Service**: Google Gemini 2.5-pro model for image analysis
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Development Tools**: 
  - Replit-specific plugins for development environment
  - TSX for TypeScript execution
  - ESBuild for production bundling
- **UI Components**: Extensive Radix UI component library
- **Styling**: Tailwind CSS with PostCSS processing
- **Form Handling**: React Hook Form with Zod validation schemas