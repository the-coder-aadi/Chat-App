import { MessageCircle } from "lucide-react";

function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">

      {/* Background Glow */}
      <div className="absolute h-96 w-96 rounded-full bg-blue-500/20 blur-3xl animate-pulse"></div>
      <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl animate-pulse"></div>

      {/* Floating Chat Icons */}
      <MessageCircle className="absolute left-16 top-24 h-8 w-8 text-blue-400/20 animate-bounce" />
      <MessageCircle className="absolute right-20 top-40 h-6 w-6 text-cyan-300/20 animate-bounce delay-300" />
      <MessageCircle className="absolute bottom-24 left-20 h-10 w-10 text-blue-300/20 animate-bounce delay-700" />

      {/* Card */}
      <div className="relative flex w-[90%] max-w-sm flex-col items-center rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl">

        {/* Logo */}
        <div className="flex h-24 w-24 animate-pulse items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_50px_rgba(59,130,246,0.6)]">
          <MessageCircle size={42} className="text-white" />
        </div>

        {/* Title */}
        <h1 className="mt-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-4xl font-extrabold text-transparent">
          ChatCat
        </h1>

        <p className="mt-2 text-center text-sm text-slate-300">
          Connecting you to your conversations...
        </p>

        {/* Typing Dots */}
        <div className="mt-8 flex gap-2">
          <span className="h-3 w-3 animate-bounce rounded-full bg-blue-400"></span>
          <span className="h-3 w-3 animate-bounce rounded-full bg-blue-400 [animation-delay:0.15s]"></span>
          <span className="h-3 w-3 animate-bounce rounded-full bg-blue-400 [animation-delay:0.3s]"></span>
        </div>

      </div>

    </div>
  );
}

export default LoadingScreen;