# Medical Appointment System - Frontend

A React-based frontend application for managing medical appointments between doctors and patients.

## Features

- Modern, responsive UI using Material-UI
- User authentication and authorization
- Role-based access control (Doctor/Patient)
- Appointment management (create, update, cancel, approve, reject)
- Doctor schedule management
- Medical notes for appointments
- Real-time updates
- Form validation
- Error handling

## Tech Stack

- React 18
- TypeScript
- Material-UI (MUI)
- Redux Toolkit
- React Router v6
- Axios
- Vite
- Formik & Yup
- React Toastify
- Date-fns

## Prerequisites

- Node.js 16 or later
- npm 7 or later

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/appointment-system-frontend.git
   cd appointment-system-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   VITE_API_URL=http://localhost:8080
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will start on `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run start` - Start production server

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── services/      # API services
├── store/         # Redux store
├── types/         # TypeScript types
├── utils/         # Utility functions
└── hooks/         # Custom hooks
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:8080

# Feature Flags
VITE_ENABLE_MOCK_API=false
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
