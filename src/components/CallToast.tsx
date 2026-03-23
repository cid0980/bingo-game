import React from "react";

type CallToastProps = {
  toast: { number: number; visible: boolean } | null;
  opponentName: string;
};

const CallToast: React.FC<CallToastProps> = ({ toast, opponentName }) => {
  if (!toast) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`px-6 py-3 rounded-xl bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe] text-white font-bold text-lg shadow-2xl flex items-center gap-3 ${
          toast.visible ? "animate-toast-in" : "animate-toast-out"
        }`}
      >
        <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl font-black">
          {toast.number}
        </span>
        <span>{opponentName} called: {toast.number}</span>
      </div>
    </div>
  );
};

export default CallToast;
