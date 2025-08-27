# ADR-001: Tech Stack for File Converter Web App

**Date**: 2025-08-26  
**Deciders**: Jhelum Consulting LLC (Piyush Manglani & Anmol Singh)

## Context

We need to build a simple web application that converts files between different formats. The app should be straightforward to develop, deploy, and maintain.

## Decision

We will use:

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Backend**: Node.js with Express
- **File Processing**: Server-side using Node.js libraries
- **Storage**: Local filesystem (temporary files)
- **Deployment**: Single server deployment

## Rationale

**Why Vanilla JS over React/Vue:**

- Simple upload/convert/download workflow doesn't need framework complexity
- Faster development for small project
- No build process or dependency management overhead

**Why Node.js backend:**

- Good ecosystem for file processing (`sharp`, `pdf-lib`, `mammoth`)
- Team familiarity with JavaScript
- Single language across stack

**Why server-side processing:**

- Access to full Node.js library ecosystem
- No browser file size limitations
- Simpler than client-side WebAssembly approach

**Why local storage:**

- Files are temporary (convert and download)
- No need for database or cloud storage complexity
- Easy cleanup with scheduled jobs

## Consequences

**Positive:**

- Quick to build and deploy
- Low complexity and maintenance burden
- Good performance for expected file sizes

**Negative:**

- Server handles all processing load
- Limited by single server resources
- Manual file cleanup needed

**Neutral:**

- Can easily migrate to cloud storage or add database later if needed

## Implementation Notes

- Use `multer` for file uploads
- Implement file cleanup after 1 hour
- Start with basic image and PDF conversions
- Keep conversion libraries lightweight
