import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
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

const DUMMY_MESSAGES = {
  1: [
    { id: 1, from: "them", text: "Hey! Are you free tonight? 🎉", time: "7:10 PM" },
    { id: 2, from: "me", text: "Haan bata, kya plan hai?", time: "7:12 PM" },
    { id: 3, from: "them", text: "Let's go for dinner and then maybe a movie? 🎬", time: "7:13 PM" },
    { id: 4, from: "me", text: "Sounds amazing! Which movie? 🍿", time: "7:14 PM" },
    { id: 5, from: "them", text: "Not sure yet, let's decide when we meet 😄", time: "7:15 PM" },
  ],
  2: [
    { id: 1, from: "them", text: "Bhai woh file send kar de yaar 😅", time: "6:50 PM" },
    { id: 2, from: "me", text: "Kaunsi file? Design wali?", time: "6:52 PM" },
    { id: 3, from: "them", text: "Haan wahi, login screen wali", time: "6:53 PM" },
    { id: 4, from: "me", text: "Ek second, upload kar raha hoon 🔄", time: "6:55 PM" },
  ],
  default: [
    { id: 1, from: "them", text: "Hey there! 👋", time: "5:00 PM" },
    { id: 2, from: "me", text: "Hi! How are you?", time: "5:01 PM" },
    { id: 3, from: "them", text: "Doing great, thanks! 😊", time: "5:02 PM" },
  ],
};

// ─── Icons ────────────────────────────────────────────────────────
const BackIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>;
const SendIcon = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>;
const DotsIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="5" cy="12" r="1.2" /><circle cx="12" cy="12" r="1.2" /><circle cx="19" cy="12" r="1.2" /></svg>;
const EmojiIcon = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 13s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>;
const AttachIcon = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>;
const ChatLogo = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" /></svg>;
const DotIcon = () => <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="4" r="2" /><circle cx="10" cy="10" r="2" /><circle cx="10" cy="16" r="2" /></svg>;

const REACTIONS = ["❤️", "😂", "😮", "😢", "👍"];

// ─── Avatar ───────────────────────────────────────────────────────
const Avatar = ({ user, size = 40 }) => (
  <div className="relative flex-shrink-0 flex items-center justify-center rounded-full font-bold text-white"
    style={{ width: size, height: size, background: user.color, fontSize: size * 0.32, letterSpacing: "-0.5px" }}>
    {user.avatar}
    {user.online && (
      <span className="absolute rounded-full border-2"
        style={{ width: 11, height: 11, background: "#22C55E", borderColor: "#FFFDF9", bottom: 0, right: 0 }} />
    )}
  </div>
);

