import { useState } from "react";
import { supabase } from "./supabase";
export default function Auth() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        if (data.user) {
          await supabase.from("profiles").insert({
            user_id: data.user.id,
            name: name,
          });
        }
        setMessage("Перевір пошту — надіслано лист для підтвердження.");
      }
    }
    setLoading(false);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };
  return (
    <div style={s.overlay}>
      <div style={s.card}>
        {/* Logo */}
        <div style={s.logoRow}>
          <div style={s.logoMark}>IC</div>
          <span style={s.logoText}>IRONCREW</span>
        </div>
        <p style={s.tagline}>Соціальна мережа для залу</p>
        <h1 style={s.heading}>
          {mode === "login" ? "Вхід" : "Реєстрація"}
        </h1>
        {/* Toggle */}
        <div style={s.toggle}>
          <button
            style={s.toggleBtn(mode === "login")}
            onClick={() => {
              setMode("login");
              setError(null);
              setMessage(null);
            }}
          >
Увійти
          </button>
          <button
            style={s.toggleBtn(mode === "register")}
            onClick={() => {
              setMode("register");
              setError(null);
              setMessage(null);
            }}
          >
Зареєструватись
          </button>
        </div>
        {/* Name — тільки для реєстрації */}
        {mode === "register" && (
          <div style={s.field}>
            <label style={s.label}>Ім'я</label>
            <input
              style={s.input}
              type="text"
              placeholder="Твоє ім'я"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="name"
            />
          </div>
        )}
        {/* Email */}
        <div style={s.field}>
          <label style={s.label}>Email</label>
          <input
            style={s.input}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="email"
          />
        </div>
        {/* Password */}
        <div style={s.field}>
          <label style={s.label}>Пароль</label>
          <input
            style={s.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </div>
        {/* Error / Success */}
        {error && <div style={s.error}>{error}</div>}
        {message && <div style={s.success}>{message}</div>}
        {/* Submit */}
        <button
          style={s.btn(loading)}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? "Завантаження..."
            : mode === "login"
            ? "УВІЙТИ"
            : "ЗАРЕЄСТРУВАТИСЬ"}
        </button>
      </div>
    </div>
  );
}
/* ── Styles ─────────────────────────────────────────────── */
const ACCENT = "#e8ff47";
const BG = "#0a0a0a";
const CARD_BG = "#111111";
const BORDER = "#222222";
const TEXT = "#f5f5f5";
const MUTED = "#555555";
const s = {
  overlay: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: BG,
    fontFamily: "'DM Mono', 'Courier New', monospace",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: "40px 36px",
    background: CARD_BG,
    border: `1px solid ${BORDER}`,
    boxShadow: `4px 4px 0px ${BORDER}`,
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  logoMark: {
    width: 28,
    height: 28,
    background: ACCENT,
    color: BG,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: "0.05em",
  },
  logoText: {
    fontSize: 11,
    letterSpacing: "0.3em",
    color: ACCENT,
    fontWeight: 700,
    textTransform: "uppercase",
  },
  tagline: {
    fontSize: 11,
    color: MUTED,
    margin: "0 0 24px",
    letterSpacing: "0.05em",
  },
  heading: {
    fontSize: 30,
    fontWeight: 800,
    color: TEXT,
    margin: "0 0 24px",
    letterSpacing: "-0.03em",
    lineHeight: 1,
  },
  toggle: {
    display: "flex",
    gap: 0,
    marginBottom: 24,
    border: `1px solid ${BORDER}`,
  },
  toggleBtn: (active) => ({
    flex: 1,
    background: active ? ACCENT : "transparent",
    border: "none",
    borderRight: `1px solid ${BORDER}`,
    color: active ? BG : MUTED,
    padding: "9px 0",
    fontSize: 10,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: active ? 700 : 400,
    transition: "all 0.15s",
  }),
  field: {
    marginBottom: 14,
  },
  label: {
    display: "block",
    fontSize: 10,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: MUTED,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    background: BG,
    border: `1px solid ${BORDER}`,
    color: TEXT,
    padding: "11px 13px",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
  },
  error: {
    background: "#1a0a0a",
    border: "1px solid #4a1010",
    color: "#ff6b6b",
    padding: "10px 13px",
    fontSize: 12,
    marginBottom: 14,
  },
  success: {
    background: "#0a1a0a",
    border: "1px solid #1a4a1a",
    color: "#6bff6b",
    padding: "10px 13px",
    fontSize: 12,
    marginBottom: 14,
  },
  btn: (loading) => ({
    width: "100%",
    background: loading ? BORDER : ACCENT,
    border: "none",
    color: loading ? MUTED : BG,
    padding: "13px",
    fontSize: 11,
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    fontFamily: "inherit",
    fontWeight: 800,
    cursor: loading ? "not-allowed" : "pointer",
    marginTop: 8,
    transition: "opacity 0.15s",
  }),
};