// FrontEnd/src/pages/AdminVerification.jsx
import { useEffect, useState } from "react";
import api from "./api/axios";
import FilePreviewModal from "./FilePreviewModal";
import { DESC_TO_KEY } from "../../config/sectionMap";

// ─────────────────────────────────────────────
// Section → documents (for rendering the expanded panel)
// ⚠️ Keys here are the descriptions — same strings as DESC_TO_KEY
// ─────────────────────────────────────────────
const DOCUMENT_SECTIONS = {
    "A. Company & Legal Documents": [
        "Certificate of Incorporation (QRYX Tech Pvt. Ltd.)",
        "Memorandum & Articles of Association (MoA/AoA)",
        "Company PAN",
        "TAN (if applicable)",
        "GST Registration",
        "Udyam (MSME) Certificate",
        "DPIIT Recognition Certificate (if already obtained)",
        "Board Resolution authorizing grant/incubation application",
        "Cap Table / Shareholding Pattern",
    ],
    "B. Founder & Team Documents": [
        "Founder PAN & Aadhaar",
        "Founder CV / Bio",
        "Team Structure & Profiles",
    ],
    "C. Business & Product Documents": [
        "Startup Pitch Deck (10-15 slides)",
        "Detailed Project Report (DPR)",
        "Product Overview",
        "Prototype / Demo Link",
        "IP Filings",
        "Market Size & Competitive Landscape",
    ],
    "D. Financial Documents": [
        "Bank Details & Cancelled Cheque",
        "Financial Projections",
        "Revenue / Traction",
        "Previous Funding",
        "Use Of Funds",
    ],
    "E. Address & Compliance": [
        "Registered Office Proof",
        "Utility Bill / Rent Agreement",
    ],
};

const ALL_DOCUMENTS = Object.values(DOCUMENT_SECTIONS).flat();

// ─────────────────────────────────────────────
// 🛑 One-time sanity check — safe in ALL builds (no import.meta)
// ─────────────────────────────────────────────
(() => {
    const missing = ALL_DOCUMENTS.filter((d) => !DESC_TO_KEY[d]);
    if (missing.length) {
        console.error("❌ [AdminVerification] DESC_TO_KEY missing entries:");
        missing.forEach((d) => console.error("   -", JSON.stringify(d)));
    } else {
        console.log("✅ [AdminVerification] DESC_TO_KEY covers all documents.");
    }
})();

