import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../config";
// Tailwind CDN + Google Fonts injected once
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
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IconEyeOpen = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconEyeClosed = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

// Chat bubble decoration for left panel
const BubbleLeft = ({ children, delay = "0s" }) => (
  <div
    style={{
      animationDelay: delay,
      animation: "bubbleIn 0.5s cubic-bezier(0.22,1,0.36,1) both",
    }}
    className="flex items-start gap-2 mb-3"
  >
    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
      style={{ background: "rgba(255,255,255,0.25)" }}>
      A
    </div>
    <div className="rounded-2xl rounded-tl-sm px-3 py-2 text-sm max-w-[200px]"
      style={{ background: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)" }}>
      {children}
    </div>
  </div>
);
const BubbleRight = ({ children, delay = "0s" }) => (
  <div
    style={{ animationDelay: delay, animation: "bubbleIn 0.5s cubic-bezier(0.22,1,0.36,1) both" }}
    className="flex items-start gap-2 mb-3 flex-row-reverse"
  >
    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
      style={{ background: "rgba(255,255,255,0.9)", color: "#EA6C3A" }}>
      R
    </div>
    <div className="rounded-2xl rounded-tr-sm px-3 py-2 text-sm max-w-[200px]"
      style={{ background: "rgba(255,255,255,0.9)", color: "#2D1B0E" }}>
      {children}
    </div>
  </div>
);

export default function Signup() {
  const [showPass, setShowPass] = useState(false);
  const [visible, setVisible] = useState(false);
  const [data, setdata] = useState({
    name:"",
    email:"",
    pass:""
  })
  const [loading, setLoading] = useState(false);

const [errors, setErrors] = useState({
  name: "",
  email: "",
  pass: "",
  server: ""
});
const navigate = useNavigate()
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const fadeClass = (delay) =>
    `transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`;

function formhandle(e) {

  setdata({
    ...data,
    [e.target.name]: e.target.value
  });

  setErrors(prev => ({
    ...prev,
    [e.target.name]: "",
    server: ""
  }));
}

function validateForm() {

  let temp = {
    name: "",
    email: "",
    pass: "",
    server: ""
  };

  let valid = true;

  if (!data.name.trim()) {
    temp.name = "Full name is required";
    valid = false;
  }

  if (!data.email.trim()) {
    temp.email = "Email address is required";
    valid = false;
  }

  else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
  ) {
    temp.email = "Enter a valid email address";
    valid = false;
  }

  if (!data.pass) {
    temp.pass = "Password is required";
    valid = false;
  }

  else if (data.pass.length < 8) {
    temp.pass = "Password must contain at least 8 characters";
    valid = false;
  }

  setErrors(temp);

  return valid;
}

 async function createacc() {

  if (!validateForm()) return;

  setLoading(true);

  try {

    const api = await fetch(`${API}/createacc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const res = await api.json();

    if (res.success) {
      navigate("/login");
      return;
    }

    // Express validator

    if (Array.isArray(res.msg)) {

      let temp = {
        name: "",
        email: "",
        pass: "",
        server: ""
      };

      res.msg.forEach(err => {

        if (err.path === "name")
          temp.name = err.msg;

        if (err.path === "email")
          temp.email = err.msg;

        if (err.path === "pass")
          temp.pass = err.msg;
      });

      setErrors(temp);
    }

    // signupmiddleware response

    else {

      setErrors(prev => ({
        ...prev,
        server: res.msg
      }));
    }
  }

  catch (err) {

    setErrors(prev => ({
      ...prev,
      server: "Something went wrong. Please try again."
    }));
  }

  finally {
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
        @keyframes bubbleIn {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes floatSlow {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-10px); }
        }
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        body { background: #FAF6F1; }
      `}</style>

      <div
        className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6"
        style={{ background: "#FAF6F1" }}
      >
        {/* Card shell */}
        <div
          className="w-full max-w-sm sm:max-w-4xl rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col sm:flex-row"
          style={{
            background: "#FFFDF9",
            boxShadow: "0 24px 64px rgba(180,100,40,0.13), 0 4px 16px rgba(180,100,40,0.08)",
          }}
        >
          {/* ── LEFT PANEL (hidden on mobile) ── */}
          <div
            className="hidden sm:flex flex-col justify-between p-10 relative overflow-hidden"
            style={{
              background: "linear-gradient(145deg, #EA6C3A 0%, #D4501E 55%, #B83D10 100%)",
              flex: "0 0 42%",
              minHeight: "560px",
            }}
          >
            {/* Decorative circles */}
            <div className="absolute top-[-60px] right-[-60px] w-52 h-52 rounded-full"
              style={{ background: "rgba(255,255,255,0.07)" }} />
            <div className="absolute bottom-[-40px] left-[-40px] w-40 h-40 rounded-full"
              style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="absolute top-1/2 right-[-20px] w-24 h-24 rounded-full"
              style={{ background: "rgba(255,255,255,0.05)" }} />

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
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>Connect. Chat. Belong.</p>
            </div>

            {/* Chat bubbles illustration */}
            <div className="py-6 relative z-10">
              <BubbleLeft delay="0.3s">Hey! Just joined ChatCat 👋</BubbleLeft>
              <BubbleRight delay="0.6s">Welcome! It's great here 🎉</BubbleRight>
              <BubbleLeft delay="0.9s">Already loving the vibe ✨</BubbleLeft>
              <BubbleRight delay="1.2s">Let's chat! 💬</BubbleRight>
            </div>

            {/* Bottom tagline */}
            <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
              Join <span className="text-white font-semibold">50,000+</span> people chatting right now.
            </p>
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
            <div
              className={fadeClass()}
              style={{ transitionDelay: "0.05s" }}
            >
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1" style={{ color: "#2D1B0E" }}>
                Create an account
              </h1>
              <p className="text-sm mb-7" style={{ color: "#9A7B6A" }}>
                Start chatting in seconds — it's free.
              </p>
            </div>

            {/* Google btn */}
            <div className={fadeClass()} style={{ transitionDelay: "0.1s" }}>
              <button
             onClick={() => {
  window.location.href = `${API}/auth/google`;
}}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 hover:shadow-md active:scale-[0.98] mb-5"
                style={{
                  border: "1.5px solid #E8DDD4",
                  color: "#2D1B0E",
                  background: "#FBF8F5",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#F5EDE5"}
                onMouseLeave={e => e.currentTarget.style.background = "#FBF8F5"}
              >
                <GoogleIcon />
                Continue with Google
              </button>
            </div>

            {/* Divider */}
            <div className={`flex items-center gap-3 mb-5 ${fadeClass()}`} style={{ transitionDelay: "0.15s" }}>
              <div className="flex-1 h-px" style={{ background: "#EDE3DA" }} />
              <span className="text-xs font-medium" style={{ color: "#B8A090" }}>or sign up with email</span>
              <div className="flex-1 h-px" style={{ background: "#EDE3DA" }} />
            </div>

            {/* Name */}
            <div className={`mb-4 ${fadeClass()}`} style={{ transitionDelay: "0.2s" }}>
              <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: "#9A7B6A" }}>
                Full Name
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 pointer-events-none" style={{ color: "#C9956A" }}>
                  <IconUser />
                </span>
                <input
                name="name"
                 value={data.name}
                 onChange={formhandle}
                  type="text"
                  placeholder="Rahul Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                 style={{
background:"#FBF8F5",
border: errors.name
? "1.5px solid #EF4444"
: "1.5px solid #E8DDD4",
color:"#2D1B0E"
}}
                  onFocus={e => { e.target.style.borderColor = "#EA6C3A"; e.target.style.boxShadow = "0 0 0 3px rgba(234,108,58,0.12)"; }}
                  onBlur={e => { e.target.style.borderColor = "#E8DDD4"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* Email */}
            <div className={`mb-4 ${fadeClass()}`} style={{ transitionDelay: "0.25s" }}>
              <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase" style={{ color: "#9A7B6A" }}>
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
                    background: "#FBF8F5",
                  border: errors.email
? "1.5px solid #EF4444"
: "1.5px solid #E8DDD4",
                    color: "#2D1B0E",
                  }}
                  onFocus={e => { e.target.style.borderColor = "#EA6C3A"; e.target.style.boxShadow = "0 0 0 3px rgba(234,108,58,0.12)"; }}
                  onBlur={e => { e.target.style.borderColor = "#E8DDD4"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* Password */}
            <div className={`mb-6 ${fadeClass()}`} style={{ transitionDelay: "0.3s" }}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold tracking-wide uppercase" style={{ color: "#9A7B6A" }}>
                  Password
                </label>
                <button className="text-xs font-medium transition-colors duration-200"
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
                  placeholder="Min. 8 characters"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
                    background: "#FBF8F5",
                    border: errors.pass
? "1.5px solid #EF4444"
: "1.5px solid #E8DDD4",
                    color: "#2D1B0E",
                  }}
                  onFocus={e => { e.target.style.borderColor = "#EA6C3A"; e.target.style.boxShadow = "0 0 0 3px rgba(234,108,58,0.12)"; }}
                  onBlur={e => { e.target.style.borderColor = "#E8DDD4"; e.target.style.boxShadow = "none"; }}
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
{errors.server && (

<div
className="mb-3 rounded-xl px-4 py-2 text-sm font-medium"
style={{
background:"#FEF2F2",
border:"1px solid #FECACA",
color:"#DC2626"
}}
>

{errors.server}

</div>

)}
            {/* Sign Up btn */}
            <div className={fadeClass()} style={{ transitionDelay: "0.35s" }}>
          <button
  onClick={createacc}
  disabled={loading}
  className={`w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 mb-5 flex items-center justify-center gap-3
  ${
    loading
      ? "cursor-not-allowed opacity-80"
      : "active:scale-[0.98]"
  }`}
  style={{
    background: "linear-gradient(135deg,#EA6C3A 0%,#D4501E 100%)",
    boxShadow: "0 6px 20px rgba(234,108,58,0.32)",
  }}
  onMouseEnter={(e) => {
    if (loading) return;
    e.currentTarget.style.boxShadow =
      "0 8px 28px rgba(234,108,58,0.42)";
    e.currentTarget.style.transform = "translateY(-1px)";
  }}
  onMouseLeave={(e) => {
    if (loading) return;
    e.currentTarget.style.boxShadow =
      "0 6px 20px rgba(234,108,58,0.32)";
    e.currentTarget.style.transform = "translateY(0)";
  }}
>
  {loading ? (
    <>
      <Spinner />
      <span>Creating Account...</span>
    </>
  ) : (
    "Create Account"
  )}
</button>
            </div>

            {/* Login link */}
            <div className={`text-center ${fadeClass()}`} style={{ transitionDelay: "0.4s" }}>
              <span className="text-sm" style={{ color: "#9A7B6A" }}>
                Already have an account?{" "}
                <button
                onClick={()=> navigate("/login")}
                  className="font-semibold transition-colors duration-200"
                  style={{ color: "#EA6C3A", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  onMouseEnter={e => e.currentTarget.style.color = "#B83D10"}
                  onMouseLeave={e => e.currentTarget.style.color = "#EA6C3A"}
                >
                  Log in
                </button>
              </span>
            </div>

            {/* Terms */}
            <p className={`text-center text-xs mt-4 leading-relaxed ${fadeClass()}`}
              style={{ color: "#C2A898", transitionDelay: "0.45s" }}>
              By creating an account, you agree to our{" "}
              <span className="underline cursor-pointer" style={{ color: "#B8A090" }}>Terms</span>
              {" "}and{" "}
              <span className="underline cursor-pointer" style={{ color: "#B8A090" }}>Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
