import React, { useMemo, useRef, useState, useEffect } from "react";
import { AuthUser } from "../types";

type Props = {
  user: AuthUser;
  onLogout: () => void;
  className?: string;
};

export default function UserMenu({ user, onLogout, className }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const email = user?.email || "";

  const initials = useMemo(() => {
    const v = (email || "").trim();
    return v ? v[0].toUpperCase() : "?";
  }, [email]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  // אם אין אימייל (לא מחובר) — לא מציגים תפריט
  if (!email) return null;

  return (
    <div
      ref={rootRef}
      className={className}
      style={{ position: "relative", display: "flex", alignItems: "center" }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 10px",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.18)",
          background: "rgba(255,255,255,0.06)",
          cursor: "pointer",
        }}
        aria-label="User menu"
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 999,
            display: "grid",
            placeItems: "center",
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.08)",
            fontSize: 13,
            fontWeight: 700,
          }}
          title={email}
        >
          {initials}
        </div>
<span style={{ fontSize: 11, opacity: 0.6 }}>← USER MENU DEBUG</span>

        <div
          style={{
            maxWidth: 180,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: 12,
            opacity: 0.9,
          }}
          title={email}
        >
          {email}
        </div>

        <div style={{ fontSize: 12, opacity: 0.7, paddingLeft: 2 }}>▾</div>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 260,
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(18,18,22,0.92)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
            padding: 10,
            zIndex: 50,
          }}
        >
          <div style={{ padding: "10px 10px 8px 10px" }}>
            <div style={{ fontSize: 11, opacity: 0.7 }}>מחובר כ</div>
            <div
              style={{
                marginTop: 4,
                fontSize: 13,
                fontWeight: 700,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={email}
            >
              {email}
            </div>
          </div>

          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.10)",
              margin: "6px 0",
            }}
          />

          <button
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              padding: "10px 10px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.06)",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            <span>התנתקות</span>
            <span style={{ opacity: 0.7 }}>↪</span>
          </button>

          <div style={{ padding: "8px 10px 2px 10px", fontSize: 11, opacity: 0.6 }}>
            בקרוב: חשבון, חבילה, קרדיטים
          </div>
        </div>
      )}
    </div>
  );
}
