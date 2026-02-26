import { DEMO_USERS, getCurrentUserIndex, switchUser, type DemoUser } from "../../lib/user";
import { subscribeToTheme, getTheme } from "../../lib/theme";

let dropdownOpen = false;

/**
 * Single avatar that serves as both presence indicator and user switcher.
 * Shows one avatar with an online dot; dropdown reveals who's online + switch user list.
 */
export function createUserSwitcher(container: HTMLElement) {
  const wrapper = document.createElement("div");
  wrapper.id = "user-switcher";
  wrapper.style.cssText = "position: relative; display: inline-flex; align-items: center;";

  let cleanup: (() => void) | null = null;

  function closeDropdown() {
    dropdownOpen = false;
    const dd = wrapper.querySelector("#user-dropdown");
    if (dd) dd.remove();
  }

  function handleOutsideClick(e: MouseEvent) {
    if (!wrapper.contains(e.target as Node)) {
      closeDropdown();
    }
  }

  function render() {
    const currentIndex = getCurrentUserIndex();
    const currentUser = DEMO_USERS[currentIndex];

    // Remove old avatar button
    const existingBtn = wrapper.querySelector("#user-avatar-btn");
    if (existingBtn) existingBtn.remove();

    // Single avatar button with online indicator dot
    const btn = document.createElement("button");
    btn.id = "user-avatar-btn";
    btn.title = `Signed in as ${currentUser.name}`;
    btn.style.cssText = `
      position: relative; display: flex; align-items: center; justify-content: center;
      padding: 0; margin: 0; border: none; background: transparent;
      cursor: pointer; border-radius: 50%; outline: none;
      transition: box-shadow 0.15s ease;
    `;
    btn.innerHTML = `
      <img
        src="${currentUser.photoUrl}"
        alt="${currentUser.name}"
        style="
          width: 28px; height: 28px; border-radius: 50%;
          border: 2px solid ${currentUser.color};
          object-fit: cover;
        "
      />
      <span style="
        position: absolute; bottom: -1px; right: -1px;
        width: 10px; height: 10px; border-radius: 50%;
        background: #22c55e;
        border: 2px solid var(--bg-primary);
      "></span>
    `;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (dropdownOpen) {
        closeDropdown();
      } else {
        openDropdown(currentIndex);
      }
    });

    wrapper.appendChild(btn);
  }

  function openDropdown(currentIndex: number) {
    closeDropdown();
    dropdownOpen = true;

    const isDark = document.documentElement.classList.contains("dark");

    const dropdown = document.createElement("div");
    dropdown.id = "user-dropdown";
    dropdown.style.cssText = `
      position: absolute; top: calc(100% + 8px); right: 0;
      min-width: 250px; z-index: 9999;
      background: ${isDark ? "#2a2a2a" : "#ffffff"};
      border: 1px solid ${isDark ? "#3a3a3a" : "#e0e0e0"};
      border-radius: 10px;
      box-shadow: ${isDark ? "0 8px 32px rgba(0,0,0,0.6)" : "0 8px 32px rgba(0,0,0,0.15)"};
      padding: 6px 0;
      font-family: Inter, system-ui, sans-serif;
      animation: userDropFadeIn 0.15s ease;
    `;

    // ── Online / Presence section ──
    const presenceHeader = document.createElement("div");
    presenceHeader.style.cssText = `
      padding: 8px 14px 4px; font-size: 10px; text-transform: uppercase;
      letter-spacing: 0.06em; font-weight: 600;
      color: ${isDark ? "#666" : "#aaa"};
      display: flex; align-items: center; gap: 6px;
    `;
    presenceHeader.innerHTML = `
      <span style="width: 6px; height: 6px; border-radius: 50%; background: #22c55e; flex-shrink: 0;"></span>
      Online
    `;
    dropdown.appendChild(presenceHeader);

    const presenceRow = document.createElement("div");
    presenceRow.style.cssText = "padding: 4px 14px 8px;";
    const presenceEl = document.createElement("velt-presence");
    if (isDark) presenceEl.setAttribute("dark-mode", "true");
    presenceRow.appendChild(presenceEl);
    dropdown.appendChild(presenceRow);

    // Divider
    const divider = document.createElement("div");
    divider.style.cssText = `height: 1px; background: ${isDark ? "#3a3a3a" : "#eee"}; margin: 2px 0;`;
    dropdown.appendChild(divider);

    // ── Switch User section ──
    const header = document.createElement("div");
    header.style.cssText = `
      padding: 8px 14px 6px; font-size: 10px; text-transform: uppercase;
      letter-spacing: 0.06em; font-weight: 600;
      color: ${isDark ? "#666" : "#aaa"};
    `;
    header.textContent = "Switch User";
    dropdown.appendChild(header);

    DEMO_USERS.forEach((user: DemoUser, index: number) => {
      const isActive = index === currentIndex;
      const item = document.createElement("div");
      item.style.cssText = `
        display: flex; align-items: center; gap: 10px;
        padding: 8px 14px; cursor: pointer;
        transition: background 0.12s ease;
        ${isActive ? `background: ${isDark ? "rgba(124,58,237,0.1)" : "rgba(124,58,237,0.06)"};` : ""}
      `;
      item.addEventListener("mouseenter", () => {
        item.style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
      });
      item.addEventListener("mouseleave", () => {
        item.style.background = isActive
          ? isDark ? "rgba(124,58,237,0.1)" : "rgba(124,58,237,0.06)"
          : "transparent";
      });

      item.innerHTML = `
        <img
          src="${user.photoUrl}" alt="${user.name}"
          style="width: 34px; height: 34px; border-radius: 50%; border: 2px solid ${user.color}; flex-shrink: 0; object-fit: cover;"
        />
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 13px; font-weight: 500; color: ${isDark ? "#e0e0e0" : "#222"}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${user.name}
          </div>
          <div style="font-size: 11px; color: ${isDark ? "#888" : "#999"}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${user.email}
          </div>
        </div>
        ${isActive ? `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${isDark ? "#a78bfa" : "#7c3aed"}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        ` : ""}
      `;

      if (!isActive) {
        item.addEventListener("click", () => {
          closeDropdown();
          switchUser(index, () => render());
        });
      }

      dropdown.appendChild(item);
    });

    wrapper.appendChild(dropdown);

    // Close on outside click
    setTimeout(() => document.addEventListener("click", handleOutsideClick), 0);
  }

  render();

  const unsubTheme = subscribeToTheme(() => {
    render();
    if (dropdownOpen) {
      closeDropdown();
    }
  });

  cleanup = () => {
    unsubTheme();
    document.removeEventListener("click", handleOutsideClick);
  };

  container.appendChild(wrapper);

  return {
    el: wrapper,
    destroy() {
      cleanup?.();
      wrapper.remove();
    },
  };
}
