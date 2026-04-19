import { useState, useEffect } from "react";

const ADMIN_PASSWORD = "onemessage2036admin";

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [filter, setFilter] = useState("all");

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
    setDeleting(id);
    try {
      await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch {
      alert("Failed to delete message.");
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    if (authed) fetchMessages();
  }, [authed]);

  const filtered = filter === "all" ? messages : messages.filter((m) => m.paid === (filter === "paid"));

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
          <button onClick={fetchMessages} style={styles.refreshBtn}>Refresh</button>
        </div>
      </div>

      <div style={styles.filters}>
        {["all", "paid", "unpaid"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{ ...styles.filterBtn, ...(filter === f ? styles.filterBtnActive : {}) }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: "#D4AF37", textAlign: "center", padding: 40 }}>Loading messages...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: "rgba(237,232,216,.5)", textAlign: "center", padding: 40 }}>No messages found.</p>
      ) : (
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span style={{ flex: "0 0 60px" }}>#</span>
            <span style={{ flex: "0 0 140px" }}>Name</span>
            <span style={{ flex: "0 0 120px" }}>Country</span>
            <span style={{ flex: 1 }}>Message</span>
            <span style={{ flex: "0 0 80px" }}>Vis.</span>
            <span style={{ flex: "0 0 70px" }}>Paid</span>
            <span style={{ flex: "0 0 160px" }}>Date</span>
            <span style={{ flex: "0 0 80px" }}>Action</span>
          </div>
          {filtered.map((m) => (
            <div key={m.id} style={{ ...styles.row, opacity: deleting === m.id ? 0.4 : 1 }}>
              <span style={{ flex: "0 0 60px", color: "#D4AF37" }}>#{m.message_number || "—"}</span>
              <span style={{ flex: "0 0 140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name || <span style={{ opacity: 0.4 }}>anonymous</span>}</span>
              <span style={{ flex: "0 0 120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.country || "—"}</span>
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.message}</span>
              <span style={{ flex: "0 0 80px", color: m.visibility === "public" ? "#22c55e" : "#94a3b8", fontSize: ".75rem" }}>{m.visibility}</span>
              <span style={{ flex: "0 0 70px" }}>
                <span style={{ background: m.paid ? "rgba(34,197,94,.15)" : "rgba(239,68,68,.12)", color: m.paid ? "#22c55e" : "#ef4444", padding: "2px 8px", borderRadius: 4, fontSize: ".72rem" }}>
                  {m.paid ? "YES" : "NO"}
                </span>
              </span>
              <span style={{ flex: "0 0 160px", fontSize: ".75rem", color: "rgba(237,232,216,.55)" }}>
                {m.created_at ? new Date(m.created_at).toLocaleString() : "—"}
              </span>
              <span style={{ flex: "0 0 80px" }}>
                <button
                  onClick={() => deleteMessage(m.id)}
                  disabled={deleting === m.id}
                  style={styles.deleteBtn}
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
  filters: { display: "flex", gap: 8, marginBottom: 20 },
  filterBtn: {
    background: "none",
    border: "1px solid rgba(212,175,55,.2)",
    color: "rgba(237,232,216,.5)",
    borderRadius: 4,
    padding: "5px 16px",
    cursor: "pointer",
    fontSize: ".8rem",
  },
  filterBtnActive: {
    background: "rgba(212,175,55,.12)",
    color: "#D4AF37",
    borderColor: "rgba(212,175,55,.5)",
  },
  table: {
    background: "rgba(255,255,255,.025)",
    border: "1px solid rgba(212,175,55,.15)",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    display: "flex",
    gap: 12,
    padding: "10px 16px",
    background: "rgba(212,175,55,.07)",
    fontSize: ".72rem",
    color: "#D4AF37",
    letterSpacing: ".06em",
    textTransform: "uppercase",
    fontWeight: 600,
  },
  row: {
    display: "flex",
    gap: 12,
    padding: "12px 16px",
    borderTop: "1px solid rgba(212,175,55,.08)",
    fontSize: ".82rem",
    alignItems: "center",
  },
  deleteBtn: {
    background: "rgba(239,68,68,.1)",
    border: "1px solid rgba(239,68,68,.3)",
    color: "#ef4444",
    borderRadius: 4,
    padding: "4px 10px",
    cursor: "pointer",
    fontSize: ".75rem",
  },
};
