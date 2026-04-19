import { useState, useEffect } from "react";

const ADMIN_PASSWORD = "onemessage2036admin";

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [acting, setActing] = useState(null);
  const [filter, setFilter] = useState("all");
  const [countrySearch, setCountrySearch] = useState("");

  const login = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      setMessages(data.messages || []);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm("Delete this message permanently?")) return;
    setActing(id + "_del");
    try {
      await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch {
      alert("Failed to delete message.");
    } finally {
      setActing(null);
    }
  };

  const toggleReviewed = async (id, current) => {
    setActing(id + "_rev");
    try {
      await fetch(`/api/admin/messages?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewed: !current }),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, reviewed: !current } : m))
      );
    } catch {
      alert("Failed to update.");
    } finally {
      setActing(null);
    }
  };

  const toggleFlagged = async (id, current) => {
    setActing(id + "_flag");
    try {
      await fetch(`/api/admin/messages?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flagged: !current }),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, flagged: !current } : m))
      );
    } catch {
      alert("Failed to update.");
    } finally {
      setActing(null);
    }
  };

  useEffect(() => {
    if (authed) fetchMessages();
  }, [authed]);

  // Unique countries for the dropdown
  const countries = [...new Set(messages.map((m) => m.country).filter(Boolean))].sort();

  const filtered = messages.filter((m) => {
    if (filter === "paid" && !m.paid) return false;
    if (filter === "unpaid" && m.paid) return false;
    if (filter === "flagged" && !m.flagged) return false;
    if (filter === "unreviewed" && m.reviewed) return false;
    if (countrySearch && m.country !== countrySearch) return false;
    return true;
  });

  if (!authed) {
    return (
      <div style={styles.page}>
        <div style={styles.loginBox}>
          <h1 style={styles.title}>OneMessage Admin</h1>
          <form onSubmit={login}>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Admin password"
              style={{ ...styles.input, borderColor: pwError ? "#ef4444" : "rgba(212,175,55,.3)" }}
              autoFocus
            />
            {pwError && <p style={styles.error}>Incorrect password.</p>}
            <button type="submit" style={styles.btn}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>OneMessage Admin</h1>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span style={styles.badge}>{messages.length} total</span>
          <span style={{ ...styles.badge, background: "rgba(34,197,94,.15)", color: "#22c55e" }}>
            {messages.filter((m) => m.paid).length} paid
          </span>
          <span style={{ ...styles.badge, background: "rgba(239,68,68,.12)", color: "#ef4444" }}>
            {messages.filter((m) => !m.paid).length} unpaid
          </span>
          <span style={{ ...styles.badge, background: "rgba(251,191,36,.12)", color: "#fbbf24" }}>
            {messages.filter((m) => m.flagged).length} flagged
          </span>
          <span style={{ ...styles.badge, background: "rgba(148,163,184,.1)", color: "#94a3b8" }}>
            {messages.filter((m) => !m.reviewed).length} unreviewed
          </span>
          <button onClick={fetchMessages} style={styles.refreshBtn}>Refresh</button>
        </div>
      </div>

      {/* Filters row */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={styles.filters}>
          {["all", "paid", "unpaid", "flagged", "unreviewed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{ ...styles.filterBtn, ...(filter === f ? styles.filterBtnActive : {}) }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <select
          value={countrySearch}
          onChange={(e) => setCountrySearch(e.target.value)}
          style={styles.countrySelect}
        >
          <option value="">All countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {countrySearch && (
          <button onClick={() => setCountrySearch("")} style={styles.clearBtn}>✕ Clear</button>
        )}
        <span style={{ color: "rgba(237,232,216,.4)", fontSize: ".78rem", marginLeft: "auto" }}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {loading ? (
        <p style={{ color: "#D4AF37", textAlign: "center", padding: 40 }}>Loading messages...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: "rgba(237,232,216,.5)", textAlign: "center", padding: 40 }}>No messages found.</p>
      ) : (
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span style={{ flex: "0 0 55px" }}>#</span>
            <span style={{ flex: "0 0 130px" }}>Name</span>
            <span style={{ flex: "0 0 130px" }}>Country</span>
            <span style={{ flex: 1 }}>Message</span>
            <span style={{ flex: "0 0 70px" }}>Vis.</span>
            <span style={{ flex: "0 0 60px" }}>Paid</span>
            <span style={{ flex: "0 0 140px" }}>Date</span>
            <span style={{ flex: "0 0 200px" }}>Actions</span>
          </div>
          {filtered.map((m) => (
            <div
              key={m.id}
              style={{
                ...styles.row,
                opacity: acting?.startsWith(m.id) ? 0.4 : 1,
                background: m.flagged ? "rgba(251,191,36,.04)" : undefined,
                borderLeft: m.flagged ? "3px solid rgba(251,191,36,.5)" : "3px solid transparent",
              }}
            >
              <span style={{ flex: "0 0 55px", color: "#D4AF37", fontSize: ".78rem" }}>
                #{m.message_number || "—"}
              </span>
              <span style={{ flex: "0 0 130px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {m.name || <span style={{ opacity: 0.4 }}>anonymous</span>}
              </span>
              <span style={{ flex: "0 0 130px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: ".8rem" }}>
                {m.country || "—"}
              </span>
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {m.message}
              </span>
              <span style={{ flex: "0 0 70px", color: m.visibility === "public" ? "#22c55e" : "#94a3b8", fontSize: ".75rem" }}>
                {m.visibility}
              </span>
              <span style={{ flex: "0 0 60px" }}>
                <span style={{ background: m.paid ? "rgba(34,197,94,.15)" : "rgba(239,68,68,.12)", color: m.paid ? "#22c55e" : "#ef4444", padding: "2px 7px", borderRadius: 4, fontSize: ".7rem" }}>
                  {m.paid ? "YES" : "NO"}
                </span>
              </span>
              <span style={{ flex: "0 0 140px", fontSize: ".73rem", color: "rgba(237,232,216,.5)" }}>
                {m.created_at ? new Date(m.created_at).toLocaleString() : "—"}
              </span>
              <span style={{ flex: "0 0 200px", display: "flex", gap: 5, flexWrap: "wrap" }}>
                <button
                  onClick={() => toggleReviewed(m.id, m.reviewed)}
                  disabled={!!acting}
                  style={{ ...styles.actionBtn, ...(m.reviewed ? styles.reviewedBtn : styles.unreviewedBtn) }}
                  title={m.reviewed ? "Mark as unreviewed" : "Mark as reviewed"}
                >
                  {m.reviewed ? "✓ Reviewed" : "Review"}
                </button>
                <button
                  onClick={() => toggleFlagged(m.id, m.flagged)}
                  disabled={!!acting}
                  style={{ ...styles.actionBtn, ...(m.flagged ? styles.flaggedActiveBtn : styles.flagBtn) }}
                  title={m.flagged ? "Unflag" : "Flag as inappropriate"}
                >
                  {m.flagged ? "🚩 Flagged" : "Flag"}
                </button>
                <button
                  onClick={() => deleteMessage(m.id)}
                  disabled={!!acting}
                  style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                >
                  Delete
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    background: "#05070F",
    minHeight: "100vh",
    color: "#EDE8D8",
    fontFamily: "'DM Sans', sans-serif",
    padding: "32px 20px",
  },
  loginBox: {
    maxWidth: 380,
    margin: "100px auto 0",
    background: "rgba(255,255,255,.034)",
    border: "1px solid rgba(212,175,55,.17)",
    borderRadius: 10,
    padding: "40px 32px",
  },
  title: {
    fontFamily: "Georgia, serif",
    color: "#D4AF37",
    fontSize: "1.5rem",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,.05)",
    border: "1px solid",
    borderRadius: 4,
    color: "#EDE8D8",
    padding: "10px 14px",
    fontSize: ".95rem",
    outline: "none",
    display: "block",
    marginBottom: 8,
    boxSizing: "border-box",
  },
  error: { color: "#ef4444", fontSize: ".8rem", marginBottom: 12 },
  btn: {
    width: "100%",
    background: "linear-gradient(135deg,#D4AF37,#9A7A0A)",
    color: "#000",
    border: "none",
    borderRadius: 4,
    padding: "11px",
    fontSize: ".95rem",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 8,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 12,
  },
  badge: {
    background: "rgba(212,175,55,.12)",
    color: "#D4AF37",
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: ".75rem",
    fontWeight: 600,
  },
  refreshBtn: {
    background: "rgba(212,175,55,.1)",
    border: "1px solid rgba(212,175,55,.3)",
    color: "#D4AF37",
    borderRadius: 4,
    padding: "5px 14px",
    cursor: "pointer",
    fontSize: ".8rem",
  },
  filters: { display: "flex", gap: 6, flexWrap: "wrap" },
  filterBtn: {
    background: "none",
    border: "1px solid rgba(212,175,55,.2)",
    color: "rgba(237,232,216,.5)",
    borderRadius: 4,
    padding: "5px 14px",
    cursor: "pointer",
    fontSize: ".78rem",
  },
  filterBtnActive: {
    background: "rgba(212,175,55,.12)",
    color: "#D4AF37",
    borderColor: "rgba(212,175,55,.5)",
  },
  countrySelect: {
    background: "rgba(255,255,255,.04)",
    border: "1px solid rgba(212,175,55,.2)",
    color: "#EDE8D8",
    borderRadius: 4,
    padding: "5px 10px",
    fontSize: ".78rem",
    cursor: "pointer",
    outline: "none",
  },
  clearBtn: {
    background: "none",
    border: "1px solid rgba(239,68,68,.3)",
    color: "#ef4444",
    borderRadius: 4,
    padding: "5px 10px",
    cursor: "pointer",
    fontSize: ".75rem",
  },
  table: {
    background: "rgba(255,255,255,.025)",
    border: "1px solid rgba(212,175,55,.15)",
    borderRadius: 8,
    overflow: "auto",
  },
  tableHeader: {
    display: "flex",
    gap: 10,
    padding: "10px 16px",
    background: "rgba(212,175,55,.07)",
    fontSize: ".7rem",
    color: "#D4AF37",
    letterSpacing: ".06em",
    textTransform: "uppercase",
    fontWeight: 600,
    minWidth: 900,
  },
  row: {
    display: "flex",
    gap: 10,
    padding: "11px 16px",
    borderTop: "1px solid rgba(212,175,55,.08)",
    fontSize: ".8rem",
    alignItems: "center",
    minWidth: 900,
    transition: "background .15s",
  },
  actionBtn: {
    border: "1px solid",
    borderRadius: 4,
    padding: "3px 9px",
    cursor: "pointer",
    fontSize: ".72rem",
    fontWeight: 500,
  },
  unreviewedBtn: {
    background: "rgba(148,163,184,.07)",
    borderColor: "rgba(148,163,184,.3)",
    color: "#94a3b8",
  },
  reviewedBtn: {
    background: "rgba(34,197,94,.08)",
    borderColor: "rgba(34,197,94,.3)",
    color: "#22c55e",
  },
  flagBtn: {
    background: "rgba(251,191,36,.07)",
    borderColor: "rgba(251,191,36,.25)",
    color: "#fbbf24",
  },
  flaggedActiveBtn: {
    background: "rgba(251,191,36,.15)",
    borderColor: "rgba(251,191,36,.5)",
    color: "#fbbf24",
  },
  deleteBtn: {
    background: "rgba(239,68,68,.08)",
    borderColor: "rgba(239,68,68,.3)",
    color: "#ef4444",
  },
};
