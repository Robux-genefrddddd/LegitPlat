export function TypingIndicator() {
  return (
    <div
      className="rounded-lg rounded-tl-none py-2 px-3 flex items-center gap-2 h-auto"
      style={{
        backgroundColor: "#111418",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
        lineHeight: "1.3",
      }}
    >
      <div className="flex gap-1.5 items-center">
        <div
          className="w-2 h-2 rounded-full bg-white/60 animate-threeDotPulse"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="w-2 h-2 rounded-full bg-white/60 animate-threeDotPulse"
          style={{ animationDelay: "0.2s" }}
        />
        <div
          className="w-2 h-2 rounded-full bg-white/60 animate-threeDotPulse"
          style={{ animationDelay: "0.4s" }}
        />
      </div>
    </div>
  );
}
