import { subscribeToTheme, getTheme } from "../../lib/theme";

/**
 * Creates Velt tool web components (sidebar button, huddle, notifications).
 * Note: velt-presence is now rendered inside the user-switcher component.
 */
export function createVeltTools(container: HTMLElement) {
  const wrapper = document.createElement("div");
  wrapper.className = "velt-tools-container";

  const sidebarButton = document.createElement("velt-sidebar-button");
  wrapper.appendChild(sidebarButton);

  const huddleTool = document.createElement("velt-huddle-tool");
  huddleTool.setAttribute("type", "all");
  wrapper.appendChild(huddleTool);

  const notificationsTool = document.createElement("velt-notifications-tool");
  notificationsTool.setAttribute("settings", "true");
  notificationsTool.setAttribute("shadow-dom", "false");
  wrapper.appendChild(notificationsTool);

  container.appendChild(wrapper);

  function applyDarkMode() {
    const isDark = getTheme() === "dark";
    const elements = wrapper.querySelectorAll(
      "velt-sidebar-button, velt-huddle-tool, velt-notifications-tool",
    );
    elements.forEach((el) => {
      if (isDark) {
        el.setAttribute("dark-mode", "true");
      } else {
        el.removeAttribute("dark-mode");
      }
    });
  }

  applyDarkMode();
  subscribeToTheme(() => applyDarkMode());

  return {
    el: wrapper,
    destroy() {
      wrapper.remove();
    },
  };
}

export function configureNotificationsTool(veltClient: any) {
  if (!veltClient) return;

  try {
    const notificationElement = veltClient.getNotificationElement();
    if (notificationElement) {
      notificationElement.setTabConfig({
        forYou: { name: "For You", enable: true },
        documents: { name: "Documents", enable: true },
        all: { name: "All", enable: true },
      });
    }
  } catch (error) {
    console.warn("[VeltTools] Failed to configure notifications:", error);
  }
}
