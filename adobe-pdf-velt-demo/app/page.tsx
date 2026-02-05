"use client";

import dynamic from "next/dynamic";
import { VeltProviderWrapper } from "./providers/VeltProviderWrapper";
import { ThemeProvider } from "./context/ThemeContext";
import { PDFEditorProvider } from "./context/PDFEditorContext";

// Dynamic import with SSR disabled - react-pdf uses browser APIs like DOMMatrix
const PDFEditor = dynamic(() => import("./components/PDFEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-[#f5f5f5] dark:bg-[#1a1a1a]">
      <div className="text-gray-500 dark:text-gray-400">
        Loading PDF Editor...
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <ThemeProvider>
      <PDFEditorProvider>
        <VeltProviderWrapper>
          <PDFEditor />
        </VeltProviderWrapper>
      </PDFEditorProvider>
    </ThemeProvider>
  );
}