// ─── FIXED PORTAL MENU ────────────────────────────────────────────
// Renders at document.body level via a fixed div → never clipped by any parent
const ContextMenu = ({ anchorRect, isMe, onCopy, onReply, onEdit, onDelete, onReact, onClose,  isFile, }) => {
  const menuRef = useRef(null);

  // Calculate position: appear above the anchor point, flip if too close to bottom
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!anchorRect || !menuRef.current) return;
    const menuH = menuRef.current.offsetHeight || 240;
    const menuW = menuRef.current.offsetWidth || 176;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Vertical: prefer above the click point
    let top = anchorRect.top - menuH - 8;
    if (top < 8) top = anchorRect.bottom + 8; // flip below if no space above
    if (top + menuH > vh - 8) top = vh - menuH - 8; // clamp bottom

    // Horizontal: align to click side
    let left = isMe ? anchorRect.right - menuW : anchorRect.left;
    if (left + menuW > vw - 8) left = vw - menuW - 8;
    if (left < 8) left = 8;

    setPos({ top, left });
  }, [anchorRect, isMe]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        zIndex: 99999,
        width: 180,
        borderRadius: 16,
        background: "rgba(255,255,255,0.98)",
        border: "1px solid #F1E6DD",
        boxShadow: "0 12px 40px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.06)",
        backdropFilter: "blur(16px)",
        overflow: "hidden",
        animation: "menuPop 160ms cubic-bezier(0.22,1,0.36,1)",
        transformOrigin: isMe ? "top right" : "top left",
      }}
    >
      {/* Reaction row */}
      <div style={{ padding: "10px 12px 6px", borderBottom: "1px solid #F5EDE5" }}>
        <div style={{ display: "flex", gap: 6, justifyContent: "space-between" }}>
          {REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => { onReact(emoji); onClose(); }}
              style={{
                fontSize: 20,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px 4px",
                borderRadius: 8,
                transition: "transform 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.3)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      {[
  {
    label: "📋 Copy",
    onClick: onCopy,
    show: !isFile,   // image me hide
    danger: false
  },
  {
    label: "↩ Reply",
    onClick: onReply,
    show: true,      // image me bhi dikhana
    danger: false
  },
  {
    label: "✏ Edit",
    onClick: onEdit,
    show: isMe && !isFile, // image me hide
    danger: false
  },
  {
    label: "🗑 Delete",
    onClick: onDelete,
    show: isMe,      // image me bhi dikhana
    danger: true
  }
].filter(a => a.show).map((action) => (
        <button
          key={action.label}
          onClick={() => { action.onClick(); onClose(); }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            padding: "9px 16px",
            fontSize: 13,
            fontWeight: 500,
            fontFamily: "Inter, sans-serif",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            color: action.danger ? "#EF4444" : "#2D1B0E",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#FAF6F1"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
};



// ─── Message Bubble ───────────────────────────────────────────────
const Bubble = ({
  msg, user,
  openMenu, setOpenMenu, menuAnchor, setMenuAnchor,
  setReplyingTo, handleSwipeReply,
  handleReact, handleDelete,
  setEditingMsg, setInput, inputRef, bottomRef,setPreviewImage
}) => {
  const isMe = msg.from === "me";
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const longPressTimer = useRef(null);
  const dotBtnRef = useRef(null);

  const openContextMenu = () => {
    if (!dotBtnRef.current) return;
    const rect = dotBtnRef.current.getBoundingClientRect();
    setMenuAnchor({ rect, msgId: msg.id, isMe });
    setOpenMenu(msg.id);
  };

  return (
    <div
      className={`group relative transition-transform duration-200 flex items-center mb-2 ${isMe ? "justify-end" : "justify-start"}`}
      onTouchStart={(e) => {
        touchStartX.current = e.changedTouches[0].clientX;
        longPressTimer.current = setTimeout(openContextMenu, 500);
      }}
      onTouchMove={() => clearTimeout(longPressTimer.current)}
      onTouchEnd={(e) => {
        clearTimeout(longPressTimer.current);
        touchEndX.current = e.changedTouches[0].clientX;
        const diff = touchEndX.current - touchStartX.current;
        if (isMe && diff < -60) handleSwipeReply(msg);
        if (!isMe && diff > 60) handleSwipeReply(msg);
      }}
    >
      {/* Receiver avatar */}
      {!isMe && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white mr-2"
          style={{ background: user.color }}>
          {user.avatar}
        </div>
      )}

      {/* Sender dots (left of bubble) */}
      {isMe && (
        <button
          ref={dotBtnRef}
          onClick={openContextMenu}
          className="hidden min-[500px]:flex cursor-pointer mr-1 flex-shrink-0 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200"
          style={{ color: "#C9956A" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#FFF0E8"; e.currentTarget.style.color = "#EA6C3A"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#C9956A"; }}
        >
          <DotIcon />
        </button>
      )}

      {/* Bubble */}
      <div
        className="max-w-[62%] sm:max-w-[55%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words"
        style={isMe
          ? { background: "linear-gradient(135deg,#EA6C3A,#D4501E)", color: "#fff", borderBottomRightRadius: 5 }
          : { background: "#FFFDF9", color: "#2D1B0E", border: "1.5px solid #EDE3DA", borderBottomLeftRadius: 5 }}
      >
        {/* Reply preview */}
        {msg.replyTo && (
          <div className="mb-2 px-3 py-2 rounded-xl"
            style={{ background: isMe ? "rgba(255,255,255,0.15)" : "#F7EFE8" }}>
            <p className="text-[11px] font-semibold opacity-70">
              {msg.replyTo.from === "me" ? "You" : user.name}
            </p>
        {msg.replyTo.file ? (
  <img
    src={msg.replyTo.file}
    className="w-12 h-12 rounded object-cover mt-1"
  />
) : (
  <p className="text-xs truncate opacity-90">
    {msg.replyTo.text}
  </p>
)}
          </div>
        )}

        {msg.text}

{msg.file && (
  <>
    {msg.fileType?.startsWith("image") && (
      <img
        src={msg.file}
        className="rounded-xl mt-2 w-full max-w-[250px]"
        onClick={() => setPreviewImage(msg.file)}
      />
    )}

    {msg.fileType?.startsWith("video") && (
      <video
        controls
        className="rounded-xl mt-2 w-full max-w-[250px]"
      >
        <source src={msg.file} type={msg.fileType} />
      </video>
    )}

    {msg.fileType === "application/pdf" && (
      <a
        href={msg.file}
        target="_blank"
        rel="noreferrer"
        className="text-white-200 underline mt-2 block"
      >
        📄 Open PDF
      </a>
    )}
  </>
)}

{msg.uploading && (

<p className="text-xs mt-1">

Uploading...

</p>

)}

        <span className="block text-right mt-2"
          style={{ fontSize: 10, color: isMe ? "rgba(255,255,255,0.65)" : "#B8A090" }}>
          {msg.time}{msg.edited && " • edited"}
        </span>

        {/* Reactions */}
        {msg.reactions?.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {msg.reactions.map((emoji, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full bg-white shadow text-sm">{emoji}</span>
            ))}
          </div>
        )}
      </div>

      {/* Receiver dots (right of bubble) */}
      {!isMe && (
        <button
          ref={dotBtnRef}
          onClick={openContextMenu}
          className="hidden min-[500px]:flex cursor-pointer ml-1 flex-shrink-0 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200"
          style={{ color: "#C9956A" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#FFF0E8"; e.currentTarget.style.color = "#EA6C3A"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#C9956A"; }}
        >
          <DotIcon />
        </button>
      )}
    </div>
  );
};

// ─── ChatRoom ─────────────────────────────────────────────────────
export default function ChatRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const selectedUser = location.state?.user;
  const activeUser = selectedUser || null;
  const myuserid = localStorage.getItem("userid");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);


  const [openMenu, setOpenMenu] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null); // { rect, msgId, isMe }
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMsg, setEditingMsg] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [Type, setTyping] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  

  // ── Close menu on Escape ──────────────────────────────────────
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setOpenMenu(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── Scroll to bottom ─────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, Type]);

  // ── Redirect if no user ──────────────────────────────────────
  useEffect(() => {
    if (!activeUser) navigate("/home");
  }, [activeUser, navigate]);

  // ── Socket: receive message ───────────────────────────────────
  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(),
        from: data.senderId === myuserid ? "me" : "them",
        text: data.message,
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        createdAt: data.createdAt || new Date().toISOString(),
        replyTo: data.replyTo || null,
        reactions: data.reactions || [],
        edited: data.edited || false,
      }]);
    });
    return () => socket.off("receive-message");
  }, []);


  useEffect(()=>{

socket.on("receive-file",(data)=>{

setMessages(prev=>[

...prev,

{

id:data.id,

from:"them",

file:data.file,

fileType:data.fileType,

createdAt:data.createdAt,

time:new Date(data.createdAt).toLocaleTimeString("en-US",{

hour:"2-digit",

minute:"2-digit"

})

}

])

})

return ()=>socket.off("receive-file")

},[])

  // ── Socket: reaction ─────────────────────────────────────────
  useEffect(() => {
    socket.on("receive-reaction", ({ msgId, reactions }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === msgId
            ? { ...msg, reactions }
            : msg
        )
      );
    });
    return () => socket.off("receive-reaction");
  }, []);

  // ── Socket: delete ───────────────────────────────────────────
  useEffect(() => {
    socket.on("message-deleted", ({ msgId }) => {
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
    });
    return () => socket.off("message-deleted");
  }, []);

  // ── Socket: edit ─────────────────────────────────────────────
  useEffect(() => {
    socket.on("message-edited", ({ msgId, newText }) => {
      setMessages((prev) => prev.map((m) =>
        m.id === msgId ? { ...m, text: newText, edited: true } : m
      ));
    });
    return () => socket.off("message-edited");
  }, []);

  // ── Socket: typing ───────────────────────────────────────────
  useEffect(() => {
    socket.on("user-typing", () => setTyping(true));
    socket.on("user-stop-typing", () => setTyping(false));
    return () => { socket.off("user-typing"); socket.off("user-stop-typing"); };
  }, []);

  // ── Socket: seen ─────────────────────────────────────────────
  useEffect(() => {
    if (!selectedUser) return;
    socket.emit("mark-seen", { senderId: selectedUser.id, receiverId: myuserid });
    socket.on("msg-seen", (data) => {
      console.log("seen:", myuserid, "by:", data.by);
    });
    return () => socket.off("msg-seen");
  }, []);

  // ── Fetch messages ────────────────────────────────────────────
  useEffect(() => { fetchmsgs(); }, []);

  async function fetchmsgs() {
    const token = localStorage.getItem("chat-token");
    const receiverId = selectedUser?.id;
    try {
      const api = await fetch(`${API}/msgdata/${receiverId}`, {
        method: "POST",
        headers: { authorization: token },
      });
      const res = await api.json();
      if (res.success) {
        setMessages(res.msgs.map((msg) => ({
          id: msg._id,
          from: msg.senderId === myuserid ? "me" : "them",
          text: msg.message,
          file:msg.fileUrl,
fileType:msg.fileType,
          time: new Date(msg.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          createdAt: msg.createdAt,
          replyTo: msg.replyTo || null,
          reactions: msg.reactions || [],
          edited: msg.edited || false,
        })));
      }
    } catch (err) {
      console.log("fetchmsgs error:", err);
    }
  }

  // ── Date label helper ─────────────────────────────────────────
  const getDateLabel = (date) => {
    const msgDate = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (msgDate.toDateString() === today.toDateString()) return "Today";
    if (msgDate.toDateString() === yesterday.toDateString()) return "Yesterday";
    return msgDate.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  };

  // ── Handlers ─────────────────────────────────────────────────
  const handleSwipeReply = (msg) => setReplyingTo(msg);

  const handleReact = (msgId, emoji) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== msgId) return msg;

        const updatedReactions =
          msg.reactions?.[0] === emoji ? [] : [emoji];

        return {
          ...msg,
          reactions: updatedReactions
        };
      })
    );

    socket.emit("send-reaction", {
      msgId,
      emoji,
      receiverId: selectedUser.id
    });

    setOpenMenu(null);
  };

  const handleDelete = (msgId) => {
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
    socket.emit("delete-message", { msgId, receiverId: selectedUser.id });
    setOpenMenu(null);
  };

