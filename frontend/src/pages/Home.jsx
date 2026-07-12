import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaComments, FaUsers, FaBell, FaCog } from "react-icons/fa";
import socket from "./socket";
import { API } from "../config";
 
function InjectStyles() {
  useEffect(() => {

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


 
// const DUMMY_USERS = [
//   { id: 1,  name: "Priya Sharma",    username: "@priya_s",   avatar: "PS", color: "#EA6C3A", online: true,  lastMsg: "Hey! Are you free tonight? 🎉",              time: "2m",  unread: 3  },
//   { id: 2,  name: "Arjun Mehta",     username: "@arjun_m",   avatar: "AM", color: "#7C4DFF", online: true,  lastMsg: "Bhai woh file send kar de yaar 😅",           time: "8m",  unread: 1  },
//   { id: 3,  name: "Sneha Kapoor",    username: "@sneha_k",   avatar: "SK", color: "#E91E8C", online: false, lastMsg: "Okay, talk to you later then!",                time: "1h",  unread: 0  },
//   { id: 4,  name: "Rahul Verma",     username: "@rv_dev",    avatar: "RV", color: "#00897B", online: true,  lastMsg: "Just deployed the new feature 🚀",            time: "1h",  unread: 0  },
//   { id: 5,  name: "Ananya Singh",    username: "@ananya",    avatar: "AS", color: "#F4A025", online: false, lastMsg: "Did you see the movie last night?",            time: "3h",  unread: 0  },
//   { id: 6,  name: "Dev Patel",       username: "@devpatel",  avatar: "DP", color: "#1565C0", online: true,  lastMsg: "Let's catch up this weekend 🙌",              time: "5h",  unread: 2  },
//   { id: 7,  name: "Kavya Nair",      username: "@kavya_n",   avatar: "KN", color: "#C62828", online: false, lastMsg: "Thanks for the help yesterday!",              time: "1d",  unread: 0  },
//   { id: 8,  name: "Rohan Gupta",     username: "@rohan_g",   avatar: "RG", color: "#2E7D32", online: true,  lastMsg: "Meeting rescheduled to 4pm 📅",               time: "1d",  unread: 0  },
//   { id: 9,  name: "Meera Joshi",     username: "@meera_j",   avatar: "MJ", color: "#6A1B9A", online: false, lastMsg: "Haha that was so funny 😂",                   time: "2d",  unread: 0  },
//   { id: 10, name: "Aditya Kumar",    username: "@aditya_k",  avatar: "AK", color: "#BF360C", online: true,  lastMsg: "Can you review my PR when you get a chance?", time: "2d",  unread: 0  },
//   { id: 11, name: "Tanvi Reddy",     username: "@tanvi_r",   avatar: "TR", color: "#00838F", online: false, lastMsg: "Let me know if you need anything!",           time: "3d",  unread: 0  },
//   { id: 12, name: "Vikram Bhatt",    username: "@vikram_b",  avatar: "VB", color: "#EF6C00", online: false, lastMsg: "Okay see you tomorrow then 👋",               time: "4d",  unread: 0  },
// ];
 
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const ChatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
  </svg>
);
const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
 
const Avatar = ({ user, size = 44 }) => (
  <div
    className="flex-shrink-0 flex items-center justify-center rounded-full font-bold relative"
    style={{ width: size, height: size, background: user.color, fontSize: size * 0.33, color: "#fff", letterSpacing: "-0.5px" }}
  >
    {user.avatar}
    {user.online && (
      <span className="absolute rounded-full border-2"
        style={{ width: 11, height: 11, background: "#22C55E", borderColor: "#FFFDF9", bottom: 0, right: 0 }} />
    )}
  </div>
);
 
const UserRow = ({ user, selected, onClick }) => (
  <button
    onClick={() => onClick(user)}
    className="w-full flex items-center gap-3 px-4 py-3 transition-all duration-150 text-left"
    style={{
      background: selected ? "rgba(234,108,58,0.10)" : "transparent",
      borderLeft: selected ? "3px solid #EA6C3A" : "3px solid transparent",
    }}
    onMouseEnter={e => { if (!selected) e.currentTarget.style.background = "rgba(234,108,58,0.05)"; }}
    onMouseLeave={e => { if (!selected) e.currentTarget.style.background = "transparent"; }}
  >
    <Avatar user={user} />
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-sm font-semibold truncate" style={{ color: "#2D1B0E" }}>{user.name}</span>
        <span className="text-xs flex-shrink-0 ml-2" style={{ color: "#B8A090" }}>{user.time}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs truncate" style={{ color: "#9A7B6A" }}>{user.lastMsg}</span>
   <span
  className="text-xs font-medium"
  style={{
    color: user.online ? "#22C55E" : "#B8A090"
  }}
>
  {user.online ? "Active" : "Offline"}
</span>
      </div>
    </div>
  </button>
);



 
export default function Home() {
  const navigate = useNavigate(); // ← ADD KIYA
 
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [visible, setVisible] = useState(false);
  const searchRef = useRef(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(()=>{
allusers()
},[])

useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  const username = params.get("username");
  const userid = params.get("userid");

  if (username) {
    localStorage.setItem("UserName", username);
  }

  if (userid) {
    localStorage.setItem("userid", userid);

    socket.io.opts.query = {
      userId: userid,
    };

    socket.connect();
  }

  window.history.replaceState({}, "", "/home");
}, []);

 
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);
 
  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.lastMsg.toLowerCase().includes(search.toLowerCase());
    if (filter === "online") return matchSearch && u.online;
    if (filter === "unread") return matchSearch && u.unread > 0;
    return matchSearch;
  });
 
  const onlineCount = users.filter(u => u.online).length;
  // const unreadCount = users.filter(u => u.unread > 0).length;
  const onlineUsers = users.filter((u) => u.online);
 
  // ─── USER CLICK → CHATROOM NAVIGATE ───────────────────────────
  const handleUserClick = (user) => {
    setSelected(user);
    navigate("/chatroom", { state: { user } }); // ← user object state mein bheja
  };
 
  const fade = (delay) => ({
    transition: `opacity 0.55s ease ${delay}, transform 0.55s ease ${delay}`,
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
  });

  async function allusers() {
  const token = localStorage.getItem("chat-token")
  try {
    const api = await fetch(`${API}/allusers`,{
      method:"GET",
      headers:{
        authorization: token
      }
    })
    const res = await api.json()

    const onlineapi = await fetch(`${API}/onlineusers`,{
      method:"GET",
      headers:{
   authorization:token
}
    })
    const onlineres = await onlineapi.json()
console.log(onlineres);

const onlineIds = onlineres.userids || []

   if(res.success){
   const formattedUsers = res.users.map((user) => ({
      id: user._id,
      name: user.name,
      username: user.email,
      avatar: user.name.slice(0,2).toUpperCase(),
      color: "#EA6C3A",
      online: onlineIds.includes(String(user._id)),
      lastMsg: "Start chatting...",
      time: "now",
     unread: user.unread
   }))

   setUsers(formattedUsers)
}
    
  } catch (error) {
    console.log(error, "error aa raha hai all users ko nikalne mai");
    
  }
}

