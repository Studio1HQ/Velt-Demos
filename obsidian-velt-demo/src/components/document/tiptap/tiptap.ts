import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import BubbleMenu from "@tiptap/extension-bubble-menu";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { createVeltTipTapStore } from "@veltdev/tiptap-crdt";
import {
  TiptapVeltComments,
  addComment,
  renderComments,
} from "@veltdev/tiptap-velt-comments";

import { getVeltClient } from "../../../lib/velt";
import { initialContent } from "./constants";
import { InlineH1, InlineH2, InlineH3 } from "./extensions";
import { createBubbleMenuToolbar } from "./ui/bubble-menu-toolbar";

export async function createTipTapEditor(
  container: HTMLElement,
  veltClient: any,
  editorId: string,
  user: any,
) {
  const loadingSpinner = document.createElement("div");
  loadingSpinner.className = "flex items-center justify-center h-full";
  loadingSpinner.innerHTML = `
    <div class="text-center" style="color: var(--text-muted)">
      <div class="mb-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style="border-color: var(--accent)"></div>
      </div>
      <p>Loading editor...</p>
    </div>
  `;
  container.appendChild(loadingSpinner);

  let editor: Editor | null = null;
  let store: any = null;
  let bubbleMenuElement: HTMLElement | null = null;

  try {
    console.log("[TipTap] Creating Velt TipTap store...");
    store = await createVeltTipTapStore({
      editorId,
      veltClient,
      initialContent,
    });

    if (!store) throw new Error("Failed to create Velt TipTap store");

    console.log("[TipTap] Store created, initializing editor...");

    (window as any).__veltEditorId = editorId;

    container.removeChild(loadingSpinner);

    bubbleMenuElement = document.createElement("div");
    bubbleMenuElement.className = "bubble-menu-container";
    document.body.appendChild(bubbleMenuElement);

    // Debug: Check CRDT store state
    const yXml = store.getYXml();
    const yDoc = store.getYDoc();
    console.log("[TipTap] YXml content:", yXml?.toString());
    console.log("[TipTap] YDoc:", yDoc);
    console.log("[TipTap] Store connected:", store.isConnected());

    const extensions = [
      StarterKit.configure({
        undoRedo: false, // Disable undo/redo — CRDT handles it
        heading: false, // Using custom inline headings
        dropcursor: false, // Disable to avoid conflicts
      }),
      TextAlign.configure({ types: ["paragraph"] }),
      Underline,
      InlineH1,
      InlineH2,
      InlineH3,
      TiptapVeltComments,
      BubbleMenu.configure({
        element: bubbleMenuElement,
        tippyOptions: {
          placement: "top",
          offset: [0, 8],
        },
        shouldShow: ({ editor, from, to }: any) => {
          return from !== to && editor.isEditable;
        },
      } as any),
      store.getCollabExtension(),
      CollaborationCaret.configure({
        provider: store.getStore().getProvider(),
        user: {
          name: user?.name || "Anonymous",
          color:
            user?.color ||
            "#" +
              Math.floor(Math.random() * 16777215)
                .toString(16)
                .padStart(6, "0"),
        },
      }),
    ];

    editor = new Editor({
      element: container,
      extensions,
      content: "",
      editorProps: {
        attributes: {
          class: "prose max-w-none focus:outline-none",
        },
      },
    });

    const bubbleMenuToolbar = createBubbleMenuToolbar({
      editor,
      onAddComment: () => {
        const currentEditorId = (window as any).__veltEditorId;
        try {
          addComment({ editor: editor!, editorId: currentEditorId });
          console.log(
            "[TipTap] addComment called with editorId:",
            currentEditorId,
          );
        } catch (err) {
          console.error("[TipTap] Error calling addComment:", err);
        }
      },
    });
    bubbleMenuElement.appendChild(bubbleMenuToolbar);

    console.log("[TipTap] Editor initialized successfully");

    setTimeout(() => {
      if (editor && editor.isEmpty) {
        console.log("[TipTap] Editor empty, setting initial content...");
        editor.commands.setContent(initialContent);
      }
    }, 1000);

    const client = getVeltClient();
    if (client) {
      const commentElement = client.getCommentElement();

      commentElement
        .getAllCommentAnnotations()
        .subscribe((annotations: any) => {
          if (!editor) return;
          console.log(
            "[TipTap] Comment annotations updated:",
            annotations?.length ?? 0,
          );

          try {
            renderComments({
              editor,
              editorId,
              commentAnnotations: annotations || [],
            });
          } catch (err) {
            console.warn("[TipTap] renderComments error:", err);
          }
        });

      commentElement.onCommentAdd()?.subscribe((comment: any) => {
        console.log("[TipTap] New comment added:", comment);
      });
    }
  } catch (error: any) {
    console.error("[TipTap] Failed to initialize:", error);

    if (loadingSpinner.parentNode === container) {
      container.removeChild(loadingSpinner);
    }

    container.innerHTML = `
      <div class="flex items-center justify-center h-full">
        <div class="text-center" style="color: var(--text-muted)">
          <p class="text-xl mb-2">Failed to load editor</p>
          <p class="text-sm opacity-70">${error.message}</p>
        </div>
      </div>
    `;
  }

  return {
    editor,
    store,
    destroy() {
      if (editor) {
        editor.destroy();
        editor = null;
      }
      if (store?.destroy) {
        store.destroy();
        store = null;
      }
      if (bubbleMenuElement) {
        bubbleMenuElement.remove();
        bubbleMenuElement = null;
      }
    },
  };
}
