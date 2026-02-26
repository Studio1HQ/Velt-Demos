import "../styles/globals.css";
import "../styles/tiptap.css";
import "./components/velt/ui-customization/styles.css";

import { initializeUser } from "./lib/user";
import { initializeDocument } from "./lib/document";
import { initializeVelt, authenticateUser, setVeltDocument, setVeltDarkMode } from "./lib/velt";
import { initializeTheme, getTheme } from "./lib/theme";
import { configureNotificationsTool } from "./components/velt/velt-tools";
import { createVeltCollaboration } from "./components/velt/velt-collaboration";

import { createSidebar } from "./components/sidebar/sidebar";
import { createToolbar } from "./components/toolbar/toolbar";
import { createPropertiesPanel } from "./components/properties/properties-panel";
import { createTipTapEditor } from "./components/document/tiptap/tiptap";
import { createGraphView } from "./components/graph/graph-view";

let editorInstance: any = null;
let graphInstance: any = null;
let sidebarInstance: any = null;
let propertiesInstance: any = null;
let activeView: "editor" | "graph" = "editor";
let sidebarOpen = true;
let propertiesOpen = true;

function waitForVeltInitState(
  veltClient: any,
  timeout = 30000,
): Promise<boolean> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const subscription = veltClient
      .getVeltInitState()
      .subscribe((state: any) => {
        if (state === true) {
          subscription?.unsubscribe();
          resolve(true);
          return;
        }
        if (Date.now() - startTime > timeout) {
          subscription?.unsubscribe();
          resolve(false);
        }
      });

    setTimeout(() => {
      subscription?.unsubscribe();
      resolve(false);
    }, timeout);
  });
}

async function init() {
  console.log("[App] Starting initialization...");

  const app = document.getElementById("app");
  if (!app) return;

  initializeTheme();

  app.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; width: 100vw; background: var(--bg-primary);">
      <div style="text-align: center; color: var(--text-muted);">
        <div style="margin-bottom: 16px;">
          <div style="width: 32px; height: 32px; border: 2px solid transparent; border-bottom-color: var(--accent); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
        </div>
        <p>Initializing collaboration...</p>
      </div>
    </div>
    <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
  `;

  try {
    const user = initializeUser();
    if (!user) throw new Error("Failed to initialize user");
    console.log("[App] User:", user.name);

    const doc = initializeDocument();
    if (!doc.documentId) throw new Error("Failed to initialize document");
    console.log("[App] Document:", doc.documentId);

    const veltClient = await initializeVelt();
    if (!veltClient) throw new Error("Failed to initialize Velt");

    await authenticateUser(user);
    await setVeltDocument(doc.documentId, doc.documentName);
    configureNotificationsTool(veltClient);

    app.innerHTML = "";

    const layout = document.createElement("div");
    layout.className = "obsidian-layout";
    app.appendChild(layout);

    const sidebarContainer = document.createElement("div");
    layout.appendChild(sidebarContainer);

    sidebarInstance = createSidebar(sidebarContainer, {
      onScrollToHeading: (headingText: string) => {
        if (activeView === "graph") {
          switchView("editor");
          setTimeout(() => scrollToSection(headingText), 200);
        } else {
          scrollToSection(headingText);
        }
      },
    });

    const mainSection = document.createElement("div");
    mainSection.className = "obsidian-main";
    layout.appendChild(mainSection);

    const toolbarContainer = document.createElement("div");
    mainSection.appendChild(toolbarContainer);

    createToolbar(toolbarContainer, {
      onToggleSidebar: () => {
        sidebarOpen = !sidebarOpen;
        sidebarInstance?.setCollapsed(!sidebarOpen);
      },
      onToggleProperties: () => {
        propertiesOpen = !propertiesOpen;
        propertiesInstance?.setCollapsed(!propertiesOpen);
      },
      onSwitchView: (view) => switchView(view),
    });

    const contentArea = document.createElement("div");
    contentArea.className = "obsidian-content";
    mainSection.appendChild(contentArea);

    const editorArea = document.createElement("div");
    editorArea.className = "editor-area";
    editorArea.id = "editor-view";

    const editorHeader = document.createElement("div");
    editorHeader.className = "editor-header";
    editorHeader.innerHTML = `
      <h2>Attention Is All You Need</h2>
      <div class="meta">Collaborative document · CRDT synced</div>
    `;
    editorArea.appendChild(editorHeader);

    const editorScroll = document.createElement("div");
    editorScroll.className = "editor-content";
    editorScroll.id = "editor-scroll-container";

    const editorContainer = document.createElement("div");
    editorContainer.id = "tiptap-editor-container";
    editorContainer.className = "tiptap-editor-content";
    editorScroll.appendChild(editorContainer);
    editorArea.appendChild(editorScroll);

    contentArea.appendChild(editorArea);

    const graphArea = document.createElement("div");
    graphArea.id = "graph-view";
    graphArea.style.display = "none";
    graphArea.style.flex = "1";
    contentArea.appendChild(graphArea);

    const propertiesContainer = document.createElement("div");
    propertiesContainer.id = "properties-container";
    contentArea.appendChild(propertiesContainer);
    propertiesInstance = createPropertiesPanel(propertiesContainer);

    console.log("[App] Waiting for Velt init state...");
    await waitForVeltInitState(veltClient);
    console.log("[App] Velt initialized, creating editor...");

    editorInstance = await createTipTapEditor(
      editorContainer,
      veltClient,
      doc.documentId,
      user,
    );
    console.log("[App] Editor created successfully");

    createVeltCollaboration(app);

    setVeltDarkMode(getTheme() === "dark");
    setTimeout(() => setVeltDarkMode(getTheme() === "dark"), 1000);
    setTimeout(() => setVeltDarkMode(getTheme() === "dark"), 3000);

    console.log("[App] Initialization complete!");
  } catch (error: any) {
    console.error("[App] Initialization failed:", error);
    app.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100vh; width: 100vw; background: var(--bg-primary);">
        <div style="text-align: center; color: var(--text-muted);">
          <p style="font-size: 18px; margin-bottom: 8px;">Failed to initialize</p>
          <p style="opacity: 0.7;">${error.message}</p>
          <button
            onclick="window.location.reload()"
            style="margin-top: 16px; padding: 8px 16px; background: rgba(124, 58, 237, 0.2); border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 4px; color: var(--text-secondary); cursor: pointer;"
          >
            Retry
          </button>
        </div>
      </div>
    `;
  }
}

