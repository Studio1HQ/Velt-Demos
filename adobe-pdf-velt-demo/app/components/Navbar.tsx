"use client";

import { MOCK_USERS } from "../data/data";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  useVeltClient,
  useCommentAnnotations,
  VeltSidebarButton,
  VeltNotificationsTool,
  VeltCommentsSidebar,
} from "@veltdev/react";
import { useTheme } from "../context/ThemeContext";
import { usePDFEditor } from "../context/PDFEditorContext";
import {
  FileText,
  ChevronDown,
  Sun,
  Moon,
  Search,
  Check,
  Download,
} from "lucide-react";

export function Navbar() {
  const { client } = useVeltClient();
  const commentAnnotations = useCommentAnnotations();
  const { theme, toggleTheme } = useTheme();
  const { documentName, userIndex, setUserIndex, pdfFile } = usePDFEditor();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const currentUser = MOCK_USERS[userIndex];

  const handleClearAllComments = useCallback(async () => {
    if (!client || !commentAnnotations || commentAnnotations.length === 0) {
      return;
    }

    try {
      const commentElement = client.getCommentElement();
      for (const annotation of commentAnnotations) {
        if (annotation.annotationId) {
          await commentElement.deleteCommentAnnotation({
            annotationId: annotation.annotationId,
          });
        }
      }
    } catch (error) {
      console.error("Error clearing comments:", error);
    }
  }, [client, commentAnnotations]);

  const handleDownload = useCallback(() => {
    if (!pdfFile) return;
    const link = document.createElement("a");
    link.href = pdfFile;
    link.download = documentName || "document.pdf";
    link.click();
  }, [pdfFile, documentName]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserSelect = (index: number) => {
    setShowUserMenu(false);
    setUserIndex(index);
    const url = new URL(window.location.href);
    url.searchParams.set("user", String(index));
    window.history.pushState({}, "", url.toString());
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <nav className="h-14 bg-white dark:bg-[#2c2c2c] border-b border-gray-200 dark:border-[#404040] flex items-center justify-between px-4 transition-colors duration-200">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-gray-900 dark:text-white font-medium hidden sm:block">
            PDF Editor
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {["Tools", "Edit", "E-Sign"].map((item) => (
            <button
              key={item}
              className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#404040] rounded text-sm transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span className="text-gray-900 dark:text-white text-sm">
          {documentName}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white" />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#404040] rounded transition-colors"
          title={
            theme === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>

        <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#404040] rounded transition-colors">
          <Search className="w-5 h-5" />
        </button>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 rounded hover:bg-gray-100 dark:hover:bg-[#404040] transition-colors"
          >
            <img
              src={currentUser.photoUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full border-2"
              style={{ borderColor: currentUser.color }}
            />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#2c2c2c] border border-gray-200 dark:border-[#404040] rounded-lg shadow-xl overflow-hidden z-50">
              <div className="p-3 border-b border-gray-200 dark:border-[#404040]">
                <p className="text-xs text-gray-500 uppercase">Current User</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {currentUser.name}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {currentUser.email}
                </p>
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-500 uppercase px-2 py-1">
                  Switch User
                </p>
                {MOCK_USERS.map((user, index) => (
                  <button
                    key={user.userId}
                    onClick={() => handleUserSelect(index)}
                    className={`w-full flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-[#404040] transition-colors ${
                      index === userIndex ? "bg-gray-100 dark:bg-[#404040]" : ""
                    }`}
                  >
                    <img
                      src={user.photoUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2"
                      style={{ borderColor: user.color }}
                    />
                    <div className="text-left">
                      <p className="text-gray-900 dark:text-white text-sm">
                        {user.name}
                      </p>
                      <p className="text-gray-500 text-xs">{user.email}</p>
                    </div>
                    {index === userIndex && (
                      <Check className="w-4 h-4 text-blue-500 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {pdfFile && (
          <button
            onClick={handleDownload}
            className="px-4 py-1.5 bg-gray-200 dark:bg-[#404040] hover:bg-gray-300 dark:hover:bg-[#505050] text-gray-900 dark:text-white text-sm rounded transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        )}
        <div className="flex items-center gap-2">
          <VeltSidebarButton
            darkMode={theme === "dark"}
            style={{
              cursor: "pointer",
            }}
          />
          <VeltCommentsSidebar darkMode={theme === "dark"} />
          <VeltNotificationsTool />
        </div>
      </div>
    </nav>
  );
}
