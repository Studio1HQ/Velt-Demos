"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface PDFEditorState {
  pdfFile: string | null;
  documentName: string;
  numPages: number;
  pageNumber: number;
  zoom: number;

  activeTool: string;

  userIndex: number;
}

interface PDFEditorContextType extends PDFEditorState {
  setPdfFile: (file: string | null) => void;
  setDocumentName: (name: string) => void;
  setNumPages: (pages: number) => void;
  setPageNumber: (page: number) => void;
  setZoom: (zoom: number) => void;

  setActiveTool: (tool: string) => void;

  setUserIndex: (index: number) => void;

  goToNextPage: () => void;
  goToPreviousPage: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

const PDFEditorContext = createContext<PDFEditorContextType | undefined>(
  undefined,
);

const DEFAULT_PDF = "/research_paper.pdf";
const DEFAULT_DOC_NAME = "research_paper.pdf";

interface PDFEditorProviderProps {
  children: ReactNode;
}

export function PDFEditorProvider({ children }: PDFEditorProviderProps) {
  const [pdfFile, setPdfFile] = useState<string | null>(DEFAULT_PDF);
  const [documentName, setDocumentName] = useState(DEFAULT_DOC_NAME);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);

  const [activeTool, setActiveTool] = useState("pointer");

  const [userIndex, setUserIndex] = useState(0);

  const goToNextPage = useCallback(() => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  }, [numPages]);

  const goToPreviousPage = useCallback(() => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  }, []);

  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  }, []);

  const value: PDFEditorContextType = {
    pdfFile,
    documentName,
    numPages,
    pageNumber,
    zoom,
    activeTool,
    userIndex,

    setPdfFile,
    setDocumentName,
    setNumPages,
    setPageNumber,
    setZoom,
    setActiveTool,
    setUserIndex,

    goToNextPage,
    goToPreviousPage,
    zoomIn,
    zoomOut,
  };

  return (
    <PDFEditorContext.Provider value={value}>
      {children}
    </PDFEditorContext.Provider>
  );
}

export function usePDFEditor() {
  const context = useContext(PDFEditorContext);
  if (context === undefined) {
    throw new Error("usePDFEditor must be used within a PDFEditorProvider");
  }
  return context;
}