async function handleLogout() {
  try {
    const api = await fetch(`${API}/logout`,{
      method:"POST",
      credentials:"include"
    })
    const res = await api.json()
    console.log(res);
    if (res.success) {
      socket.disconnect();
      localStorage.removeItem("chat-token")
      localStorage.removeItem("userid")
      localStorage.removeItem("UserName")
      navigate("/login")
      return;
    }
    
  } catch (error) {
    console.log(error, "error aa raha hai logout karne par");
    
  }
}

// useEffect(() => {
//   const params = new URLSearchParams(window.location.search);
//   const googleUsername = params.get("username");

//   if (googleUsername) {
//     localStorage.setItem("UserName", googleUsername);

//     // URL clean kar do
//     window.history.replaceState({}, "", "/home");
//   }
// }, []);

let username = localStorage.getItem("UserName") || "";

const [time, setTime] = useState(new Date());

useEffect(() => {
  const interval = setInterval(() => {
    setTime(new Date());
  }, 1000);

  return () => clearInterval(interval);
}, []);
 
  return (
    <>
      <InjectStyles />
      <style>{`
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #E8DDD4; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #C9956A; }
      `}</style>
 
      <div className="flex flex-col min-h-screen w-full overflow-hidden" style={{ background: "#FAF6F1" }}>
 
        {/* Top Nav */}
        <header className="sticky top-0 z-3000 flex items-center justify-between px-4 sm:px-6 py-3 border-b"
          style={{ background: "rgba(255,253,249,0.92)", backdropFilter: "blur(12px)", borderColor: "#EDE3DA", ...fade("0s") }}>
          <div className="flex items-center gap-2.5">
                                      <img
  src="/chatLogo (2).png"
  alt="Logo"
  className="w-11  h-11 object-contain"
/>
            <span className="text-lg font-bold tracking-tight" style={{ color: "#2D1B0E" }}>ChatCat</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
          <div
  onClick={() => setShowLogoutModal(true)}
  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all duration-200"
  style={{
    background: "rgba(239,68,68,0.10)",
    border: "1px solid rgba(239,68,68,0.18)"
  }}
>
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "#DC2626" }}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>

  <span
    className="text-sm font-semibold"
    style={{ color: "#B91C1C" }}
  >
    Logout
  </span>
