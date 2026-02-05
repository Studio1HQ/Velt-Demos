"use client";

import { MOCK_USERS } from "../data/data";
import { ChevronDown } from "lucide-react";

interface UserSwitcherProps {
  currentUserIndex: number;
  onUserChange: (index: number) => void;
}

export function UserSwitcher({
  currentUserIndex,
  onUserChange,
}: UserSwitcherProps) {
  const currentUser = MOCK_USERS[currentUserIndex];

  return (
    <div
      style={{
        position: "fixed",
        top: "16px",
        left: "16px",
        zIndex: 9999,
        background: "white",
        padding: "12px 16px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <img
        src={currentUser.photoUrl}
        alt={currentUser.name}
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          border: `2px solid ${currentUser.color}`,
        }}
      />

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label
          style={{
            fontSize: "10px",
            textTransform: "uppercase",
            color: "#888",
            display: "block",
            marginBottom: "2px",
          }}
        >
          Current User
        </label>
        <div style={{ position: "relative" }}>
          <select
            value={currentUserIndex}
            onChange={(e) => onUserChange(Number(e.target.value))}
            style={{
              padding: "4px 24px 4px 8px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              appearance: "none",
              backgroundColor: "#f9f9f9",
              width: "100%",
            }}
          >
            {MOCK_USERS.map((user, index) => (
              <option key={user.userId} value={index}>
                {user.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            color="#666"
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}
