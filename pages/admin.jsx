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

  const login = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwError(false); }
    else setPwError(true);
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      setMessages(data.messages || []);
    } catch { setMessages([]); }
    finally { setLoading(false); }
  };

  const deleteMessage = async (id) => {
    if (!confirm("Delete this message permanently?")) return;
    setActing(id + "_del");
    try {
      await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch { alert("Failed to delete."); }
    finally { setActing(null); }
  };

  const deleteAllUnpaid = async () => {
    const unpaidCount = messages.filter((m) => !m.paid).length;
    if (unpaidCount === 0) return alert("No unpaid messages to delete.");
    if (!confirm(`Delete ALL ${unpaidCount} unpaid messages permanently?`)) return;
    setActing("bulk_del");
    try {
      const res = await fetch("/api/admin/messages?unpaid_only=1", { method: "DELETE" });
      const data = await res.json();
      setMessages((prev) => prev.filter((m) => m.paid));
      alert(`Deleted ${data.deleted || unpaidCount} unpaid messages.`);
    } catch { alert("Failed to delete unpaid messages."); }
    finally { setActing(null); }
  };

  const markPaid = async (id) => {
    if (!confirm("Manually mark this message as PAID? Only do this if Stripe confirmed the payment.")) return;
    setActing(id + "_pay");
    try {
      await fetch(`/api/admin/messages?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paid: true }),
      });
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, paid: true } : m));
    } catch { alert("Failed to update."); }
    finally { setActing(null); }
  };

  const toggleFlag = async (id, current) => {
    setActing(id + "_flag");
    try {
      await fetch(`/api/admin/messages?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flagged: !current }),
      });
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, flagged: !current } : m));
    } catch { alert("Failed to update."); }
    finally { setActing(null); }
  };

  useEffect(() => { if (authed) fetchMessages(); }, [authed]);

  const filtered = messages.filter((m) => {
    if (filter === "paid" && !m.paid) return false;
    if (filter === "unpaid" && m.paid) return false;
    if (filter === "flagged" && !m.flagged) return false;
    return true;
  });

  if (!authed) {
    return (
      <div style={s.page}>
        <div style={s.loginBox}>
          <h1 style={s.title}>OneMessage Admin</h1>
          <form onSubmit={login}>
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)}
              placeholder="Admin password" autoFocus
              style={{ ...s.input, borderColor: pwError ? "#ef4444" : "rgba(212,175,55,.3)" }} />
            {pwError && <p style={{ color: "#ef4444", fontSize: ".8rem", margin: "4px 0 10px" }}>Incorrect password.</p>}
            <button type="submit" style={s.btn}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  const paidCount = messages.filter((m) => m.paid).length;
  const unpaidCount = messages.filter((m) => !m.paid).length;
  const raised = (paidCount * 0.67).toFixed(2);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>OneMessage Admin</h1>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={s.badge}>{messages.length} total</span>
          <span style={{ ...s.badge, background: "rgba(34,197,94,.15)", color: "#22c55e" }}>{paidCount} paid</span>
          <span style={{ ...s.badge, background: "rgba(239,68,68,.12)", color: "#ef4444" }}>{unpaidCount} unpaid</span>
          <span style={{ ...s.badge, background: "rgba(212,175,55,.12)", color: "#D4AF37" }}>${raised} raised</span>
          <button onClick={fetchMessages} style={s.smBtn} disabled={loading}>↻ Refresh</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        {["all", "paid", "unpaid", "flagged"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ ...s.filterBtn, ...(filter === f ? s.filterActive : {}) }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <button onClick={deleteAllUnpaid} disabled={!!acting || unpaidCount === 0}
          style={{ ...s.smBtn, borderColor: "rgba(239,68,68,.4)", color: "#ef4444", marginLeft: "auto" }}>
          🗑 Delete all unpaid ({unpaidCount})
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#D4AF37", textAlign: "center", padding: 40 }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: "rgba(237,232,216,.4)", textAlign: "center", padding: 40 }}>No messages found.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((m) => (
            <div key={m.id} style={{
              ...s.card,
              borderLeft: m.paid ? "3px solid #22c55e" : "3px solid #ef4444",
              opacity: acting === "bulk_del" || acting?.startsWith(m.id) ? 0.5 : 1,
            }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
                <span style={{ color: "#D4AF37", fontWeight: 700, fontSize: "1rem", minWidth: 36 }}>
                  #{m.message_number || "—"}
                </span>
                <span style={m.paid ? s.tagGreen : s.tagRed}>
                  {m.paid ? "✓ PAID" : "✗ UNPAID"}
                </span>
                <span style={{ fontWeight: 600, fontSize: ".88rem" }}>
                  {m.name || <em style={{ opacity: .5 }}>anonymous</em>}
                </span>
                <span style={{ color: "rgba(237,232,216,.6)", fontSize: ".82rem" }}>{m.country || "—"}</span>
                <span style={s.tagGray}>{m.visibility || "public"}</span>
                <span style={{ color: "rgba(237,232,216,.35)", fontSize: ".72rem", marginLeft: "auto" }}>
                  {m.created_at ? new Date(m.created_at).toLocaleString() : "—"}
                </span>
              </div>

              <div style={s.msgBox}>
                <p style={{
                  margin: 0, lineHeight: 1.65, fontSize: ".88rem",
                  color: "rgba(237,232,216,.9)", whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}>
                  {m.message}
                </p>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                {!m.paid && (
                  <button onClick={() => markPaid(m.id)} disabled={!!acting}
                    style={{ ...s.actionBtn, background: "rgba(34,197,94,.1)", borderColor: "rgba(34,197,94,.4)", color: "#22c55e" }}>
                    ✓ Mark as Paid
                  </button>
                )}
                <button onClick={() => toggleFlag(m.id, m.flagged)} disabled={!!acting}
                  style={{ ...s.actionBtn, ...(m.flagged ? s.flagActive : s.flagBtn) }}>
                  {m.flagged ? "🚩 Flagged" : "Flag"}
                </button>
                <button onClick={() => deleteMessage(m.id)} disabled={!!acting}
                  style={{ ...s.actionBtn, ...s.deleteBtn }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { background: "#05070F", minHeight: "100vh", color: "#EDE8D8", fontFamily: "'DM Sans',sans-serif", padding: "32px 20px", maxWidth: 900, margin: "0 auto" },
  loginBox: { maxWidth: 360, margin: "100px auto 0", background: "rgba(255,255,255,.034)", border: "1px solid rgba(212,175,55,.17)", borderRadius: 10, padding: "40px 32px" },
  title: { fontFamily: "Georgia,serif", color: "#D4AF37", fontSize: "1.5rem", marginBottom: 20 },
  input: { width: "100%", background: "rgba(255,255,255,.05)", border: "1px solid", borderRadius: 4, color: "#EDE8D8", padding: "10px 14px", fontSize: ".95rem", outline: "none", display: "block", marginBottom: 8, boxSizing: "border-box" },
  btn: { width: "100%", background: "linear-gradient(135deg,#D4AF37,#9A7A0A)", color: "#000", border: "none", borderRadius: 4, padding: "11px", fontSize: ".95rem", fontWeight: 700, cursor: "pointer" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 },
  badge: { background: "rgba(212,175,55,.1)", color: "#D4AF37", padding: "4px 12px", borderRadius: 20, fontSize: ".75rem", fontWeight: 600 },
  smBtn: { background: "rgba(255,255,255,.04)", border: "1px solid rgba(212,175,55,.25)", color: "#D4AF37", borderRadius: 4, padding: "5px 12px", cursor: "pointer", fontSize: ".78rem" },
  filterBtn: { background: "none", border: "1px solid rgba(212,175,55,.2)", color: "rgba(237,232,216,.5)", borderRadius: 4, padding: "5px 14px", cursor: "pointer", fontSize: ".78rem" },
  filterActive: { background: "rgba(212,175,55,.12)", color: "#D4AF37", borderColor: "rgba(212,175,55,.5)" },
  card: { background: "rgba(255,255,255,.025)", border: "1px solid rgba(212,175,55,.1)", borderRadius: 8, padding: "16px 18px" },
  msgBox: { background: "rgba(0,0,0,.25)", border: "1px solid rgba(212,175,55,.08)", borderRadius: 5, padding: "12px 14px" },
  tagGreen: { background: "rgba(34,197,94,.12)", color: "#22c55e", padding: "2px 8px", borderRadius: 4, fontSize: ".72rem", fontWeight: 700 },
  tagRed: { background: "rgba(239,68,68,.12)", color: "#ef4444", padding: "2px 8px", borderRadius: 4, fontSize: ".72rem", fontWeight: 700 },
  tagGray: { background: "rgba(148,163,184,.1)", color: "#94a3b8", padding: "2px 8px", borderRadius: 4, fontSize: ".72rem" },
  actionBtn: { border: "1px solid", borderRadius: 4, padding: "4px 12px", cursor: "pointer", fontSize: ".75rem", fontWeight: 500 },
  flagBtn: { background: "rgba(251,191,36,.07)", borderColor: "rgba(251,191,36,.3)", color: "#fbbf24" },
  flagActive: { background: "rgba(251,191,36,.15)", borderColor: "rgba(251,191,36,.5)", color: "#fbbf24" },
  deleteBtn: { background: "rgba(239,68,68,.07)", borderColor: "rgba(239,68,68,.3)", color: "#ef4444" },
};
