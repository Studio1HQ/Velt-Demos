"use client";

import { useEffect } from "react";
import {
  VeltComments,
  VeltCommentTool,
  VeltPresence,
  useVeltClient,
  VeltCommentsSidebar,
} from "@veltdev/react";
import { useTheme } from "../context/ThemeContext";

interface VeltCommentSetupProps {
  documentId: string;
  documentName?: string;
}

export function VeltCommentSetup({
  documentId,
  documentName = "Document",
}: VeltCommentSetupProps) {
  const { client } = useVeltClient();
  const { theme} = useTheme();

  useEffect(() => {
    if (client) {
      client.setDocuments([
        {
          id: documentId,
          metadata: { documentName },
        },
      ]);
    }
  }, [client, documentId, documentName]);

  return (
    <>
      <VeltComments textMode={true} />
      
      <div
        className="velt-toolbar"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
          display: "flex",
          gap: "8px",
          background: "white",
          padding: "8px 12px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <VeltCommentTool />
        {/* <VeltCommentsSidebar darkMode={theme === "dark"} /> */}
        <VeltPresence />
      </div>
    </>
  );
}
