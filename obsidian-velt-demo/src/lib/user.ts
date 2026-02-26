export interface DemoUser {
  userId: string;
  name: string;
  email: string;
  organizationId: string;
  photoUrl: string;
  color: string;
}

export const DEMO_USERS: DemoUser[] = [
  {
    userId: "user-ash",
    name: "Ash Ketchum",
    email: "ash@example.com",
    organizationId: "obsidian-velt-demo-org",
    photoUrl:
      "https://ui-avatars.com/api/?name=Ash+Ketchum&background=7c3aed&color=fff&size=128",
    color: "#7c3aed",
  },
  {
    userId: "user-misty",
    name: "Misty",
    email: "misty@example.com",
    organizationId: "obsidian-velt-demo-org",
    photoUrl:
      "https://ui-avatars.com/api/?name=Misty&background=6366f1&color=fff&size=128",
    color: "#6366f1",
  },
];

const STORAGE_KEY = "obsidian-velt-user-index";

let currentUserIndex: number = 0;

export function getCurrentUserIndex(): number {
  return currentUserIndex;
}

export function getUser(): DemoUser {
  return DEMO_USERS[currentUserIndex];
}

export function initializeUser(): DemoUser {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored !== null) {
    const idx = parseInt(stored, 10);
    if (idx >= 0 && idx < DEMO_USERS.length) {
      currentUserIndex = idx;
    }
  }
  return DEMO_USERS[currentUserIndex];
}

/**
 * Switch user by saving the new index and reloading the page.
 * A full reload is necessary because the CRDT store, CollaborationCaret,
 * Velt comment subscriptions, and presence all bind to the authenticated
 * user at initialization time. Re-identifying alone does not rebind them.
 */
export async function switchUser(
  index: number,
  _onUpdateUI?: () => void,
): Promise<void> {
  if (index < 0 || index >= DEMO_USERS.length || index === currentUserIndex)
    return;

  // Show a loading overlay while the page reloads
  const overlay = document.createElement("div");
  overlay.id = "velt-loading-overlay";
  overlay.style.cssText =
    "position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(14, 14, 14, 0.85);backdrop-filter:blur(6px);z-index:99999;display:flex;align-items:center;justify-content:center;color:white;font-family:sans-serif;font-size:16px;";
  overlay.innerHTML =
    "<div style='display:flex;flex-direction:column;align-items:center;gap:16px;'>" +
    "<div style='width:32px;height:32px;border:3px solid #333;border-top-color:#7c3aed;border-radius:50%;animation:spin 1s linear infinite;'></div>" +
    "<p style='color:#ccc'>Switching to " + DEMO_USERS[index].name + "...</p>" +
    "</div><style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>";
  document.body.appendChild(overlay);

  // Persist selection and reload — on next load, initializeUser() picks it up
  sessionStorage.setItem(STORAGE_KEY, index.toString());

  // Small delay so the overlay is visible before the reload
  await new Promise((r) => setTimeout(r, 150));
  window.location.reload();
}
