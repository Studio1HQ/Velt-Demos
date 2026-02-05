"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { PDFDocument } from "pdf-lib";
import type { PDFPageProxy } from "pdfjs-dist";
import { useVeltClient, VeltComments, VeltCommentsSidebar } from "@veltdev/react";

import { Navbar } from "./Navbar";
import { LeftToolbar } from "./LeftToolbar";
import { MOCK_USERS } from "../data/data";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { usePDFEditor } from "../context/PDFEditorContext";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ImageOverlay {
  id: string;
  dataUrl: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

function getUserIndexFromUrl(): number {
  if (typeof window === "undefined") return 0;
  const params = new URLSearchParams(window.location.search);
  const userParam = params.get("user");
  return userParam
    ? Math.min(Math.max(0, parseInt(userParam, 10)), MOCK_USERS.length - 1)
    : 0;
}

export default function PDFEditor() {
  const { client } = useVeltClient();

  // Get state from context
  const {
    pdfFile,
    setPdfFile,
    documentName,
    numPages,
    setNumPages,
    pageNumber,
    setPageNumber,
    zoom,
    setZoom,
    zoomIn,
    zoomOut,
    activeTool,
    setActiveTool,
    userIndex,
    setUserIndex,
    goToNextPage,
    goToPreviousPage,
  } = usePDFEditor();

  // Listen for popstate events (triggered by user switching)
  useEffect(() => {
    const handlePopState = () => {
      setUserIndex(getUserIndexFromUrl());
    };

    // Set initial user index from URL
    setUserIndex(getUserIndexFromUrl());

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [setUserIndex]);

  // Local state that doesn't need to be shared
  const [editedBlobUrl, setEditedBlobUrl] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [imageOverlays, setImageOverlays] = useState<ImageOverlay[]>([]);

  const activeOverlayRef = useRef<string | null>(null);
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const resizeStartRef = useRef({ mouseX: 0, mouseY: 0, width: 0, height: 0 });
  const [pageViewport, setPageViewport] = useState({ width: 0, height: 0 });
  const pageWrapperRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleUserChange = useCallback((newIndex: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("user", String(newIndex));
    // Use pushState to update URL without page reload - preserves PDF state for collaboration
    window.history.pushState({}, "", url.toString());
    // Update local state directly for immediate UI feedback
    setUserIndex(newIndex);
    // Also dispatch popstate for VeltProvider to pick up the change
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const handlePageRenderSuccess = useCallback((page: PDFPageProxy) => {
    const viewport = page.getViewport({ scale: 1 });
    setPageViewport({ width: viewport.width, height: viewport.height });
  }, []);

  const applyAllImages = async () => {
    if (imageOverlays.length === 0 || !pdfFile) return;
    const rect = pageWrapperRef.current?.getBoundingClientRect();
    if (!rect || !pageViewport.width || !pageViewport.height) return;

    setIsApplying(true);
    try {
      const bytes = await fetch(pdfFile).then((r) => r.arrayBuffer());
      const pdfDoc = await PDFDocument.load(bytes);
      const page = pdfDoc.getPage(pageNumber - 1);

      for (const overlay of imageOverlays) {
        const png = await pdfDoc.embedPng(overlay.dataUrl);
        const pdfX = (overlay.position.x / rect.width) * pageViewport.width;
        const pdfY =
          ((rect.height - overlay.position.y - overlay.size.height) /
            rect.height) *
          pageViewport.height;
        const imgWidth = (overlay.size.width / rect.width) * pageViewport.width;
        const imgHeight =
          (overlay.size.height / rect.height) * pageViewport.height;

        page.drawImage(png, {
          x: pdfX,
          y: pdfY,
          width: imgWidth,
          height: imgHeight,
        });
      }

      const signedBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(signedBytes)], {
        type: "application/pdf",
      });
      const newUrl = URL.createObjectURL(blob);

      setEditedBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return newUrl;
      });
      setPdfFile(newUrl);
      setImageOverlays([]);
    } catch (error) {
      console.error("Unable to apply images", error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const newOverlay: ImageOverlay = {
            id: `img-${Date.now()}-${index}`,
            dataUrl: reader.result,
            position: { x: 100 + index * 20, y: 100 + index * 20 },
            size: { width: 150, height: 100 },
          };
          setImageOverlays((prev) => [...prev, newOverlay]);
        }
      };
      reader.readAsDataURL(file);
    });
    event.target.value = "";
  };

  const removeOverlay = (id: string) =>
    setImageOverlays((prev) => prev.filter((o) => o.id !== id));
  const updateOverlayPosition = (
    id: string,
    position: { x: number; y: number },
  ) =>
    setImageOverlays((prev) =>
      prev.map((o) => (o.id === id ? { ...o, position } : o)),
    );
  const updateOverlaySize = (
    id: string,
    size: { width: number; height: number },
  ) =>
    setImageOverlays((prev) =>
      prev.map((o) => (o.id === id ? { ...o, size } : o)),
    );

  const handleDownload = useCallback(() => {
    if (!pdfFile) return;
    const link = document.createElement("a");
    link.href = pdfFile;
    link.download = documentName || "document.pdf";
    link.click();
  }, [pdfFile, documentName]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!pageWrapperRef.current || !activeOverlayRef.current) return;
      const wrapperRect = pageWrapperRef.current.getBoundingClientRect();
      const activeOverlay = imageOverlays.find(
        (o) => o.id === activeOverlayRef.current,
      );
      if (!activeOverlay) return;

      if (isResizingRef.current) {
        const deltaX = e.clientX - resizeStartRef.current.mouseX;
        const deltaY = e.clientY - resizeStartRef.current.mouseY;
        const newWidth = Math.max(80, resizeStartRef.current.width + deltaX);
        const newHeight = Math.max(50, resizeStartRef.current.height + deltaY);
        updateOverlaySize(activeOverlay.id, {
          width: Math.min(
            wrapperRect.width - activeOverlay.position.x,
            newWidth,
          ),
          height: Math.min(
            wrapperRect.height - activeOverlay.position.y,
            newHeight,
          ),
        });
        return;
      }

      if (!isDraggingRef.current) return;
      const newX = e.clientX - wrapperRect.left - dragOffsetRef.current.x;
      const newY = e.clientY - wrapperRect.top - dragOffsetRef.current.y;
      updateOverlayPosition(activeOverlay.id, {
        x: Math.max(
          0,
          Math.min(wrapperRect.width - activeOverlay.size.width, newX),
        ),
        y: Math.max(
          0,
          Math.min(wrapperRect.height - activeOverlay.size.height, newY),
        ),
      });
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      isResizingRef.current = false;
      activeOverlayRef.current = null;
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [imageOverlays]);

  useEffect(() => {
    return () => {
      if (editedBlobUrl) URL.revokeObjectURL(editedBlobUrl);
    };
  }, [editedBlobUrl]);

  useEffect(() => {
    if (client && pdfFile) {
      client.setDocuments([
        {
          id: "pdf-document-1",
          metadata: {
            documentName: documentName || "PDF Document",
            type: "pdf",
          },
        },
      ]);
      client.setLocation({
        id: `pdf-page-${pageNumber}`,
        locationName: `Page ${pageNumber}`,
      });
    }
  }, [client, pageNumber, pdfFile, documentName]);

  // Always show the PDF editor with the hardcoded PDF for collaboration

  return (
    <div className="h-screen flex flex-col bg-[#f5f5f5] dark:bg-[#1a1a1a] transition-colors duration-200">
      <Navbar />
      <div className="flex gap-3 p-4 absolute top-20 left-20 z-10">
        <button
          disabled={pageNumber === 1}
          onClick={goToPreviousPage}
          className="bg-white dark:bg-[#2c2c2c] text-gray-900 dark:text-white border border-gray-200 dark:border-[#404040] px-4 py-2 rounded-md flex items-center gap-1 group hover:bg-gray-100 dark:hover:bg-[#404040] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft
            size={12}
            className="group-hover:-translate-x-1 transition-all duration-200"
          />
          Previous
        </button>
        <button
          disabled={pageNumber >= numPages}
          onClick={goToNextPage}
          className="bg-white dark:bg-[#2c2c2c] text-gray-900 dark:text-white border border-gray-200 dark:border-[#404040] px-4 py-2 rounded-md flex items-center gap-1 group hover:bg-gray-100 dark:hover:bg-[#404040] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next{" "}
          <ArrowRight
            size={12}
            className="group-hover:translate-x-1 transition-all duration-200"
          />
        </button>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <LeftToolbar onAddImage={() => imageInputRef.current?.click()} />

        <main className="flex-1 overflow-auto p-8 flex items-start justify-start w-screen mx-auto bg-[#f5f5f5] dark:bg-[#1a1a1a] relative">
          <div
            ref={pageWrapperRef}
            className="relative bg-white shadow-2xl mx-auto"
            data-velt-pdf-viewer="true"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
            }}
          >
            <VeltComments textMode={true} inlineCommentMode={true} />
            <div className="absolute right-0 top-0"><VeltCommentsSidebar /></div>
            <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
              <Page
                pageNumber={pageNumber}
                onRenderSuccess={handlePageRenderSuccess}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="pdf-page"
              />
            </Document>

            {imageOverlays.map((overlay) => (
              <div
                key={overlay.id}
                className="absolute border-2 border-dashed border-blue-500 bg-white/90 cursor-grab shadow-lg select-none z-50"
                style={{
                  left: `${overlay.position.x}px`,
                  top: `${overlay.position.y}px`,
                  width: overlay.size.width,
                  height: overlay.size.height,
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  const rect = e.currentTarget.getBoundingClientRect();
                  dragOffsetRef.current = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                  };
                  activeOverlayRef.current = overlay.id;
                  isDraggingRef.current = true;
                }}
              >
                <img
                  src={overlay.dataUrl}
                  alt="Overlay"
                  className="w-full h-full object-contain pointer-events-none select-none"
                  draggable={false}
                />
                <button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => removeOverlay(overlay.id)}
                  className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
                <div
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    activeOverlayRef.current = overlay.id;
                    resizeStartRef.current = {
                      mouseX: e.clientX,
                      mouseY: e.clientY,
                      width: overlay.size.width,
                      height: overlay.size.height,
                    };
                    isResizingRef.current = true;
                  }}
                  className="absolute -right-1.5 -bottom-1.5 w-3 h-3 bg-blue-500 cursor-nwse-resize rounded-sm"
                />
              </div>
            ))}
          </div>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/png"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
        </main>
      </div>

      {imageOverlays.length > 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg px-6 py-3 flex items-center gap-4 z-50">
          <span className="text-sm text-gray-600">
            {imageOverlays.length} image(s) to apply
          </span>
          <button
            onClick={applyAllImages}
            disabled={isApplying}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-full disabled:bg-gray-400 transition-colors"
          >
            {isApplying ? "Applying..." : "Apply All"}
          </button>
        </div>
      )}
      
    </div>
  );
}
