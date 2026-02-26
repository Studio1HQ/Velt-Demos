import { createVeltTools } from "../velt/velt-tools";
import { createUserSwitcher } from "../user-switcher/user-switcher";
import { getTheme, toggleTheme, subscribeToTheme } from "../../lib/theme";

interface ToolbarOptions {
  onToggleSidebar: () => void;
  onToggleProperties: () => void;
  onSwitchView: (view: "editor" | "graph") => void;
}

export function createToolbar(container: HTMLElement, options: ToolbarOptions) {
  const { onToggleSidebar, onToggleProperties, onSwitchView } = options;

  let activeView: "editor" | "graph" = "editor";
  let propertiesOpen = true;

  const toolbar = document.createElement("div");
  toolbar.className = "obsidian-toolbar";

  function render() {
    const theme = getTheme();

    toolbar.innerHTML = `
      <div style="display: flex; align-items: center; gap: 4px;">
        <button id="btn-sidebar" title="Toggle sidebar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="obsidian-view-tabs">
        <button class="obsidian-view-tab ${activeView === "editor" ? "active" : ""}" id="tab-editor">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          Editor
        </button>
        <button class="obsidian-view-tab ${activeView === "graph" ? "active" : ""}" id="tab-graph">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="6" y1="3" x2="6" y2="15"></line>
            <circle cx="18" cy="6" r="3"></circle>
            <circle cx="6" cy="18" r="3"></circle>
            <path d="M18 9a9 9 0 0 1-9 9"></path>
          </svg>
          Graph
        </button>
      </div>

      <div style="display: flex; align-items: center; gap: 8px;">
        <div id="velt-tools-slot"></div>

        <div style="width: 1px; height: 20px; background: var(--border-light);"></div>

        <div id="user-presence-slot" style="display: flex; align-items: center;"></div>

        <div style="width: 1px; height: 20px; background: var(--border-light);"></div>

        <button id="btn-properties" class="${propertiesOpen ? "active" : ""}" title="Toggle properties">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="14" y="3" width="7" height="18" rx="2"></rect>
            <rect x="3" y="3" width="7" height="18" rx="2"></rect>
          </svg>
        </button>

        <button id="btn-theme" title="Toggle theme">
          ${
            theme === "dark"
              ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
              : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'
          }
        </button>
      </div>
    `;

    const veltSlot = toolbar.querySelector("#velt-tools-slot");
    if (veltSlot) {
      createVeltTools(veltSlot as HTMLElement);
    }

    const presenceSlot = toolbar.querySelector("#user-presence-slot");
    if (presenceSlot) {
      createUserSwitcher(presenceSlot as HTMLElement);
    }

    toolbar
      .querySelector("#btn-sidebar")
      ?.addEventListener("click", onToggleSidebar);

    toolbar.querySelector("#tab-editor")?.addEventListener("click", () => {
      activeView = "editor";
      onSwitchView("editor");
      render();
    });

    toolbar.querySelector("#tab-graph")?.addEventListener("click", () => {
      activeView = "graph";
      onSwitchView("graph");
      render();
    });

    toolbar.querySelector("#btn-properties")?.addEventListener("click", () => {
      propertiesOpen = !propertiesOpen;
      onToggleProperties();
      render();
    });

    toolbar.querySelector("#btn-theme")?.addEventListener("click", () => {
      toggleTheme();
    });
  }

  render();

  subscribeToTheme(() => render());

  container.appendChild(toolbar);

  return {
    el: toolbar,
    getActiveView() {
      return activeView;
    },
    destroy() {
      toolbar.remove();
    },
  };
}
