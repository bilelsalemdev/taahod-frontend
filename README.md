# Taahod - Frontend

React-based frontend application for the Islamic learning platform with full Arabic/RTL support.

## 🚀 Quick Start

### Prerequisites
- Node.js v20+
- npm v10+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 📦 Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

The production build will be in the `dist/` folder.

## 🔧 Environment Variables

Create a `.env.production` file:

```env
VITE_API_URL=https://your-api-domain.com/api
```

## 🛠️ Technology Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Ant Design 5** for UI components
- **React Router 7** for navigation
- **React Query** for state management
- **Axios** for HTTP requests
- **i18next** for internationalization
- **PDF.js** for document viewing

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── services/       # API services
├── contexts/       # React contexts
├── i18n/           # Translations (Arabic/English)
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── config/         # Configuration files
```

## 🌍 Features

- 📚 Digital library with PDF viewer
- 📅 Study schedule management
- 🎙️ Quran recitation uploads
- 🎧 Islamic podcasts
- 📿 Daily adhkar
- 👥 Collaborative learning
- 📊 Progress tracking
- 🌐 Bilingual (Arabic/English) with RTL support
- 📱 Fully responsive design

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

Quick deployment:
```bash
npm run build
# Deploy the dist/ folder to your web server
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔗 Backend API

This frontend requires the Taahod backend API to be running.
Configure the API URL in `.env.production`.

## 📄 License

MIT License