const typingTimeout = useRef(null);
const handleTyping = (e) => {
  setInput(e.target.value);

  socket.emit("typing", {
    receiverId: selectedUser.id,
    senderId: myuserid,
  });

  clearTimeout(typingTimeout.current);

  typingTimeout.current = setTimeout(() => {
    socket.emit("stop-typing", {
      receiverId: selectedUser.id,
      senderId: myuserid,
    });
  }, 1000);
};
  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    if (editingMsg) {
      if (text !== editingMsg.text) {
        setMessages((prev) => prev.map((m) =>
          m.id === editingMsg.id ? { ...m, text, edited: true } : m
        ));
        socket.emit("edit-message", { msgId: editingMsg.id, newText: text, receiverId: selectedUser.id });
      }
      setEditingMsg(null);
      setInput("");
      return;
    }

    const time = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, {
      id: crypto.randomUUID(),
      from: "me",
      text,
      time,
      reactions: [],
      createdAt: new Date().toISOString(),
     replyTo: replyingTo
  ? {
      text: replyingTo.text,
      file: replyingTo.file,
      fileType: replyingTo.fileType,
      from: replyingTo.from
    }
  : null
    }]);
    socket.emit("send-message", {
      senderId: myuserid,
      receiverId: selectedUser.id,
      message: text,
     replyTo: replyingTo
  ? {
      text: replyingTo.text,
      file: replyingTo.file,
      fileType: replyingTo.fileType,
      from: replyingTo.from
    }
  : null
    });
    setReplyingTo(null);
    setInput("");
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  if (!activeUser) return null;

  // ── Current context menu msg ──────────────────────────────────
  const menuMsg = messages.find((m) => m.id === openMenu);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Only 5MB allowed");
      return;
    }

    setSelectedFile(file);
  };
