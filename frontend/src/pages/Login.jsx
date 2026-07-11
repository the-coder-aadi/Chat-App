import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

// Icons
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconEyeOpen = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeClosed = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
    <line x1="2" x2="22" y1="2" y2="22"/>
  </svg>
);
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// Left panel — stat cards floating
const StatCard = ({ emoji, label, value, delay }) => (
  <div
    style={{
      animationDelay: delay,
      animation: "cardIn 0.6s cubic-bezier(0.22,1,0.36,1) both",
      background: "rgba(255,255,255,0.15)",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(255,255,255,0.22)",
    }}
    className="rounded-2xl px-4 py-3 flex items-center gap-3"
  >
    <span className="text-2xl">{emoji}</span>
    <div>
      <p className="text-white font-bold text-base leading-tight">{value}</p>
      <p className="text-xs leading-tight" style={{ color: "rgba(255,255,255,0.65)" }}>{label}</p>
    </div>
  </div>
);

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading,setLoading]=useState(false);
const navigate = useNavigate()
const [data, setdata] = useState({
  email:"",
  pass:""
  
})

const [errors, setErrors] = useState({
  email: "",
  pass: "",
  general: ""
});


function validateForm() {
  const newErrors = {
    email: "",
    pass: "",
    general: ""
  };

  let valid = true;

  if (!data.email.trim()) {
    newErrors.email = "Email is required";
    valid = false;
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)
  ) {
    newErrors.email = "Please enter a valid email address";
    valid = false;
  }

  if (!data.pass.trim()) {
    newErrors.pass = "Password is required";
    valid = false;
  } else if (data.pass.length < 8) {
    newErrors.pass = "Password must contain at least 8 characters";
    valid = false;
  }

  setErrors(newErrors);

  return valid;
}

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const fade = (delay) => ({
    transition: `opacity 0.6s ease ${delay}, transform 0.6s ease ${delay}`,
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(18px)",
  });

  const inputStyle = {
    background: "#FBF8F5",
    border: "1.5px solid #E8DDD4",
    color: "#2D1B0E",
  };

  const onFocus = (e) => {
    e.target.style.borderColor = "#EA6C3A";
    e.target.style.boxShadow = "0 0 0 3px rgba(234,108,58,0.12)";
  };
  const onBlur = (e) => {
    e.target.style.borderColor = "#E8DDD4";
    e.target.style.boxShadow = "none";
  };

