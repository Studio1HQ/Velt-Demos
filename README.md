<div align="center">

<img src="https://raw.githubusercontent.com/Studio1HQ/Studio1HQ/main/assets/banners/Velt-Demos.webp" alt="Velt Demos: PDF, Whiteboard and Notes: Three Velt collaboration demos: a PDF reviewer, a whiteboard and a notes editor" width="100%" />

<br />
<br />

# Velt Demos: PDF, Whiteboard and Notes

### Three Velt collaboration demos: a PDF reviewer, a whiteboard and a notes editor

A collection of three apps built with Velt: a PDF reviewer with text comments, an Excalidraw-style whiteboard with CRDT sync, and an Obsidian-style notes editor with CRDT editing.

<br />

[![Built by Studio1](https://img.shields.io/badge/Built_by_Studio1-f97316?style=for-the-badge&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgMTYwIiBmaWxsPSJub25lIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTAgMzVDMCAxNi42ODA3IDE0LjA3NDQgMS42NDg0NCAzMiAwLjEyNjk1M1YxNDFINTEuMDUyM0M1Mi40MzA4IDEzNy4zNDQgNTQuNzQ0NiAxMzMuNjg5IDU3Ljk5MzggMTMwLjAzM0M2MS4xNDQ2IDEyNi41MDggNjQuNjg5MiAxMjMuNDQgNjguNjI3NyAxMjAuODI5QzcyLjU2NjIgMTE4LjM0OSA3Ni4zNTY5IDExNi43ODIgODAgMTE2LjEyOVY4Ni43NTQ0Qzc1LjQ3MDggODcuOTI5MiA3MS4zODQ2IDg5LjY5MTkgNjcuNzQxNSA5Mi4wNDE1QzY0IDk0LjUyMjUgNjAuNzUwOCA5Ny40NiA1Ny45OTM4IDEwMC44NTRDNTYuNTM0NSAxMDIuNzIgNTUuMjU0NSAxMDQuNjU5IDU0LjE1MzkgMTA2LjY3MVYwSDEyNUMxNDQuMzMgMCAxNjAgMTUuNjY5OSAxNjAgMzVWMTI1QzE2MCAxNDQuMzMgMTQ0LjMzIDE2MCAxMjUgMTYwSDEyNFYxOEgxMDQuOTQ4QzEwMy41NjkgMjEuNjgxNiAxMDEuMjU1IDI1LjM2MjggOTguMDA2MiAyOS4wNDQ0Qzk0Ljg1NTQgMzIuNTk0MiA5MS4zMTA4IDM1LjY4NDEgODcuMzcyMyAzOC4zMTRDODMuNDMzOCA0MC44MTIgNzkuNjQzMSA0Mi4zODk2IDc2IDQzLjA0NzRWNzIuNjMwNEM4MC41MjkyIDcxLjQ0NzMgODQuNjE1NCA2OS42NzI0IDg4LjI1ODUgNjcuMzA1N0M5MiA2NC44MDc2IDk1LjI0OTIgNjEuODQ5MSA5OC4wMDYyIDU4LjQzMDdDOTkuNDY1NSA1Ni41NTEzIDEwMC43NDUgNTQuNTk4NiAxMDEuODQ2IDUyLjU3MjNWMTYwSDM1QzE1LjY3IDE2MCAwIDE0NC4zMyAwIDEyNVYzNVoiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4K)](https://studio1hq.com)
[![Built with Velt](https://img.shields.io/badge/Built_with_Velt-141414?style=for-the-badge)](https://velt.dev)
[![Live demo](https://img.shields.io/badge/Live_demo-1c1917?style=for-the-badge&logo=vercel&logoColor=white)](https://velt-pdf-editor.vercel.app)

[Velt docs](https://docs.velt.dev) &nbsp;·&nbsp; [Velt](https://velt.dev) &nbsp;·&nbsp; [More examples](https://github.com/Studio1HQ) &nbsp;·&nbsp; [studio1hq.com](https://studio1hq.com)

</div>

<br />

## Overview

This repo holds three standalone demo apps that show [Velt](https://velt.dev) collaboration in familiar app styles. Each app lives in its own folder with its own `package.json` and README.

| Demo | Folder | What it shows |
| --- | --- | --- |
| PDF reviewer | `adobe-pdf-velt-demo` | Text-mode comments on PDF pages, a comments sidebar, presence and notifications. |
| Whiteboard | `excalidraw-velt-demo` | Canvas drawing with live cursors, canvas-anchored comments, huddles and a Velt CRDT store. |
| Notes editor | `obsidian-velt-demo` | Obsidian-style editor with TipTap, Velt CRDT editing, comments, presence and huddle, in vanilla TypeScript. |

<p align="center"><img src="excalidraw-velt-demo/public/ss.png" alt="Excalidraw-style whiteboard with Velt" width="100%" /></p>

## Features

- **PDF comments**: `VeltComments` in text mode over a `react-pdf` viewer, with a comments sidebar, presence, notifications, page navigation, zoom and download.
- **Whiteboard drawing**: Infinite canvas with pan and zoom, and pen, rectangle, circle, diamond, line, arrow and text tools.
- **Canvas comments**: Comments anchored to canvas coordinates or to a specific shape.
- **Live cursors and huddles**: `VeltCursor`, `VeltPresence` and `VeltHuddleTool` in the whiteboard.
- **CRDT sync**: The whiteboard uses `useVeltCrdtStore`, and the notes editor uses the Velt TipTap CRDT extension (Yjs-based) for conflict-free multi-user editing.
- **Obsidian-style UI**: Three-panel layout with sidebar and table of contents, graph view of document sections, properties panel, and bubble menu with comment button.
- **Demo users**: User switching with `?user=0` / `?user=1` (PDF), random user assignment (whiteboard), and a user switcher (notes: Ash Ketchum and Misty).
- **Dark mode**: All three apps support dark and light themes, synced with Velt's UI.

## Tech stack

| Layer | Tool |
| --- | --- |
| Frameworks | [Next.js](https://nextjs.org) 16 and [React](https://react.dev) (PDF and whiteboard), [Vite](https://vitejs.dev) with vanilla TypeScript (notes) |
| Collaboration | [Velt](https://velt.dev) (`@veltdev/react`, `@veltdev/client`, `@veltdev/tiptap-crdt`, `@veltdev/tiptap-velt-comments`) |
| PDF | [react-pdf](https://github.com/wojtekmaj/react-pdf) |
| Editor | [TipTap](https://tiptap.dev) and [Yjs](https://yjs.dev) |
| Styling | [Tailwind CSS](https://tailwindcss.com) 4, [Lucide](https://lucide.dev) |

## Getting started

### Prerequisites

- Node.js 18 or later
- npm 8 or later, or bun, yarn or pnpm
- A Velt API key from the [Velt console](https://console.velt.dev). The notes demo also needs an auth token.

### Installation

```bash
git clone https://github.com/Studio1HQ/Velt-Demos.git
cd Velt-Demos
cd adobe-pdf-velt-demo   # or excalidraw-velt-demo, or obsidian-velt-demo
npm install              # or: bun install
```

### Environment variables

| Variable | Used by | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_VELT_API_KEY` | PDF reviewer, whiteboard | Velt API key. Put it in `.env.local` (PDF) or `.env` (whiteboard). |
| `VITE_VELT_API_KEY` | Notes editor | Velt API key. Copy `.env.example` to `.env.local`. |
| `VITE_VELT_AUTH_TOKEN` | Notes editor | Velt auth token from the Velt console. |

### Run

```bash
npm run dev     # or: bun dev
```

Next.js demos run at `http://localhost:3000`. The notes demo (Vite) runs at `http://localhost:5173`. Production: `npm run build`, then `npm run start` (Next.js) or `npm run preview` (Vite).

To test collaboration, open the app in a normal window and an incognito window so each gets a different user.

## How it works

PDF reviewer (`adobe-pdf-velt-demo`):

- `app/providers/VeltProviderWrapper.tsx` initialises Velt with `authProvider` for the current mock user and retry config.
- `app/components/PDFEditor.tsx` calls `client.setDocuments(...)` with the PDF name and `client.setLocation(...)` per page (`page-<n>`), so comments are scoped to a page. It also uses `useCommentAnnotations`.
- Components: `LeftToolbar`, `navbar`, `UserSwitcher`, `VeltCommentSetup`, plus context for editor and theme state.

Whiteboard (`excalidraw-velt-demo`):

- `components/velt/VeltSetup.tsx` identifies a random one of two hardcoded users.
- `app/page.tsx` adds canvas comments with `client.getCommentElement().addManualComment({ context: { x, y, canvasId: "whiteboard", elementId } })`.
- `lib/useWhiteboardStore.ts`, `lib/storageProxy.ts` and `useVeltCrdtStore` handle shared state.
- It was built with an AI IDE and the Velt Installer MCP to configure the SDK and CRDT.

Notes editor (`obsidian-velt-demo`):

- `src/lib/velt.ts` initialises the Velt client, auth and document. `src/lib/document.ts` manages the document ID from URL params.
- `src/components/document/tiptap/` builds the TipTap editor with `createVeltTipTapStore`, custom inline heading marks (H1 to H3) and a bubble menu toolbar.
- `src/components/velt/` wires comments, sidebar, presence, huddle and notifications. Graph, sidebar, properties panel and user switcher are in `src/components/`.
- The sample document is the "Attention Is All You Need" paper.

## Resources

- [PDF reviewer demo](https://velt-pdf-editor.vercel.app): deployed PDF demo (repo homepage). The PDF README also lists https://velt-pdf-comment.vercel.app.
- [Whiteboard demo](https://velt-excalidraw.vercel.app): deployed Excalidraw-style demo.
- [Velt documentation](https://docs.velt.dev): SDK guides.
- [Velt console](https://console.velt.dev): API key and auth token.
- [Velt](https://velt.dev): product site.
- [TipTap](https://tiptap.dev/docs): editor docs.

## License

Released under the [MIT License](LICENSE).

<br />

---

<div align="center">

<a href="https://studio1hq.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/Studio1HQ/website/main/brand/studio1-logo-on-dark.svg" />
    <img src="https://raw.githubusercontent.com/Studio1HQ/website/main/brand/studio1-logo-on-light.svg" alt="Studio1" width="160" />
  </picture>
</a>

Built by **[Studio1](https://studio1hq.com)**, the technical content and DevRel partner for devtool teams. Made with [Velt](https://velt.dev).<br />
Browse more open-source examples at [github.com/Studio1HQ](https://github.com/Studio1HQ).

[![Website](https://img.shields.io/badge/studio1hq.com-0b0807?style=for-the-badge&logo=googlechrome&logoColor=white)](https://studio1hq.com)
[![Book a call](https://img.shields.io/badge/Book_a_strategy_call-f97316?style=for-the-badge&logo=googlecalendar&logoColor=white)](https://cal.com/studio1/collab)
[![X](https://img.shields.io/badge/%40Studio1HQ-141414?style=for-the-badge&logo=x&logoColor=white)](https://x.com/Studio1HQ)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0a66c2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/studio1hq/)

<sub><a href="https://studio1hq.com">studio1hq.com</a> · Technical content, docs, video and DevRel for devtools</sub>

</div>
