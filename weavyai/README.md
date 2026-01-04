# Weavy AI - AI-Powered Design Workflows

**Weavy AI** is a modern, node-based platform that allows creative professionals to build and manage AI-powered design workflows. Create complex workflows by connecting different AI models and tools together, similar to how you'd work in Figma or other visual design tools.

## 🎯 What is This?

Weavy AI is a web application that lets you:
- **Build visual workflows** by connecting different AI models (like GPT, image generators, etc.)
- **Run multiple AI models together** in a single workflow
- **Create reusable workflows** that you can save and come back to
- **Combine text, images, and AI processing** in one seamless interface

Think of it like a visual programming tool, but for AI models. Instead of writing code, you drag and connect nodes to create powerful AI workflows.

## ✨ Key Features

### 🎨 Visual Workflow Editor
- **Drag-and-drop interface** - Build workflows visually by connecting nodes
- **Multiple node types**:
  - **Text Nodes** - Input text directly
  - **Image Nodes** - Upload or use images
  - **LLM Nodes** - Connect to AI models (like Google Gemini)
- **Two interaction modes**:
  - **Arrow mode** - Select and move nodes
  - **Hand mode** - Pan the canvas and move nodes

### 🤖 AI Integration
- **Google Gemini integration** - Run AI models with text and image inputs
- **Run all models** - Execute entire workflows at once
- **Dependency management** - Automatically handles dependencies between nodes
- **Real-time execution** - See results as they're generated

### 💾 Workflow Management
- **Save workflows** - Store your workflows in the cloud
- **Export to JSON** - Download your workflows for backup or sharing
- **Delete workflows** - Manage your saved workflows
- **Undo/Redo** - Full history support for your changes

### 🎭 Beautiful UI
- **Smooth animations** - Powered by GSAP and Lenis
- **Responsive design** - Works on desktop and mobile
- **Modern interface** - Clean, professional design
- **Interactive hero section** - Drag-and-drop demo area

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework for building the web app
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **ReactFlow** - Node-based workflow editor
- **GSAP** - Animation library for smooth interactions
- **Lenis** - Smooth scrolling
- **Zustand** - State management

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **MongoDB** - Database for storing workflows
- **Mongoose** - MongoDB object modeling

### Authentication
- **Clerk** - User authentication and management

### AI Services
- **Google Generative AI (Gemini)** - AI model integration

## 📋 Prerequisites

Before you begin, make sure you have:
- **Node.js** 18+ installed
- **npm** or **yarn** package manager
- **MongoDB** database (local or cloud like MongoDB Atlas)
- **Clerk account** for authentication
- **Google AI API key** (Gemini API key)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd weavyai
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# MongoDB Database
MONGODB_URI=your_mongodb_connection_string
# or
DATABASE_URL=your_mongodb_connection_string

# Google AI (Gemini) API
GOOGLE_API_KEY=your_google_api_key
# or
GEMINI_API_KEY=your_gemini_api_key

# Clerk Webhook Secret (for webhooks)
CLERK_WEBHOOK_SECRET=your_webhook_secret
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
weavyai/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   ├── generate/     # AI generation endpoint
│   │   │   ├── workflows/    # Workflow CRUD operations
│   │   │   └── webhooks/     # Clerk webhooks
│   │   ├── page.tsx          # Home page
│   │   ├── weavy/            # Alternative home page
│   │   ├── start-now/         # Workflow management page
│   │   ├── workflow/[id]/    # Workflow editor page
│   │   └── layout.tsx        # Root layout
│   ├── components/            # React components
│   │   ├── home/             # Home page components
│   │   │   ├── Hero.tsx      # Hero section
│   │   │   ├── ModelsSection.tsx
│   │   │   ├── WorkflowSection.tsx
│   │   │   └── ...
│   │   ├── nodes/            # Workflow node components
│   │   │   ├── TextNode.tsx
│   │   │   ├── ImageNode.tsx
│   │   │   └── LLMNode.tsx
│   │   └── ...
│   ├── lib/                   # Utility functions
│   │   └── mongodb.ts         # Database connection
│   ├── models/                # Database models
│   │   ├── Workflow.ts        # Workflow schema
│   │   └── User.ts            # User schema
│   ├── store/                 # State management
│   │   └── workflowStore.ts   # Zustand store
│   └── middleware.ts          # Next.js middleware
├── public/                    # Static assets
├── package.json
└── README.md
```

## 🎮 How to Use

### Creating a Workflow

1. **Sign in** - Use the "Start Now" button to sign in with Clerk
2. **Create new workflow** - Click "Create New" on the start page
3. **Add nodes** - Use the sidebar to add:
   - Text nodes for text input
   - Image nodes for images
   - LLM nodes for AI processing
4. **Connect nodes** - Drag from output handles to input handles
5. **Configure nodes** - Click on nodes to edit their settings
6. **Run workflow** - Click "Run" on individual nodes or "Run All" to execute the entire workflow
7. **Save** - Your workflow auto-saves as you work

### Workflow Editor Features

- **Arrow Mode** (Select): Click the arrow icon to select and move nodes
- **Hand Mode** (Pan): Click the hand icon to pan the canvas
- **Undo/Redo**: Use Ctrl+Z / Ctrl+Y or the toolbar buttons
- **Export**: Click the export button to download your workflow as JSON
- **Sidebar**: Collapse/expand the sidebar using the button on the right edge

## 🔌 API Endpoints

### Workflows

- `GET /api/workflows` - Get all workflows for the current user
- `POST /api/workflows` - Create a new workflow
- `GET /api/workflows/[id]` - Get a specific workflow
- `PUT /api/workflows/[id]` - Update a workflow
- `DELETE /api/workflows/[id]` - Delete a workflow

### AI Generation

- `POST /api/generate` - Generate AI content using Gemini
  - Body: `{ model, systemPrompt, userMessage, images }`
  - Returns: Generated text or image

### Webhooks

- `POST /api/webhooks/clerk` - Clerk webhook handler for user events

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Key Technologies Explained

- **ReactFlow**: Provides the node-based editor interface
- **GSAP**: Handles animations and scroll-triggered effects
- **Zustand**: Manages workflow state (nodes, edges, history)
- **Clerk**: Handles user authentication
- **Mongoose**: Manages database operations

## 🚢 Deployment

### Environment Variables for Production

Make sure to set all environment variables in your hosting platform:

- Vercel: Add variables in Project Settings → Environment Variables
- Other platforms: Follow their specific instructions

### Recommended Platforms

- **Vercel** (recommended) - Optimized for Next.js
- **Netlify** - Good alternative
- **Railway** - Easy MongoDB integration
- **Render** - Simple deployment

## 🔒 Security

- All API routes are protected with Clerk authentication
- User workflows are isolated by user ID
- Environment variables are never exposed to the client
- MongoDB connection uses secure connection strings

## 🐛 Troubleshooting

### Common Issues

1. **"MongoDB connection failed"**
   - Check your `MONGODB_URI` in `.env.local`
   - Ensure MongoDB is running (if local) or your Atlas cluster is accessible

2. **"Clerk authentication not working"**
   - Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
   - Check Clerk dashboard for correct configuration

3. **"AI generation failing"**
   - Verify `GOOGLE_API_KEY` is set correctly
   - Check API quota and limits in Google Cloud Console

4. **"Workflows not saving"**
   - Check MongoDB connection
   - Verify user is authenticated
   - Check browser console for errors

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For questions or issues, please contact the project maintainers.

## 📞 Support

For support, please contact the development team or open an issue in the repository.

---

**Built with ❤️ using Next.js, React, and AI**