</div>
            <button onClick={() => navigate("/notifications")} className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors duration-150 relative"
              style={{ color: "#9A7B6A" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#F5EDE5"; e.currentTarget.style.color = "#EA6C3A"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9A7B6A"; }}>
              <BellIcon />
              
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs cursor-pointer flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#EA6C3A,#7C4DFF)" }}>
             {username.slice(0,2).toUpperCase()} 
            </div>
          </div>
        </header>
 
        {/* Main */}
        <main className="flex-1 flex flex-col max-w-2xl w-full mx-auto px-4 sm:px-6 pt-6 pb-24" style={fade("0.1s")}>
 
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#2D1B0E" }}>Messages</h1>
              <p className="text-sm mt-0.5" style={{ color: "#9A7B6A" }}>{users.length} conversations</p>
            </div>
        <button
  className="sm:flex items-center hidden gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 active:scale-95"
  style={{
    background: "linear-gradient(135deg,#EA6C3A,#D4501E)",
    boxShadow: "0 4px 14px rgba(234,108,58,0.3)"
  }}
  onMouseEnter={e => {
    e.currentTarget.style.transform = "translateY(-1px)";
    e.currentTarget.style.boxShadow = "0 6px 18px rgba(234,108,58,0.4)";
  }}
  onMouseLeave={e => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 4px 14px rgba(234,108,58,0.3)";
  }}
>
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>

  <span className="hidden sm:inline">
{time.toLocaleTimeString([], {
  hour: "2-digit",
  minute: "2-digit"
})}
  </span>
</button>
          </div>
 
          {/* Search */}
          <div className="relative mb-4">
  <span
    className="absolute left-4 inset-y-0 flex items-center justify-center pointer-events-none"
    style={{ color: "#C9956A" }}
  >
    <SearchIcon className="w-4 h-4" />
  </span>

  <input
    ref={searchRef}
    type="text"
    value={search}
    onChange={e => setSearch(e.target.value)}
    placeholder="Search conversations..."
    className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none transition-all duration-200"
    style={{
      background: "#FFFDF9",
      border: "1.5px solid #E8DDD4",
      color: "#2D1B0E"
    }}
    onFocus={e => {
      e.target.style.borderColor = "#EA6C3A";
      e.target.style.boxShadow = "0 0 0 3px rgba(234,108,58,0.1)";
    }}
    onBlur={e => {
      e.target.style.borderColor = "#E8DDD4";
      e.target.style.boxShadow = "none";
    }}
  />

  {search && (
    <button
      onClick={() => setSearch("")}
      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold text-white"
      style={{ background: "#C9956A" }}
    >
      ×
    </button>
  )}
</div>

{/* Active Now */}
<div className="mb-5">
  <div className="flex items-center justify-between mb-3">
    <h3
      className="text-sm font-semibold"
      style={{ color: "#2D1B0E" }}
    >
      Active Now
    </h3>

    <span
      className="text-xs"
      style={{ color: "#9A7B6A" }}
    >
      {onlineUsers.length} online
    </span>
  </div>

  <div className="flex gap-4 overflow-x-auto pb-2">
    {onlineUsers.map((user) => (
      <div
        key={user.id}
        onClick={() => handleUserClick(user)}
        className="flex flex-col items-center cursor-pointer min-w-[70px]"
      >
        <div className="relative">
          <Avatar user={user} size={58} />
        </div>

        <span
          className="text-xs mt-2 truncate max-w-[70px] text-center"
          style={{ color: "#2D1B0E" }}
        >
          {user.name.split(" ")[0]}
        </span>
      </div>
    ))}
  </div>
</div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-5">
            {[
              { key: "all",    label: "All",    count: users.length },
              { key: "online", label: "Online", count: onlineCount  },
              // { key: "unread", label: "Unread", count: unreadCount  },
            ].map(tab => (
              <button key={tab.key} onClick={() => setFilter(tab.key)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-150"
                style={filter === tab.key
                  ? { background: "#EA6C3A", color: "#fff", boxShadow: "0 3px 10px rgba(234,108,58,0.3)" }
                  : { background: "#FFFDF9", color: "#9A7B6A", border: "1.5px solid #E8DDD4" }}>
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
 
          {/* User list */}
          <div className="rounded-2xl overflow-hidden"
            style={{ background: "#FFFDF9", border: "1.5px solid #EDE3DA", boxShadow: "0 4px 24px rgba(180,100,40,0.07)" }}>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="text-4xl mb-3">💬</div>
                <p className="font-semibold mb-1" style={{ color: "#2D1B0E" }}>No conversations found</p>
                <p className="text-sm" style={{ color: "#9A7B6A" }}>
                  {search ? `No results for "${search}"` : "Start a new chat to get going!"}
                </p>
              </div>
            ) : (
              filtered.map((user, i) => (
                <div key={user.id}>
                  <UserRow user={user} selected={selected?.id === user.id} onClick={handleUserClick} />
                  {i < filtered.length - 1 && <div className="mx-4 h-px" style={{ background: "#F5EDE5" }} />}
                </div>
              ))
            )}
          </div>
        </main>
 
        {/* Bottom Nav mobile */}


{showLogoutModal && (
  <div
    className="fixed inset-0 z-[9999] flex items-center justify-center p-5"
    style={{
      background: "rgba(45,27,14,0.45)",
      backdropFilter: "blur(6px)",
      animation: "fadeIn .25s ease"
    }}
    onClick={() => setShowLogoutModal(false)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-md rounded-3xl overflow-hidden"
      style={{
        background: "#FFFDF9",
        border: "1px solid rgba(201,149,106,.25)",
        boxShadow:
          "0 30px 70px rgba(45,27,14,.18)",
        animation: "popup .28s ease"
      }}
    >
      {/* Header */}
      <div
        className="flex justify-center pt-8"
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(234,108,58,.12)"
          }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#EA6C3A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 pt-6 text-center">
        <h2
          className="text-2xl font-bold"
          style={{ color: "#2D1B0E" }}
        >
          Logout?
        </h2>

        <p
          className="mt-3 text-sm leading-7"
          style={{ color: "#6B4A33" }}
        >
          Are you sure you want to logout from your account?
          <br />
          You can login again anytime.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 p-8 pt-7">
        <button
          onClick={() => setShowLogoutModal(false)}
          className="flex-1 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95"
          style={{
            background: "#FAF6F1",
            color: "#2D1B0E",
            border: "1px solid rgba(201,149,106,.35)"
          }}
        >
          No, Stay
        </button>

        <button
          onClick={() => {
            setShowLogoutModal(false);
            handleLogout();
          }}
          className="flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-95"
          style={{
            background:
              "linear-gradient(135deg,#EA6C3A,#C9956A)"
          }}
        >
          Yes, Logout
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </>
  );
}