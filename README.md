# KU Connect

A centralised society communication platform for Kingston University, built as a Final Year Project. KU Connect addresses the fragmented communication between the Students' Union, society leaders, and students by providing a single mobile application with role-based access for all three user groups.

---

## Overview

Communication across Kingston University's societies is currently fragmented across WhatsApp, Instagram, email, and the KU website. KU Connect provides a unified platform where:

- **Students** can discover societies, browse and like events, follow societies, and manage notification preferences
- **Society leaders** can create, edit and delete events, manage their society profile, and track engagement
- **SU staff** can view all upcoming events across societies with status visibility

---

## Built With

- [React Native](https://reactnative.dev/) — cross-platform mobile framework
- [Expo](https://expo.dev/) — managed React Native toolchain
- [Supabase](https://supabase.com/) — PostgreSQL backend, authentication, and real-time database
- [React Navigation](https://reactnavigation.org/) — screen routing and nested navigation
- React Context API — global state management for society leader flow

---

## Features

### Student
- Sign up and log in with Kingston University email (`@kingston.ac.uk`)
- Browse upcoming events across all societies on home screen
- Search and filter societies and events by category
- Follow and unfollow societies
- View personalised feed of events from followed societies
- View full event details including date, time, location and organiser
- Like events
- Rate past events with star rating
- Manage notification preferences

### Society Leader
- Select and access society dashboard
- Create structured events with title, date, time, location, description, category and image
- Edit and delete existing events with confirmation
- View like counts and event engagement
- Update society profile including name, description and cover image

### SU Staff
- Access staff dashboard via shared access code
- View all upcoming events across all societies
- See event status badges (published/pending)

---

## Project Structure

src/
├── api/                    # Supabase client and service functions
│   ├── supabase.js         # Supabase client initialisation
│   └── eventService.js     # Event CRUD service layer
├── components/
│   ├── controller/         # Business logic layer
│   │   └── eventController.js
│   ├── layout/             # Reusable layout components
│   │   ├── Button.js
│   │   ├── Card.js
│   │   └── ScreenWrapper.js
│   ├── navigation/         # Role-based navigators
│   │   ├── student/
│   │   ├── society/
│   │   └── su/
│   └── UI/                 # Reusable UI components
│       ├── EventCard.js
│       └── SocietyCard.js
├── context/
│   └── SocietyContext.js   # Global society state
├── screens/
│   ├── student/            # Student-facing screens
│   ├── society/            # Society leader screens
│   └── su/                 # SU staff screens
└── theme.js                # Centralised design tokens

---

## Getting Started

### Prerequisites

- Node.js v20+
- npm
- Expo CLI
- Android emulator (Android Studio) or physical Android device
- Supabase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/badarianof/ku-connect.git
cd ku-connect
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

4. Start the development server
```bash
npx expo start
```

5. Open on Android emulator or scan the QR code with Expo Go

---

## Environment Variables

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | (https://lkbaavjnyeeuascymbst.supabase.co) |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrYmFhdmpueWVldWFzY3ltYnN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTE5NTQ0NSwiZXhwIjoyMDg0NzcxNDQ1fQ.vd3Y5uB0jKYP70ZWQ9ZgMqBtBMrURywToWkskkP2yqU |

Never commit your `.env` file — it is included in `.gitignore`

---

## Database Schema

The application uses a PostgreSQL database hosted on Supabase with the following core tables:

| Table | Description |
|---|---|
| `society` | Society profiles linked to category |
| `society_category` | Normalised category lookup |
| `event` | Events created by societies |
| `student` | Student profiles linked to Supabase Auth |
| `follows` | Student-society follow relationships |
| `likes` | Student-event like relationships |
| `feedback` | Post-event star ratings |
| `society_login` | Prepared for future society authentication |
| `su_staff` | Prepared for future SU staff authentication |
| `question` | Prepared for future Q&A feature |

---

## Architecture

Event creation follows a three-layer architecture separating UI, business logic, and data concerns:
CreateEventsScreen → eventController.js → eventService.js → Supabase

Other database operations interact with Supabase directly from screens. Full abstraction into service functions is identified as a priority for future development.

---

## Known Limitations

- Society authentication uses a selection screen rather than credential-based login — prototype limitation
- Row Level Security is disabled in Supabase — production deployment would require properly configured RLS policies
- Push notification delivery is not implemented — preferences are stored but no delivery infrastructure exists
- SU staff access uses a shared access code — not suitable for production
- Q&A, SU broadcast, and social media integration features were designed but not implemented within project scope

---

## Colour Scheme

| Token | Hex | Usage |
|---|---|---|
| Primary | `#032D39` | Headings, buttons, interactive elements |
| Background | `#FFFFF8` | Screen backgrounds |
| Card | `#EED7A1` | Card backgrounds |
| Accent | `#E7D2CF` | Badges, selected states |
| Neutral | `#9D8B77` | Tab bar, labels, borders |
| Text | `#1F2937` | Body text |

---

## Testing

Usability testing was conducted with 5 participants across three user roles. Average ease of use rating: **4.1 / 5**.

Functional requirements testing confirmed 7 of 12 requirements fully implemented, with 2 partially implemented and 3 deferred to future development.

---

## Future Development

- Credential-based authentication for society leaders using `society_login` table
- Re-enable Supabase Row Level Security with role-based policies
- Implement Q&A system — `question` table already exists in schema
- Push notification delivery using Expo Notifications
- SU broadcast area
- Social media content integration
- Pilot deployment with real KU societies

---

## Academic Context

This project was developed as a Final Year Project for BSc Computer Science at Kingston University London (2025-2026). The development followed an Agile methodology across six sprints, progressing from foundational setup through to a fully styled, role-based mobile application.

---

## License

This project was developed for academic purposes. All rights reserved.
