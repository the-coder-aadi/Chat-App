import { useEffect, useState } from "react";
 import { API } from "../config";
function InjectStyles() {
  useEffect(() => {
    if (!document.getElementById("tw-cdn")) {
      const s = document.createElement("script");
      s.id = "tw-cdn";
      s.src = "https://cdn.tailwindcss.com";
      document.head.appendChild(s);
    }
    if (!document.getElementById("gf-inter")) {
      const l = document.createElement("link");
      l.id = "gf-inter";
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap";
      document.head.appendChild(l);
    }
  }, []);
  return null;
}
 
// ─── Icons ────────────────────────────────────────────────────────
const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);
const ChatLogo = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const CheckAllIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12l5 5L22 4"/><path d="M7 12l5 5"/>
  </svg>
);
const MsgIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const UserPlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
  </svg>
);
const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
 
// ─── Notification type config ─────────────────────────────────────
const getTypeConfig = (text = "") => {
  const t = text.toLowerCase();
  if (t.includes("message") || t.includes("msg") || t.includes("sent"))
    return { icon: <MsgIcon />, bg: "#FFF0E8", color: "#EA6C3A", label: "Message" };
  if (t.includes("request") || t.includes("friend") || t.includes("follow") || t.includes("join"))
    return { icon: <UserPlusIcon />, bg: "#EEF2FF", color: "#6366F1", label: "Request" };
  if (t.includes("react") || t.includes("like") || t.includes("love") || t.includes("❤"))
    return { icon: <HeartIcon />, bg: "#FFF0F3", color: "#F43F5E", label: "Reaction" };
  return { icon: <AlertIcon />, bg: "#F0FAF4", color: "#22C55E", label: "Update" };
};
 
// ─── Time formatter ───────────────────────────────────────────────
const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now   = new Date();
  const diffMs   = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs  = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
 
  const timeStr = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const dateStr2 = date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
 
  if (diffMins < 1)   return { relative: "Just now",          full: timeStr };
  if (diffMins < 60)  return { relative: `${diffMins}m ago`,  full: timeStr };
  if (diffHrs  < 24)  return { relative: `${diffHrs}h ago`,   full: timeStr };
  if (diffDays < 7)   return { relative: `${diffDays}d ago`,  full: `${dateStr2}, ${timeStr}` };
  return               { relative: dateStr2,                   full: `${dateStr2}, ${timeStr}` };
};
 
// ─── Group notifications by date ──────────────────────────────────
const groupByDate = (notifications) => {
  const groups = {};
  notifications.forEach((n) => {
    const date = n.createdAt ? new Date(n.createdAt) : new Date();
    const today     = new Date();
    const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
    let label;
    if (date.toDateString() === today.toDateString())     label = "Today";
    else if (date.toDateString() === yesterday.toDateString()) label = "Yesterday";
    else label = date.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" });
    if (!groups[label]) groups[label] = [];
    groups[label].push(n);
  });
  return groups;
};
 
// ─── Single Notification Card ─────────────────────────────────────
const NotifCard = ({ n, onDismiss, visible }) => {
  const cfg  = getTypeConfig(n.text);
  const time = formatTime(n.createdAt);
  const isUnread = !n.read;
 
  return (
    <div
      className="group relative flex items-start gap-3 p-4 rounded-2xl transition-all duration-200"
      style={{
        background: isUnread ? "#FFFDF9" : "#FAF6F1",
        border: `1.5px solid ${isUnread ? "#EDE3DA" : "#F0E8E0"}`,
        boxShadow: isUnread ? "0 2px 12px rgba(180,100,40,0.07)" : "none",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.4s ease, transform 0.4s ease, background 0.2s",
      }}
    >
      {/* Unread dot */}
      {isUnread && (
        <span className="absolute top-4 right-4 w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: "#EA6C3A" }} />
      )}
 
      {/* Icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: cfg.bg, color: cfg.color }}>
        {cfg.icon}
      </div>
 
      {/* Content */}
      <div className="flex-1 min-w-0 pr-4">
        {/* Type label */}
        <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-1.5"
          style={{ background: cfg.bg, color: cfg.color }}>
          {cfg.label}
        </span>
        <p className="text-sm leading-relaxed" style={{ color: "#2D1B0E" }}>{n.text}</p>
        {/* Time */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#B8A090" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
          </svg>
          <span className="text-xs" style={{ color: "#B8A090" }}>
            {time.relative}
            {time.relative !== time.full && (
              <span style={{ color: "#C9B5A8" }}> · {time.full}</span>
            )}
          </span>
        </div>
      </div>
 
      {/* Dismiss btn */}
      <button
        onClick={() => onDismiss(n._id)}
        className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-150 absolute top-3 right-3"
        style={{ color: "#C9956A" }}
        onMouseEnter={e => { e.currentTarget.style.background = "#F5EDE5"; e.currentTarget.style.color = "#EA6C3A"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#C9956A"; }}
      >
        <TrashIcon />
      </button>
    </div>
  );
};
 
// ─── Empty State ──────────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
      style={{ background: "linear-gradient(135deg,#EA6C3A,#D4501E)", boxShadow: "0 8px 24px rgba(234,108,58,0.22)" }}>
      <BellIcon />
    </div>
    <h3 className="text-lg font-bold mb-2" style={{ color: "#2D1B0E" }}>All caught up!</h3>
    <p className="text-sm max-w-xs" style={{ color: "#9A7B6A" }}>
      You have no notifications right now. We'll let you know when something comes up.
    </p>
  </div>
);
 
// ─── Skeleton loader ──────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="flex items-start gap-3 p-4 rounded-2xl border animate-pulse"
    style={{ background: "#FFFDF9", borderColor: "#EDE3DA" }}>
    <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ background: "#F5EDE5" }} />
    <div className="flex-1 space-y-2">
      <div className="h-3 w-16 rounded-full" style={{ background: "#F5EDE5" }} />
      <div className="h-3.5 w-3/4 rounded-full" style={{ background: "#EDE3DA" }} />
      <div className="h-3 w-1/3 rounded-full" style={{ background: "#F5EDE5" }} />
    </div>
  </div>
);
 
