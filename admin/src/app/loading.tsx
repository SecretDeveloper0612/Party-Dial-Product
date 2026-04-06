export default function GlobalLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-in fade-in duration-700">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-purple-500 font-black text-[10px] uppercase tracking-widest animate-pulse">
          PD
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm font-black text-slate-800 uppercase tracking-[0.3em]">Synchronizing</p>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-purple-200 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1 h-1 bg-purple-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
