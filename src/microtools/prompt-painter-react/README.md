# HTML Live Preview & Formatter

A beautiful, modern HTML live preview and code formatter application built with React, TypeScript, and Tailwind CSS. Features real-time preview, syntax highlighting, and a stunning glassmorphic design with smooth animations.

## Features

✨ **Live Preview** - See your HTML changes in real-time
🎨 **Beautiful UI** - Modern glassmorphic design with smooth animations
🌙 **Dark Mode** - Starts in dark mode by default
📝 **Code Formatting** - Format your HTML code with proper indentation
📋 **Copy to Clipboard** - Easily copy your formatted code
🧹 **Clear Editor** - Quick clear functionality
💫 **Smooth Animations** - Powered by Framer Motion

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd prompt-painter-react
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **shadcn/ui** - Beautiful UI components
- **js-beautify** - HTML code formatting
- **Lucide React** - Beautiful icons

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── CodeEditor.tsx  # Monaco-based code editor
│   ├── PreviewPanel.tsx # Live preview panel
│   ├── ThemeToggle.tsx # Theme switcher
│   └── Toolbar.tsx     # Action buttons toolbar
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── styles/             # CSS and styling
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

This project is open source and available under the [MIT License](LICENSE).
