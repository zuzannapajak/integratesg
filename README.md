# IntegratESG Platform

A web-based educational platform supporting ESG learning through case studies (ePortfolio) and interactive scenarios developed in Articulate Storyline.



## 🚀 Project Overview

The platform is designed to provide practical ESG learning experience by combining:

- **ePortfolio** – a structured repository of ESG case studies
- **Scenario Simulator** – interactive scenarios delivered via Articulate Storyline

The system acts as a specialized Micro-LMS, focusing on the seamless delivery of external educational content with standardized progress tracking.



## 👥 User Roles

- **Student**
  - Accesses case studies and the scenario library.
  - Completes interactive scenarios.
  - Tracks personal progress and scores.

- **Professor**
  - Accesses all educational content for teaching support.
  - Monitors the general availability of resources.


## 🌍 Features

  - **Multilingual Framework**: Full i18n for UI and language-specific content variants.
  - **ePortfolio**: Organized repository of ESG case studies with a standardized structure.
  - **Scenario Simulator**: Integrated player for Articulate Storyline content.
  - **SCORM Tracking**: Automatic capture of completion status, scores, and session time.
  - **Resume Functionality**: Support for suspend_data, allowing users to resume scenarios where they left off.
  - **Responsive Design**: Optimized for desktop and mobile devices.



## 🧱 Tech Stack

### Application
- **Next.js** (full-stack)
- **TypeScript** & Tailwind CSS
- **next-intl** (internationalization)

### Data & Auth
- **Supabase** (PostgreSQL + Auth)
- **Prisma** (ORM)

### Assets & Integration
- **Cloudflare R2**: Hosting for extracted Storyline SCORM packages.
- **SCORM 1.2 API Adapter**: Custom JavaScript implementation to bridge Storyline packages and the platform's database.

### Deployment
- **Vercel**



## 🎮 Scenario Integration

Scenarios are created externally using **Articulate Storyline**, exported as SCORM 1.2 packages, and integrated into the platform.

**Key Technical Details:**
- Standard: Mandatory SCORM 1.2 for all interactive content.
- Launch: Scenarios open in a dedicated viewer that provides the window.API object (LMS Runtime Environment).
- Data Capture: The platform automatically logs:
  - `cmi.core.lesson_status` (Started, Completed, Passed, Failed).
  - `cmi.core.score.raw` (User's score).
  - `cmi.suspend_data` (User's current state/slide).
  - `cmi.core.session_time` (Time spent per session).


## 🌐 Multilingual Support

- **UI**: Managed via JSON translation files and next-intl.
- **Content**: Case studies and metadata are stored as language-specific records.
- **Scenario Variants**: Each language version is a separate SCORM package linked to a specific language variant, ensuring the correct localized content is launched.



## 📊 Scope

This project follows a production-ready MVP approach:
- **Authentication**: Secure login with role-based access control.
- **ePortfolio**: Functional repository with multilingual case studies.
- **Scenario Simulator**: Full SCORM 1.2 integration for progress and score syncing.
- **Progress Tracking**: Personal dashboard showing status and completion data.

Out of scope for MVP:
- Built-in CMS for content upload (manual upload to R2).
- Advanced analytics and heatmaps.
- Scenario authoring tools.
- xAPI or cmi5 support.



## 📄 License

### Software
This project is licensed under the **MIT License**.

### Content
Educational materials (case studies, descriptions) are licensed under  
**Creative Commons Attribution 4.0 (CC BY 4.0)**.

### Scenarios
Articulate Storyline scenarios are external assets and may be subject to separate licensing defined by their authors.



## ⚙️ Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up `.env` with Supabase and Cloudflare R2 credentials.
4. Run Prisma migrations: `npx prisma migrate dev`.
5. Start development: `npm run dev`.
