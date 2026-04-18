"use client";

import { CIPHERS } from "@/ciphers/registry";

interface Props {
  onAdd: (cipherId: string) => void;
}

export default function Sidebar({ onAdd }: Props) {
  const ciphers = Object.values(CIPHERS);
  return (
    <aside className="hidden md:flex w-40 shrink-0 border-r border-zinc-800 flex-col overflow-y-auto">
      <p className="px-4 py-3 text-xs text-zinc-600 uppercase tracking-widest border-b border-zinc-800">
        Ciphers
      </p>
      <div className="flex flex-col gap-0.5 p-2">
        {ciphers.map((cipher) => (
          <button
            key={cipher.id}
            onClick={() => onAdd(cipher.id)}
            className="text-left px-3 py-2 rounded hover:bg-zinc-800 transition-colors group"
          >
            <span className="block text-xs font-mono text-zinc-300 group-hover:text-zinc-100">
              {cipher.label}{" "}
              {cipher.configurable && (
                <span className="text-xs bg-[#17142A] text-violet-500 p-1 rounded">
                  cfg
                </span>
              )}
            </span>
            <span className="block text-xs text-zinc-600 mt-0.5">
              {cipher.description}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}
