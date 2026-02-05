# Adobe PDF Editor Clone with Velt Collaboration

A PDF Editor-inspired document collaboration app built with Next.js, React-PDF, and Velt, demonstrating real-time inline commenting and multi-user collaboration features on PDF documents.

## ✨ Features

- **📄 PDF Viewing** — High-fidelity PDF rendering powered by React-PDF
- **💬 Velt Comments** — Add context-aware comments directly on the PDF
- **🧑‍🤝‍🧑 Multi-User Collaboration** — Switch between predefined users (User 1, User 2) with unique avatars
- **🔴 Real-Time Presence** — See who else is viewing the document
- **🔔 Notifications** — In-app notification system powered by Velt
- **📋 Comments Sidebar** — Manage and review all document comments
- **🌓 Dark/Light Theme** — Toggle between themes with persistent preference
- **🎨 Modern UI** — Built with Tailwind CSS and Lucide React icons
- **🛠️ Toolbar Tools** — Select, Comment, Draw, Add Image, and Text tools

## 🛠 Tech Stack

| Category             | Technology               |
| -------------------- | ------------------------ |
| **Framework**        | Next.js 13+ (App Router) |
| **UI Library**       | React 18                 |
| **PDF Engine**       | react-pdf                |
| **Collaboration**    | Velt SDK                 |
| **Styling**          | Tailwind CSS             |
| **Icons**            | Lucide React             |
| **Language**         | TypeScript               |
| **State Management** | React Context API        |

## 📋 Prerequisites

- Node.js v16 or higher
- npm v8 or higher (or bun/yarn/pnpm)
- A Velt API Key — [Get one free](https://velt.dev)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd adobe-pdf-velt-demo
```

### 2. Install Dependencies

```bash
npm install
# or
bun install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_VELT_API_KEY=your_velt_api_key_here
```

💡 **Tip:** Get your API key from the [Velt Dashboard](https://dashboard.velt.dev)

### 4. Start Development Server

```bash
npm run dev
# or
bun dev
```

### 5. Open in Browser

Navigate to `http://localhost:3000`

## 📁 Project Structure

```
adobe-pdf-velt-demo/
├── app/
│   ├── components/
│   │   ├── LeftToolbar.tsx      # Editor tools (Select, Draw, etc.)
│   │   ├── Navbar.tsx           # Top navigation with user/theme controls
│   │   ├── PDFEditor.tsx        # Main PDF handling component
│   │   ├── UserSwitcher.tsx     # Mock user switching logic
│   │   └── VeltCommentSetup.tsx # Velt initialization and setup
│   ├── context/
│   │   ├── PDFEditorContext.tsx # Global state for PDF editor
│   │   └── ThemeContext.tsx     # Dark/Light mode state
│   ├── data/
│   │   └── data.ts              # Mock user data
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Entry point
├── public/                      # Static assets (PDF files)
└── tailwind.config.ts           # Tailwind configuration
```

## 🔗 Velt Integration

This project demonstrates Velt's integration for adding collaborative features to a React application.

### Velt Components Used

| Component               | Purpose                                                    |
| ----------------------- | ---------------------------------------------------------- |
| `VeltProvider`          | Main provider wrapping the app for Velt SDK initialization |
| `VeltComments`          | Component handling the comment threads and rendering       |
| `VeltCommentsSidebar`   | Sidebar panel showing all comments in a list view          |
| `VeltSidebarButton`     | Toggle button to open/close the comments sidebar           |
| `VeltCommentTool`       | Trigger for adding new comments                            |
| `VeltPresence`          | Displays active users viewing the document                 |
| `VeltNotificationsTool` | Shows notification bell with comment updates               |

### Integration Logic

The setup is primarily handled in `app/components/VeltCommentSetup.tsx` and `app/components/Navbar.tsx`.

```typescript
// Example initialization
const { client } = useVeltClient();

useEffect(() => {
  if (client) {
    client.setDocuments([
      {
        id: "unique-document-id",
        metadata: { documentName: "Sample PDF" },
      },
    ]);
  }
}, [client]);
```

## 🎯 How to Use

1.  **Switch Users**: Click the user avatar in the top right to switch between different mock users.
2.  **Add Comments**: Click the **Comment** tool in the left toolbar (or the speech bubble button) and click anywhere on the PDF to leave a comment.
3.  **View Sidebar**: Click the sidebar icon in the navbar to toggle the comments panel.
4.  **Toggle Theme**: Use the Moon/Sun icon in the navbar to switch between light and dark modes.
5.  **Use Tools**: Select the "Draw" tool to annotate freehand, or "Image" to upload overlays.

## 📚 Documentation & Resources

- **Velt**: [Documentation](https://docs.velt.dev) | [API Reference](https://docs.velt.dev/api-reference)
- **React-PDF**: [Documentation](https://github.com/wojtekmaj/react-pdf)
- **Next.js**: [Documentation](https://nextjs.org/docs)
- **Tailwind CSS**: [Documentation](https://tailwindcss.com/docs)
- **Lucide React**: [Icons](https://lucide.dev)