// ─── Main Component ───────────────────────────────────────────────
export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [visible,       setVisible]       = useState(false);
  const [filter,        setFilter]        = useState("all"); // "all" | "unread"
 
  useEffect(() => {
    getNotifications();
    deleteNotifications()
  }, []);
 
  async function getNotifications() {
    setLoading(true);
    const token = localStorage.getItem("chat-token");
    try {
      const api = await fetch(`${API}/notifications`, {
        method: "GET",
        headers: { authorization: token },
      });
      const res = await api.json();
      if (res.success) {
        setNotifications(res.notifications);
        setTimeout(() => setVisible(true), 60);
      }
    } catch (err) {
      console.log("Notification fetch error:", err);
    } finally {
      setLoading(false);
      setTimeout(() => setVisible(true), 60);
    }
  }

  async function deleteNotifications() {

    const token = localStorage.getItem("chat-token");

    try {
        await fetch(`${API}/read-notification`, {

            method: "DELETE",

            headers: {
                authorization: token
            }
        });

    } catch (err) {

        console.log(err);

    }
}
 
const handleDismiss = async (id) => {
  const token = localStorage.getItem("chat-token");

  try {
    const api = await fetch(
      `${API}/notifications/${id}`,
      {
        method: "DELETE",
        headers: {
          authorization: token
        }
      }
    );

    const res = await api.json();

    if (res.success) {
      setNotifications((prev) =>
        prev.filter((n) => n._id !== id)
      );
    }

  } catch (error) {
    console.log(error);
  }
};
const handleMarkAllRead = async () => {
  const token = localStorage.getItem("chat-token");

  try {
    const api = await fetch(
      `${API}/notifications/mark-all-read`,
      {
        method: "PATCH",
        headers: {
          authorization: token
        }
      }
    );

    const res = await api.json();

    if (res.success) {
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          read: true
        }))
      );
    }

  } catch (error) {
    console.log(error);
  }
};
const handleClearAll = async () => {
  const token = localStorage.getItem("chat-token");

  try {
    const api = await fetch(
      `${API}/notifications/clear-all`,
      {
        method: "DELETE",
        headers: {
          authorization: token
        }
      }
    );

    const res = await api.json();

    if (res.success) {
      setNotifications([]);
    }
  } catch (error) {
    console.log(error);
  }
};
 
  const filtered = filter === "unread"
    ? notifications.filter((n) => !n.read)
    : notifications;
 
  const unreadCount = notifications.filter((n) => !n.read).length;
  const groups = groupByDate(filtered);
 
  const fade = (delay = "0s") => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 0.5s ease ${delay}, transform 0.5s ease ${delay}`,
  });
 
  return (
    <>
      <InjectStyles />
      <style>{`
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #E8DDD4; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #C9956A; }
        @keyframes pulse {
          0%,100% { opacity: 1; } 50% { opacity: 0.5; }
        }
        .animate-pulse { animation: pulse 1.8s ease-in-out infinite; }
      `}</style>
 
      <div className="min-h-screen w-full" style={{ background: "#FAF6F1" }}>
 
        {/* ── Top Nav ── */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 border-b"
          style={{
            background: "rgba(255,253,249,0.94)",
            backdropFilter: "blur(12px)",
            borderColor: "#EDE3DA",
            ...fade("0s"),
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors duration-150"
              style={{ color: "#EA6C3A" }}
              onMouseEnter={e => e.currentTarget.style.background = "#F5EDE5"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <BackIcon />
            </button>
            <div className="flex items-center gap-2">
                                                              <img
  src="/chatLogo (2).png"
  alt="Logo"
  className="w-10  h-10 object-contain"
/>
    
              <span className="text-base font-bold tracking-tight" style={{ color: "#2D1B0E" }}>ChatCat</span>
            </div>
          </div>
 
          {/* Unread badge */}
          {unreadCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: "rgba(234,108,58,0.10)" }}>
              <span className="w-2 h-2 rounded-full" style={{ background: "#EA6C3A" }} />
              <span className="text-xs font-semibold" style={{ color: "#EA6C3A" }}>
                {unreadCount} unread
              </span>
            </div>
          )}
        </header>
 
        {/* ── Page content ── */}
        <div className="max-w-xl mx-auto px-4 sm:px-6 pt-6 pb-16">
 
          {/* Page heading */}
          <div className="flex items-start justify-between mb-5" style={fade("0.05s")}>
            <div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#2D1B0E" }}>
                Notifications
              </h1>
              <p className="text-sm mt-0.5" style={{ color: "#9A7B6A" }}>
                {notifications.length > 0
                  ? `${notifications.length} total · ${unreadCount} unread`
                  : "Nothing new right now"}
              </p>
            </div>
 
            {/* Action buttons */}
            {notifications.length > 0 && (
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150"
                    style={{ background: "#FFF0E8", color: "#EA6C3A", border: "1.5px solid #F5DDD0" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#FFE4D0"}
                    onMouseLeave={e => e.currentTarget.style.background = "#FFF0E8"}
                  >
                    <CheckAllIcon /> <span className="hidden sm:inline">Mark all read</span>
                  </button>
                )}
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150"
                  style={{ background: "#FAF6F1", color: "#9A7B6A", border: "1.5px solid #E8DDD4" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#F5EDE5"; e.currentTarget.style.color = "#EA6C3A"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#FAF6F1"; e.currentTarget.style.color = "#9A7B6A"; }}
                >
                  <TrashIcon /> <span className="hidden sm:inline">Clear all</span>
                </button>
              </div>
            )}
          </div>
 
          {/* Filter tabs */}
          {notifications.length > 0 && (
            <div className="flex gap-2 mb-5" style={fade("0.1s")}>
              {[
                { key: "all",    label: "All",    count: notifications.length },
                { key: "unread", label: "Unread", count: unreadCount },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-150"
                  style={filter === tab.key
                    ? { background: "#EA6C3A", color: "#fff", boxShadow: "0 3px 10px rgba(234,108,58,0.28)" }
                    : { background: "#FFFDF9", color: "#9A7B6A", border: "1.5px solid #E8DDD4" }}
                >
                  {tab.label}
                  <span className="text-xs rounded-full px-1.5 py-0.5 font-semibold"
                    style={filter === tab.key
                      ? { background: "rgba(255,255,255,0.25)", color: "#fff" }
                      : { background: "#F5EDE5", color: "#EA6C3A" }}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          )}
 
          {/* Loading skeleton */}
          {loading && (
            <div className="flex flex-col gap-3">
              {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          )}
 
          {/* Empty state */}
          {!loading && filtered.length === 0 && <EmptyState />}
 
          {/* Grouped notifications */}
          {!loading && filtered.length > 0 && (
            <div className="flex flex-col gap-6">
              {Object.entries(groups).map(([dateLabel, items], gi) => (
                <div key={dateLabel} style={fade(`${0.12 + gi * 0.06}s`)}>
                  {/* Date group header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-px" style={{ background: "#EDE3DA" }} />
                    <span className="text-xs font-semibold px-2 py-1 rounded-full"
                      style={{ background: "#F5EDE5", color: "#C9956A", letterSpacing: "0.03em" }}>
                      {dateLabel}
                    </span>
                    <div className="flex-1 h-px" style={{ background: "#EDE3DA" }} />
                  </div>
 
                  {/* Cards */}
                  <div className="flex flex-col gap-2.5">
                    {items.map((n, i) => (
                      <NotifCard
                        key={n._id}
                        n={n}
                        onDismiss={handleDismiss}
                        visible={visible}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}