useEffect(() => {

  if (!myuserid) return;

  const interval = setInterval(() => {

    socket.emit("heartbeat", {
      userId: myuserid
    });

  }, 30000); // 30 second

  return () => clearInterval(interval);

}, [myuserid]);

  async function sendfile() {

    const tempId = crypto.randomUUID();

  setMessages((prev) => [
  ...prev,
  {
    id: tempId,
    from: "me",
    file: URL.createObjectURL(selectedFile),
    fileType: selectedFile.type,
    uploading: true,

    createdAt: new Date().toISOString(),

    time: new Date().toLocaleTimeString("en-US",{
      hour:"2-digit",
      minute:"2-digit"
    })

  }
]);


    const token = localStorage.getItem("chat-token")
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("senderId", myuserid);
    formData.append("receiverId", selectedUser.id);
    setUploading(true);

    try {
      const api = await fetch(`${API}/send-file`, {
        method: "POST",
        headers: {
          authorization: token
        },
        body: formData
      })
      const res = await api.json()
      console.log(res);
            if(res.success){

      setMessages((prev) =>

        prev.map((msg) => {

          if (msg.id === tempId) {

         return{

...msg,

id:res.id,

file:res.fileUrl,

uploading:false,

createdAt:new Date().toISOString()

}
          }

          return msg;

        })

      )
}


    } catch (error) {
      console.log(error, "error aa raha hai file send karne par");
    } finally {
      setUploading(false);
    }
  }

  const handleFinalSend = async () => {
    // agar file selected hai
    if (selectedFile) {
      await sendfile();
      setSelectedFile(null); // send hone ke baad remove
    }

    // agar text likha hua hai
    if (input.trim()) {
      handleSend();
    }
  };

  return (
    <>
      <InjectStyles />
      <style>{`
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #E8DDD4; border-radius: 4px; }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .msg-in { animation: msgIn 0.22s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes dotBounce {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        @keyframes menuPop {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div className="flex flex-col w-screen overflow-hidden" style={{height:"100dvh", background: "#FAF6F1" }}>

        {/* ── Top bar ── */}
        <header className="flex-shrink-0 flex items-center justify-between px-4 sm:px-5 py-3 border-b z-50"
          style={{ background: "rgba(255,253,249,0.97)", backdropFilter: "blur(12px)", borderColor: "#EDE3DA" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/home")}
              className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors duration-150"
              style={{ color: "#EA6C3A" }}
              onMouseEnter={e => e.currentTarget.style.background = "#F5EDE5"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <BackIcon />
            </button>
            <Avatar user={activeUser} size={38} />
            <div>
              <p className="text-sm font-bold leading-tight" style={{ color: "#2D1B0E" }}>{activeUser.name}</p>
              <p className="text-xs" style={{ color: activeUser.online ? "#22C55E" : "#9A7B6A" }}>
                {activeUser.online ? "● Online" : "● Offline"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5">
                                                   <img
  src="/chatLogo (2).png"
  alt="Logo"
  className="w-10  h-10 object-contain"
/>
              <span className="text-sm font-bold" style={{ color: "#2D1B0E" }}>ChatCat</span>
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-xl transition-colors"
              style={{ color: "#9A7B6A" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#F5EDE5"; e.currentTarget.style.color = "#EA6C3A"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9A7B6A"; }}>
              <DotsIcon />
            </button>
          </div>
        </header>

        {/* ── Messages area ── */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 sm:px-8 py-5" style={{ background: "#FAF6F1" }}>
          {messages.map((msg, i) => {
            const currentDate = msg.createdAt ? new Date(msg.createdAt).toDateString() : "";
            const prevDate = i > 0 && messages[i - 1].createdAt ? new Date(messages[i - 1].createdAt).toDateString() : null;
            const showDivider = currentDate !== prevDate;
            return (
              <div key={msg.id}>
                {showDivider && (
                  <div className="flex items-center gap-3 mb-5 mt-3">
                    <div className="flex-1 h-px" style={{ background: "#EDE3DA" }} />
                    <span className="text-xs font-medium px-1" style={{ color: "#B8A090" }}>
                      {getDateLabel(msg.createdAt)}
                    </span>
                    <div className="flex-1 h-px" style={{ background: "#EDE3DA" }} />
                  </div>
                )}
                <div className="msg-in" style={{ animationDelay: `${i * 0.03}s` }}>
                  <Bubble
                    msg={msg}
                    user={activeUser}
                    openMenu={openMenu}
                    setOpenMenu={setOpenMenu}
                    menuAnchor={menuAnchor}
                    setMenuAnchor={setMenuAnchor}
                    setReplyingTo={setReplyingTo}
                    handleSwipeReply={handleSwipeReply}
                    handleReact={(emoji) => handleReact(msg.id, emoji)}
                    handleDelete={() => handleDelete(msg.id)}
                    setEditingMsg={setEditingMsg}
                    setInput={setInput}
                    inputRef={inputRef}
                     bottomRef={bottomRef}
                     setPreviewImage={setPreviewImage}
                  />
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {Type && (
            <div className="flex items-end gap-2 mt-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: activeUser.color }}>{activeUser.avatar}</div>
              <div className="px-3.5 py-3 rounded-2xl rounded-bl-md flex gap-1 items-center"
                style={{ background: "#FFFDF9", border: "1.5px solid #EDE3DA" }}>
                {[0, 0.18, 0.36].map((d, i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#C9956A", display: "inline-block", animation: `dotBounce 1s ease ${d}s infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* ── Edit banner ── */}
        {editingMsg && (
          <div className="px-4 py-2 border-t flex items-center justify-between"
            style={{ background: "#FFF7F2", borderColor: "#EDE3DA" }}>
            <div>
              <p className="text-xs font-semibold" style={{ color: "#EA6C3A" }}>Editing message</p>
              <p className="text-sm truncate max-w-[250px]" style={{ color: "#2D1B0E" }}>{editingMsg.text}</p>
            </div>
            <button onClick={() => { setEditingMsg(null); setInput(""); }}
              className="text-sm" style={{ color: "#9A7B6A", background: "none", border: "none", cursor: "pointer" }}>✕</button>
          </div>
        )}

        {/* ── Reply banner ── */}
        {replyingTo && (
          <div className="px-4 py-2 border-t flex items-center justify-between"
            style={{ background: "#FFF7F2", borderColor: "#EDE3DA" }}>
            <div>
              <p className="text-xs font-semibold" style={{ color: "#EA6C3A" }}>
                Replying to {replyingTo.from === "me" ? "You" : activeUser.name}
              </p>
              <p className="text-sm truncate max-w-[250px]" style={{ color: "#2D1B0E" }}>{replyingTo.text}</p>
            </div>
            <button onClick={() => setReplyingTo(null)}
              className="text-sm" style={{ color: "#9A7B6A", background: "none", border: "none", cursor: "pointer" }}>✕</button>
          </div>
        )}

         {selectedFile && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F5EDE5] text-sm">

              {selectedFile.type.startsWith("image") && "🖼"}
              {selectedFile.type.startsWith("video") && "🎥"}
              {selectedFile.type === "application/pdf" && "📄"}

              <span className="truncate">{selectedFile.name}</span>

              <button
                onClick={() => setSelectedFile(null)}
                className="ml-auto text-red-500"
              >
                ✖
              </button>
            </div>
          )}

        {/* ── Input bar ── */}
        <div className="bottom-0 z-40 flex items-center gap-1 px-3 sm:px-6 py-3 border-t flex-shrink-0"
          style={{ background: "#FFFDF9", borderColor: "#EDE3DA" }}>
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
            style={{ color: "#C9956A" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#EA6C3A";
              e.currentTarget.style.background = "#F5EDE5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#C9956A";
              e.currentTarget.style.background = "transparent";
            }}
          >
            {showEmojiPicker ? "✖" : <EmojiIcon />}
          </button>
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={handleTyping}
            onKeyDown={handleKey}
            placeholder={`Message ${activeUser.name.split(" ")[0]}...`}
            className="flex-1 overflow-hidden px-4 py-2.5 rounded-2xl text-sm outline-none resize-none transition-all duration-200"
            style={{ background: "#FAF6F1", border: "1.5px solid #E8DDD4", color: "#2D1B0E", maxHeight: 120, lineHeight: 1.5 }}
            onFocus={e => { e.target.style.borderColor = "#EA6C3A"; e.target.style.boxShadow = "0 0 0 3px rgba(234,108,58,0.10)"; }}
            onBlur={e => { e.target.style.borderColor = "#E8DDD4"; e.target.style.boxShadow = "none"; }}
            onInput={e => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
          />
          {showEmojiPicker && (
            <div className="fixed bottom-20 left-3 z-50">
              <EmojiPicker
                width={window.innerWidth < 640 ? 280 : 350}
                height={window.innerWidth < 640 ? 380 : 450}
                onEmojiClick={(emojiData) => {
                  setInput((prev) => prev + emojiData.emoji);
                }}
              />
            </div>
          )}
          <button
            onClick={() => fileInputRef.current.click()}
            className="flex-shrink-0 sm:w-9 sm:h-9 w-8 h-8 flex items-center justify-center rounded-xl transition-colors"
            style={{ color: "#C9956A" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#EA6C3A";
              e.currentTarget.style.background = "#F5EDE5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#C9956A";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <AttachIcon />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*,video/*,.pdf"
            style={{ display: "none" }}
            onChange={handleFile}
          />
         <button
            onClick={handleFinalSend}
            disabled={!input.trim() && !selectedFile}
            className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl text-white transition-all duration-150 active:scale-90"
            style={{
              background:
                input.trim() || selectedFile
                  ? "linear-gradient(135deg,#EA6C3A,#D4501E)"
                  : "#E8DDD4",

              boxShadow:
                input.trim() || selectedFile
                  ? "0 4px 14px rgba(234,108,58,0.32)"
                  : "none",

              color:
                input.trim() || selectedFile
                  ? "#fff"
                  : "#B8A090",
            }}
            onMouseEnter={(e) => {
              if (input.trim() || selectedFile)
                e.currentTarget.style.transform = "scale(1.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <SendIcon />
          </button>
        </div>
      </div>

      {/* ── FIXED CONTEXT MENU (portal-style, never clipped) ── */}
      {openMenu && menuAnchor && menuMsg && (
        <ContextMenu
          anchorRect={menuAnchor.rect}
          isMe={menuMsg.from === "me"}
           isFile={!!menuMsg.file}
          onClose={() => { setOpenMenu(null); setMenuAnchor(null); }}
          onCopy={() => navigator.clipboard.writeText(menuMsg.text)}
          onReply={() => setReplyingTo(menuMsg)}
          onEdit={() => { setEditingMsg(menuMsg); setInput(menuMsg.text); inputRef.current?.focus(); }}
          onDelete={() => handleDelete(menuMsg.id)}
          onReact={(emoji) => handleReact(menuMsg.id, emoji)}
        />
      )}

      {previewImage && (
  <div
    onClick={() => setPreviewImage(null)}
    style={{
      position: "fixed",
      inset: 0,
      background:
        "linear-gradient(rgba(0,0,0,.82),rgba(0,0,0,.88))",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
      padding: "20px",
      animation: "fadeIn .25s ease",
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          position: "absolute",
          top: 18,
          left: 18,
          right: 18,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
        }}
      >

        {/* CLOSE */}

        <button
          onClick={() => setPreviewImage(null)}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,.15)",
            background: "rgba(255,255,255,.12)",
            backdropFilter: "blur(20px)",
            color: "#fff",
            cursor: "pointer",
            fontSize: 22,
            transition: ".25s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#EA6C3A";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,.12)";
          }}
        >
          ✕

        </button>

        {/* DOWNLOAD */}

        <a
           href={`${API}/download?url=${encodeURIComponent(previewImage)}`}
          download
          style={{
            padding: window.innerWidth < 640 ? "12px" : "12px 22px",
            borderRadius: 999,
            background: "#EA6C3A",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 12px 35px rgba(234,108,58,.4)",
            transition: ".25s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          ⬇
          <span
            style={{
              display:
                window.innerWidth < 640 ? "none" : "inline",
            }}
          >
            Download
          </span>
        </a>
      </div>

      {/* IMAGE */}

      <img
        src={previewImage}
        alt=""
        draggable={false}
        style={{
          maxWidth: "95%",
          maxHeight: "88vh",
          objectFit: "contain",
          borderRadius: 20,
          boxShadow: "0 30px 80px rgba(0,0,0,.55)",
          animation: "zoomImage .25s ease",
          userSelect: "none",
        }}
      />
    </div>
  </div>
)}
    </>
  );
}