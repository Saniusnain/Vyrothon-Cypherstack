"use client";

interface Props {
  value: string;
  onChange: (v: string) => void;
  output: string;
  mode: "encrypt" | "decrypt";
  onRun: () => void;
  nodeCount: number;
}

export default function IOPanel({
  value,
  onChange,
  output,
  mode,
  onRun,
  nodeCount,
}: Props) {
  const copy = () => {
    try {
      navigator.clipboard.writeText(output);
    } catch {}
  };

  return (
    <div className="shrink-0 border-b border-red-800 px-6 py-4 flex gap-4 items-start border">
      <div className="flex-1 flex flex-col gap-1">
        <label className="text-xs text-zinc-500 uppercase tracking-widest">
          {mode === "encrypt" ? "Plaintext" : "Ciphertext"}
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            mode === "encrypt"
              ? "Enter text to encrypt…"
              : "Enter ciphertext to decrypt…"
          }
          rows={3}
          className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm font-mono text-zinc-200 placeholder-zinc-700 resize-none focus:outline-none focus:border-zinc-600 w-full"
        />
      </div>

      <div className="flex flex-col gap-2 pt-5 shrink-0">
        <button
          onClick={onRun}
          disabled={!value.trim() || nodeCount === 0}
          className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-sm font-medium rounded transition-colors text-white"
        >
          Run
        </button>
        {nodeCount > 0 && nodeCount < 3 && (
          <span className="text-xs text-amber-500 text-center">
            {nodeCount}/3
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-xs text-zinc-500 uppercase tracking-widest">
            {mode === "encrypt" ? "Encrypted" : "Decrypted"}
          </label>
          {output && (
            <button
              onClick={copy}
              className="text-sm text-white transition-colors border border-zinc-600 hover:border-zinc-300 rounded px-2 py-1"
            >
              copy
            </button>
          )}
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm font-mono text-zinc-400 break-all min-h-[72px] max-h-24 overflow-y-auto">
          {output || <span className="text-zinc-700">—</span>}
        </div>
      </div>
    </div>
  );
}