export default function AdminVerification() {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [expandedId, setExpandedId] = useState(null);
    const [reasonInput, setReasonInput] = useState({});
    const [previewFile, setPreviewFile] = useState(null);

    const loadStats = async () => {
        try {
            const { data } = await api.get("/admin/verification/stats");
            setStats(data.stats);
        } catch (e) {
            console.error("Stats error:", e.response?.data || e.message);
        }
    };

    const loadUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/admin/verification/all", {
                params: { page, limit: 20, search, status: statusFilter },
            });
            setUsers(data.users || []);
            setPagination(data.pagination);
        } catch (e) {
            console.error("Load error:", e.response?.data || e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
        loadUsers();
        // eslint-disable-next-line
    }, [page, search, statusFilter]);

    const reviewDocument = async (userId, docKey, status) => {
        const reason = reasonInput[`${userId}-${docKey}`] || "";
        if (status === "rejected" && !reason.trim()) {
            alert("Please enter a reason for rejection");
            return;
        }
        try {
            await api.patch(`/admin/verification/${userId}/doc/${docKey}`, {
                status,
                reason,
            });
            setReasonInput((p) => ({ ...p, [`${userId}-${docKey}`]: "" }));
            loadStats();
            loadUsers();
        } catch (e) {
            console.error("reviewDocument failed:", e.response?.data || e.message);
            alert(e.response?.data?.message || "Failed to update document");
        }
    };

    const approveAll = async (userId) => {
        if (!window.confirm("Approve ALL documents for this user?")) return;
        try {
            await api.post(`/admin/verification/${userId}/approve-all`);
            loadStats();
            loadUsers();
        } catch (e) {
            console.error("approveAll failed:", e.response?.data || e.message);
            alert(e.response?.data?.message || "Failed");
        }
    };

    const rejectAll = async (userId) => {
        const reason = window.prompt("Reason for rejecting all documents:");
        if (!reason?.trim()) return;
        try {
            await api.post(`/admin/verification/${userId}/reject-all`, { reason });
            loadStats();
            loadUsers();
        } catch (e) {
            console.error("rejectAll failed:", e.response?.data || e.message);
            alert(e.response?.data?.message || "Failed");
        }
    };

    // Count verified/rejected for a user (uses DESC_TO_KEY, not local slugify)
    const countByStatus = (user) => {
        const docs = user.verification?.documents || {};
        let verified = 0;
        let rejected = 0;
        ALL_DOCUMENTS.forEach((desc) => {
            const key = DESC_TO_KEY[desc];
            if (!key) return;
            const s = docs[key]?.status || "pending";
            if (s === "verified") verified++;
            else if (s === "rejected") rejected++;
        });
        return { verified, rejected, total: ALL_DOCUMENTS.length };
    };

    return (
        <div className="dv-page">
            <div className="dv-header">
                <div className="dv-title">
                    <h2>Seller Documents</h2>
                    {pagination?.total > 0 && (
                        <span className="dv-count-badge">{pagination.total}</span>
                    )}
                </div>
                <button
                    className="dv-refresh-btn"
                    onClick={() => {
                        loadStats();
                        loadUsers();
                    }}
                >
                    🔄 Refresh
                </button>
            </div>

            {stats && (
                <div className="dv-stats-grid">
                    <StatCard label="Total" value={stats.total} color="#3b82f6" bg="#eff6ff" icon="📋" />
                    <StatCard label="Rejected" value={stats.rejected} color="#dc2626" bg="#fef2f2" icon="✕" />
                    <StatCard label="Pending" value={stats.pending} color="#d97706" bg="#fffbeb" icon="⏱" />
                    <StatCard label="Verified" value={stats.verified} color="#16a34a" bg="#f0fdf4" icon="✓" />
                </div>
            )}

            <div className="dv-filters">
                <input
                    className="dv-search"
                    placeholder="Search by email, username, or company…"
                    value={search}
                    onChange={(e) => {
                        setPage(1);
                        setSearch(e.target.value);
                    }}
                />
                <select
                    className="dv-status-filter"
                    value={statusFilter}
                    onChange={(e) => {
                        setPage(1);
                        setStatusFilter(e.target.value);
                    }}
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            <div className="dv-table-wrapper">
                <table className="dv-table">
                    <thead>
                        <tr>
                            <th style={{ width: 40 }}>#</th>
                            <th style={{ width: 170 }}>Tracking ID</th>
                            <th>Email</th>
                            <th>Progress</th>
                            <th style={{ width: 100 }}>Status</th>
                            <th style={{ width: 110 }}>Submitted</th>
                            <th style={{ width: 130 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={7} className="dv-empty">
                                    <div className="dv-loading-spinner" />
                                    Loading…
                                </td>
                            </tr>
                        )}
                        {!loading && users.length === 0 && (
                            <tr>
                                <td colSpan={7} className="dv-empty">
                                    <div className="dv-empty-icon">📭</div>
                                    <p>No submissions found.</p>
                                </td>
                            </tr>
                        )}
                        {!loading &&
                            users.map((u, i) => {
                                const isOpen = expandedId === u._id;
                                const counts = countByStatus(u);
                                return (
                                    <UserRowGroup
                                        key={u._id}
                                        u={u}
                                        counts={counts}
                                        rowIndex={(page - 1) * 20 + i + 1}
                                        isOpen={isOpen}
                                        toggle={() => setExpandedId(isOpen ? null : u._id)}
                                        onApproveAll={() => approveAll(u._id)}
                                        onRejectAll={() => rejectAll(u._id)}
                                        onReview={reviewDocument}
                                        reasonInput={reasonInput}
                                        setReasonInput={setReasonInput}
                                        onPreview={(file) => setPreviewFile(file)}
                                    />
                                );
                            })}
                    </tbody>
                </table>
            </div>

            {pagination && pagination.pages > 1 && (
                <div className="dv-pagination">
                    <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                        ← Prev
                    </button>
                    <span>
                        Page <strong>{pagination.page}</strong> of <strong>{pagination.pages}</strong>
                    </span>
                    <button
                        disabled={page >= pagination.pages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next →
                    </button>
                </div>
            )}

            {previewFile && (
                <FilePreviewModal
                    fileId={previewFile._id}
                    fileName={previewFile.originalName}
                    onClose={() => setPreviewFile(null)}
                />
            )}
        </div>
    );
}