function scrollToSection(label: string) {
  const scrollContainer = document.getElementById("editor-scroll-container");
  if (!scrollContainer) return;

  const headings = scrollContainer.querySelectorAll("[data-heading]");
  const labelLower = label.toLowerCase().trim();

  let target: Element | null = null;
  for (const h of Array.from(headings)) {
    const text = h.textContent?.toLowerCase().trim() || "";
    if (text === labelLower) {
      target = h;
      break;
    }
  }
  if (!target) {
    for (const h of Array.from(headings)) {
      const text = h.textContent?.toLowerCase().trim() || "";
      if (text.includes(labelLower) || labelLower.includes(text)) {
        target = h;
        break;
      }
    }
  }

  if (target) {
    const containerRect = scrollContainer.getBoundingClientRect();
    const headingRect = target.getBoundingClientRect();
    const scrollTop =
      headingRect.top - containerRect.top + scrollContainer.scrollTop;
    scrollContainer.scrollTo({ top: scrollTop - 50, behavior: "smooth" });

    const paragraph = target.closest("p") || target.parentElement;
    if (paragraph) {
      paragraph.style.transition = "background-color 0.3s ease";
      paragraph.style.backgroundColor = "rgba(124, 58, 237, 0.2)";
      paragraph.style.borderRadius = "4px";
      setTimeout(() => {
        paragraph.style.backgroundColor = "transparent";
        setTimeout(() => {
          paragraph.style.transition = "";
          paragraph.style.borderRadius = "";
        }, 300);
      }, 1200);
    }
  }
}

function switchView(view: "editor" | "graph") {
  activeView = view;

  const editorEl = document.getElementById("editor-view");
  const graphEl = document.getElementById("graph-view");
  const propsEl = document.getElementById("properties-container");

  if (view === "editor") {
    if (editorEl) editorEl.style.display = "flex";
    if (graphEl) graphEl.style.display = "none";
    if (propsEl) propsEl.style.display = "";
    propertiesInstance?.setCollapsed(!propertiesOpen);

    if (graphInstance) {
      graphInstance.destroy();
      graphInstance = null;
    }
  } else {
    if (editorEl) editorEl.style.display = "none";
    if (graphEl) {
      graphEl.style.display = "flex";
      graphEl.innerHTML = "";
      graphInstance = createGraphView(graphEl, (label) => {
        switchView("editor");
        setTimeout(() => {
          scrollToSection(label);
        }, 200);
      });
    }
    if (propsEl) propsEl.style.display = "none";
  }
}

function cleanup() {
  editorInstance?.destroy();
  graphInstance?.destroy();
  sidebarInstance?.destroy();
  propertiesInstance?.destroy();
}

window.addEventListener("beforeunload", cleanup);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