function formhandle(e) {

  setdata({
    ...data,
    [e.target.name]: e.target.value
  });

  setErrors(prev=>({
    ...prev,
    [e.target.name]:"",
    general:""
  }));
}

  async function login() {
    if (!validateForm()) return;
      if (loading) return;
    setLoading(true);
    try {
      const api = await fetch(`${API}/logindata`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"include",
        body:JSON.stringify(data)
      })
       const res = await api.json()
        console.log(res);

        if (!res.success) {

   if (Array.isArray(res.msg)) {

      const backendErrors = {};

      res.msg.forEach(err=>{

         backendErrors[err.path]=err.msg;

      });

      setErrors(prev=>({

         ...prev,

         ...backendErrors

      }));

   } else {

      setErrors(prev=>({

         ...prev,

         general:res.msg

      }));

   }

   return;

}

      if (res.success === true) {
        localStorage.setItem("chat-token", res.token)
        localStorage.setItem("UserName", res.username)
        localStorage.setItem("userid", res.userid);

socket.io.opts.query = {
  userId: res.userid,
};

socket.connect();
        navigate("/home")
      }
      
    } catch (error) {
      console.log(error, "error in login frontend");
    }
    finally{

setLoading(false);

}
  }

  const Spinner = () => (
  <div
    className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"
  />
);

  return (
    <>
      <InjectStyles />
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateX(-18px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
      `}</style>

      <div
        className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6"
        style={{ background: "#FAF6F1" }}
      >
        <div
          className="w-full max-w-sm sm:max-w-4xl rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col sm:flex-row"
          style={{
            background: "#FFFDF9",
            boxShadow: "0 24px 64px rgba(180,100,40,0.13), 0 4px 16px rgba(180,100,40,0.08)",
          }}
        >

          {/* ── LEFT PANEL ── */}
          <div
            className="hidden sm:flex flex-col justify-between p-10 relative overflow-hidden"
            style={{
              background: "linear-gradient(155deg, #B83D10 0%, #D4501E 45%, #EA6C3A 100%)",
              flex: "0 0 42%",
              minHeight: "520px",
            }}
          >
            {/* BG circles */}
            <div className="absolute top-[-80px] left-[-80px] w-64 h-64 rounded-full"
              style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="absolute bottom-[-50px] right-[-50px] w-52 h-52 rounded-full"
              style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="absolute top-1/2 left-[-30px] w-32 h-32 rounded-full"
              style={{ background: "rgba(0,0,0,0.06)" }} />

            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-2">
            
                <img
  src="/chatLogo (2).png"
  alt="Logo"
  className="w-12  h-12 object-contain"
/>
              
                <span className="text-white font-bold text-lg tracking-tight">ChatCat</span>
              </div>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>Good to see you again.</p>
            </div>

            {/* Stat cards */}
            <div className="flex flex-col gap-3">
              <StatCard emoji="💬" value="2.4M+" label="Messages sent today" delay="0.2s" />
              <StatCard emoji="🌍" value="180+" label="Countries connected" delay="0.35s" />
              <StatCard emoji="⚡" value="< 80ms" label="Average delivery time" delay="0.5s" />
            </div>

            {/* Online indicator */}
            <div className="flex items-center gap-2.5">
              <div className="relative w-3 h-3">
                <div className="absolute inset-0 rounded-full" style={{ background: "#6EE7B7" }} />
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "#6EE7B7",
                    animation: "pulse-ring 1.6s ease-out infinite",
                  }}
                />
              </div>
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
                <span className="text-white font-semibold">12,840</span> people online now
              </span>
            </div>
          </div>

          {/* ── RIGHT PANEL (form) ── */}
          <div className="flex-1 flex flex-col justify-center p-7 sm:p-10">

            {/* Mobile brand */}
            <div className="flex sm:hidden items-center gap-2 mb-6">
                            <img
  src="/chatLogo (2).png"
  alt="Logo"
  className="w-12  h-12 object-contain"
/>
              <span className="font-bold text-lg tracking-tight" style={{ color: "#2D1B0E" }}>ChatCat</span>
            </div>

            {/* Heading */}
            <div style={fade("0.05s")}>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1" style={{ color: "#2D1B0E" }}>
                Welcome back 👋
              </h1>
              <p className="text-sm mb-7" style={{ color: "#9A7B6A" }}>
                Log in to pick up where you left off.
              </p>
            </div>

            {/* Google */}
            <div style={fade("0.1s")}>
              <button
                           onClick={() => {
  window.location.href = `${API}/auth/google`;
}}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 hover:shadow-md active:scale-[0.98] mb-5"
                style={{ border: "1.5px solid #E8DDD4", color: "#2D1B0E", background: "#FBF8F5" }}
                onMouseEnter={e => e.currentTarget.style.background = "#F5EDE5"}
                onMouseLeave={e => e.currentTarget.style.background = "#FBF8F5"}
              >
                <GoogleIcon />
                Continue with Google
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5" style={fade("0.15s")}>
              <div className="flex-1 h-px" style={{ background: "#EDE3DA" }} />
              <span className="text-xs font-medium" style={{ color: "#B8A090" }}>or log in with email</span>
              <div className="flex-1 h-px" style={{ background: "#EDE3DA" }} />
            </div>

            {/* Email */}
            <div className="mb-4" style={fade("0.2s")}>
              <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase"
                style={{ color: "#9A7B6A" }}>
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 pointer-events-none" style={{ color: "#C9956A" }}>
                  <IconMail />
                </span>
                <input
                name="email"
                value={data.email}
                onChange={formhandle}
                  type="email"
                  placeholder="rahul@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
   ...inputStyle,
   borderColor:errors.email ? "#EF4444" : "#E8DDD4"
}}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />

              </div>
            </div>

            {/* Password */}
            <div className="mb-6" style={fade("0.25s")}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold tracking-wide uppercase" style={{ color: "#9A7B6A" }}>
                  Password
                </label>
                <button
                  className="text-xs font-medium transition-colors duration-200"
                  style={{ color: "#EA6C3A", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  onMouseEnter={e => e.currentTarget.style.color = "#B83D10"}
                  onMouseLeave={e => e.currentTarget.style.color = "#EA6C3A"}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 pointer-events-none" style={{ color: "#C9956A" }}>
                  <IconLock />
                </span>
                <input
                 name="pass"
                value={data.pass}
                onChange={formhandle}
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
   ...inputStyle,
   borderColor:errors.pass ? "#EF4444" : "#E8DDD4"
}}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />

                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3.5 transition-colors duration-200"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#B8A090", padding: 0, display: "flex" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#EA6C3A"}
                  onMouseLeave={e => e.currentTarget.style.color = "#B8A090"}
                >
                  {showPass ? <IconEyeOpen /> : <IconEyeClosed />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2 mb-6" style={fade("0.28s")}>
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded cursor-pointer accent-orange-500"
              />
              <label htmlFor="remember" className="text-sm cursor-pointer select-none"
                style={{ color: "#9A7B6A" }}>
                Keep me logged in
              </label>
            </div>
{
errors.general &&

<div
className="mb-3 rounded-xl text-sm px-4 py-2"
style={{
background:"#FEF2F2",
border:"1px solid #FECACA",
color:"#DC2626"
}}
>

{errors.general}

</div>

}
            {/* Login btn */}
            <div style={fade("0.32s")}>
      <button
  onClick={login}
  disabled={loading}
  className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98] mb-5 flex items-center justify-center gap-3"
  style={{
    background: "linear-gradient(135deg,#EA6C3A,#D4501E)",
    boxShadow: loading
      ? "0 4px 16px rgba(234,108,58,.18)"
      : "0 6px 20px rgba(234,108,58,.32)",

    opacity: loading ? .85 : 1,

    cursor: loading ? "not-allowed" : "pointer"
  }}
  onMouseEnter={e=>{

    if(loading) return;

    e.currentTarget.style.boxShadow =
      "0 8px 28px rgba(234,108,58,.42)";

    e.currentTarget.style.transform =
      "translateY(-1px)";

  }}

  onMouseLeave={e=>{

    if(loading) return;

    e.currentTarget.style.boxShadow =
      "0 6px 20px rgba(234,108,58,.32)";

    e.currentTarget.style.transform =
      "translateY(0)";

  }}
>

{loading ? (
  <>
    <Spinner />
    log In...
  </>
) : (
  "Log In"
)}

</button>
            </div>

            {/* Signup link */}
            <div className="text-center" style={fade("0.37s")}>
              <span className="text-sm" style={{ color: "#9A7B6A" }}>
                Don't have an account?{" "}
                <button
                 onClick={()=> navigate("/")}
                  className="font-semibold transition-colors duration-200"
                  style={{ color: "#EA6C3A", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  onMouseEnter={e => e.currentTarget.style.color = "#B83D10"}
                  onMouseLeave={e => e.currentTarget.style.color = "#EA6C3A"}
                >
                  Sign up free
                </button>
              </span>
            </div>

            {/* Terms */}
            <p className="text-center text-xs mt-4 leading-relaxed" style={{ color: "#C2A898", ...fade("0.42s") }}>
              Protected by{" "}
              <span className="underline cursor-pointer" style={{ color: "#B8A090" }}>reCAPTCHA</span>
              {" "}·{" "}
              <span className="underline cursor-pointer" style={{ color: "#B8A090" }}>Privacy</span>
              {" "}·{" "}
              <span className="underline cursor-pointer" style={{ color: "#B8A090" }}>Terms</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
