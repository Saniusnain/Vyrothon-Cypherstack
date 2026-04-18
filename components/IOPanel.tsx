"use client";

interface Props {
  value: string;
  onChange: (v: string) => void;
  output: string;
  mode: "encrypt" | "decrypt";
  onRun: () => void;
  onReset: () => void;
  nodeCount: number;
}

export default function IOPanel({
  value,
  onChange,
  output,
  mode,
  onRun,
  onReset,
  nodeCount,
}: Props) {
  const copy = () => {
    try {
      navigator.clipboard.writeText(output);
    } catch {}
  };

  return (
    <div className="shrink-0 border-b border-zinc-800 px-4 md:px-6 py-4 flex flex-col md:flex-row gap-3 md:gap-4 md:items-start">
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

      <div className="flex md:flex-col items-center md:items-stretch justify-end gap-2 shrink-0 md:pt-5">
        <button
          onClick={onRun}
          disabled={!value.trim() || nodeCount === 0}
          className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-sm font-medium rounded transition-colors text-white"
        >
          Run
        </button>
        <button
          onClick={onReset}
          className="px-4 py-1.5 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-200 text-sm rounded transition-colors"
        >
          Reset
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
        </div>
        <div className="bg-[#17142A] text-violet-500 rounded px-3 py-2 text-sm font-mono  break-all min-h-18 max-h-24 overflow-y-auto">
          {/* {output || <span className="text-zinc-700">—</span>} */}

          {nodeCount >= 3 ? output : <span className="text-zinc-700">—</span>}
        </div>
        {output && (
          <button
            onClick={copy}
            className="w-fit self-end text-sm mt-3 text-white transition-colors border border-zinc-600 hover:border-zinc-300 rounded px-2 py-1"
          >
            copy
          </button>
        )}
      </div>
    </div>
  );
}