// ─────────────────────────────────────────────
// User row + expanded panel
// ─────────────────────────────────────────────
function UserRowGroup({
    u,
    counts,
    rowIndex,
    isOpen,
    toggle,
    onApproveAll,
    onRejectAll,
    onReview,
    reasonInput,
    setReasonInput,
    onPreview,
}) {
    const overall = u.verification?.overallStatus || "pending";
    const docsStatus = u.verification?.documents || {};
    const filesByKey = u.filesByKey || {};

    const trackingId = "DOC-" + u._id.toString().slice(-12).toUpperCase();

    return (
        <>
            <tr className={isOpen ? "dv-row-open" : ""}>
                <td className="dv-cell-index">{rowIndex}</td>
                <td>
                    <span className="dv-tracking-id">{trackingId}</span>
                </td>
                <td>
                    <div className="dv-email-cell">
                        <span className="dv-email-avatar">
                            {u.email?.[0]?.toUpperCase() || "?"}
                        </span>
                        <span className="dv-email-text">{u.email}</span>
                    </div>
                </td>
                <td>
                    <div className="dv-progress-cell">
                        <span className="dv-badge dv-badge-verified">
                            {counts.verified} verified
                        </span>
                        <span className="dv-badge dv-badge-pending">
                            {counts.total - counts.verified - counts.rejected} pending
                        </span>
                        {counts.rejected > 0 && (
                            <span className="dv-badge dv-badge-rejected">
                                {counts.rejected} rejected
                            </span>
                        )}
                    </div>
                </td>
                <td>
                    <OverallStatus status={overall} />
                </td>
                <td className="dv-date">
                    {u.submittedAt
                        ? new Date(u.submittedAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                          })
                        : "N/A"}
                </td>
                <td>
                    <div className="dv-action-buttons">
                        <button
                            className="dv-icon-btn"
                            title={isOpen ? "Collapse" : "Expand"}
                            onClick={toggle}
                        >
                            {isOpen ? "▲" : "▼"}
                        </button>
                        {overall === "verified" ? (
                            <span className="dv-verified-pill">✅ Verified</span>
                        ) : (
                            <>
                                <button
                                    className="dv-icon-btn dv-icon-approve"
                                    onClick={onApproveAll}
                                    title="Approve all"
                                >
                                    ✓
                                </button>
                                <button
                                    className="dv-icon-btn dv-icon-reject"
                                    onClick={onRejectAll}
                                    title="Reject all"
                                >
                                    ✕
                                </button>
                            </>
                        )}
                    </div>
                </td>
            </tr>

            {isOpen && (
                <tr className="dv-expanded-row">
                    <td colSpan={7}>
                        <div className="dv-expanded-panel">
                            <div className="dv-expanded-header">
                                <div className="dv-expanded-user">
                                    <strong>{u.username}</strong>
                                    <span>{u.email}</span>
                                </div>
                                <span className="dv-expanded-meta">
                                    📎 {u.files?.length || 0} files uploaded ·{" "}
                                    {counts.verified} verified · {counts.rejected} rejected
                                </span>
                            </div>

                            {Object.entries(DOCUMENT_SECTIONS).map(([category, docs]) => (
                                <div key={category} className="dv-category-block">
                                    <h4 className="dv-category-title">{category}</h4>

                                    <table className="dv-detail-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "30%" }}>Document</th>
                                                <th style={{ width: "25%" }}>Uploaded File</th>
                                                <th style={{ width: 100 }}>Status</th>
                                                <th style={{ width: "20%" }}>Rejection Reason</th>
                                                <th style={{ width: 180 }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {docs.map((desc) => {
                                                const key = DESC_TO_KEY[desc];
                                                if (!key) {
                                                    return (
                                                        <tr key={desc}>
                                                            <td>
                                                                <span className="dv-doc-label">{desc}</span>
                                                            </td>
                                                            <td colSpan={4}>
                                                                <span
                                                                    className="dv-no-file"
                                                                    style={{ color: "crimson" }}
                                                                >
                                                                    ⚠ No key mapping for this document
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                                const s = docsStatus[key] || { status: "pending" };
                                                const reasonKey = `${u._id}-${key}`;
                                                const files = filesByKey[key] || [];

                                                return (
                                                    <tr key={key}>
                                                        <td>
                                                            <span className="dv-doc-label">{desc}</span>
                                                        </td>
                                                        <td>
                                                            {files.length === 0 ? (
                                                                <span className="dv-no-file">
                                                                    No file uploaded
                                                                </span>
                                                            ) : (
                                                                <div className="dv-file-list">
                                                                    {files.map((f) => (
                                                                        <button
                                                                            key={f._id}
                                                                            type="button"
                                                                            className="dv-file-chip"
                                                                            onClick={() => onPreview(f)}
                                                                            title={f.originalName}
                                                                        >
                                                                            <span className="dv-file-chip-icon">👁</span>
                                                                            <span className="dv-file-chip-text">
                                                                                {f.originalName}
                                                                            </span>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <OverallStatus status={s.status} small />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="dv-reason-input"
                                                                type="text"
                                                                placeholder="Enter reason…"
                                                                value={reasonInput[reasonKey] || ""}
                                                                onChange={(e) =>
                                                                    setReasonInput((p) => ({
                                                                        ...p,
                                                                        [reasonKey]: e.target.value,
                                                                    }))
                                                                }
                                                            />
                                                            {s.reason && (
                                                                <div className="dv-prev-reason">
                                                                    Previous: {s.reason}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <div className="dv-detail-actions">
                                                                <button
                                                                    className="dv-btn dv-btn-approve"
                                                                    onClick={() => onReview(u._id, key, "verified")}
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    className="dv-btn dv-btn-reject"
                                                                    onClick={() => onReview(u._id, key, "rejected")}
                                                                >
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}

// ─────────────────────────────────────────────
function StatCard({ label, value, color, bg, icon }) {
    return (
        <div className="dv-stat-card" style={{ background: bg }}>
            <div className="dv-stat-header">
                <span className="dv-stat-label">{label}</span>
                <span className="dv-stat-icon" style={{ background: color, color: "#fff" }}>
                    {icon}
                </span>
            </div>
            <div className="dv-stat-value" style={{ color }}>
                {value}
            </div>
        </div>
    );
}

function OverallStatus({ status, small = false }) {
    const map = {
        pending: { bg: "#fef3c7", color: "#92400e", label: "Pending" },
        verified: { bg: "#dcfce7", color: "#166534", label: "Verified" },
        rejected: { bg: "#fee2e2", color: "#991b1b", label: "Rejected" },
    };
    const s = map[status] || map.pending;
    return (
        <span
            className="dv-pill"
            style={{
                background: s.bg,
                color: s.color,
                fontSize: small ? 11 : 12,
                padding: small ? "3px 10px" : "5px 14px",
            }}
        >
            {s.label}
        </span>
    );
}