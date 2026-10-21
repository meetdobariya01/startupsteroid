// src/components/AdminRoute/FilePreviewModal.jsx
import { useEffect, useState } from "react";
import api from "./api/axios";

export default function FilePreviewModal({ fileId, fileName, onClose }) {
  const [url, setUrl] = useState(null);
  const [mimeType, setMimeType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let objectUrl = null;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/files/${fileId}/preview`, {
          responseType: "blob",
        });

        if (cancelled) return;

        const blob = new Blob([res.data], {
          type: res.headers["content-type"],
        });
        objectUrl = URL.createObjectURL(blob);
        setMimeType(res.headers["content-type"]);
        setUrl(objectUrl);
      } catch (e) {
        if (!cancelled) {
          setError(
            e.response?.status === 404
              ? "File not found in storage"
              : e.response?.data?.message || "Failed to load file"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [fileId]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const isImage = mimeType?.startsWith("image/");
  const isPdf = mimeType === "application/pdf";

  return (
    <div
      className="file-preview-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.85)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 12,
          width: "100%",
          maxWidth: 1000,
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              minWidth: 0,
            }}
          >
            <span style={{ fontSize: 18 }}>
              {isPdf ? "📄" : isImage ? "🖼️" : "📎"}
            </span>
            <strong
              style={{
                fontSize: 14,
                color: "#0f172a",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={fileName}
            >
              {fileName || "File Preview"}
            </strong>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            {url && (
              <a
                href={url}
                download={fileName}
                style={{
                  background: "#eff6ff",
                  color: "#2563eb",
                  padding: "6px 14px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                ⬇ Download
              </a>
            )}
            <button
              onClick={onClose}
              style={{
                background: "#fee2e2",
                color: "#991b1b",
                border: 0,
                padding: "6px 14px",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            background: "#f8fafc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: loading || error ? 60 : 0,
          }}
        >
          {loading && (
            <div style={{ textAlign: "center", color: "#64748b" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  border: "4px solid #e2e8f0",
                  borderTopColor: "#3b82f6",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto 12px",
                }}
              />
              Loading file…
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {!loading && error && (
            <div style={{ textAlign: "center", color: "#991b1b" }}>
              <p style={{ fontSize: 32, margin: "0 0 8px" }}>⚠️</p>
              <p style={{ margin: 0 }}>{error}</p>
            </div>
          )}

          {!loading && url && isImage && (
            <img
              src={url}
              alt={fileName}
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                display: "block",
                objectFit: "contain",
              }}
            />
          )}

          {!loading && url && isPdf && (
            <iframe
              src={url}
              title={fileName || "PDF Preview"}
              style={{
                width: "100%",
                height: "80vh",
                border: 0,
              }}
            />
          )}

          {!loading && url && !isImage && !isPdf && (
            <div style={{ textAlign: "center", color: "#64748b" }}>
              <p style={{ fontSize: 32, margin: "0 0 8px" }}>📎</p>
              <p style={{ margin: "0 0 16px" }}>
                Preview not available for this file type.
              </p>
              <a
                href={url}
                download={fileName}
                style={{
                  background: "#3b82f6",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Download instead
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}