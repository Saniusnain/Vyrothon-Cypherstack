"use client";

import type {
  CipherDefinition,
  PipelineNode,
  StepResult,
} from "@/ciphers/types";

interface Props {
  node: PipelineNode;
  cipher: CipherDefinition;
  result?: StepResult;
  isFirst: boolean;
  isLast: boolean;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onUpdateConfig: (key: string, value: unknown) => void;
  index: number;
}

export default function NodeCard({
  node,
  cipher,
  result,
  isFirst,
  isLast,
  onRemove,
  onMoveUp,
  onMoveDown,
  onUpdateConfig,
  index,
}: Props) {
  return (
    <div className="bg-zinc-900 rounded">
      <div className="flex items-center gap-2 px-3 py-2">
        <span className="text-xs text-zinc-600 tabular-nums w-4 shrink-0">
          {index + 1}
        </span>
        <span className="text-sm font-mono text-zinc-200 flex-1">
          {cipher.label}
        </span>
        {cipher.configurable && (
          <span className="text-xs text-violet-500 mr-1">cfg</span>
        )}
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="text-zinc-600 hover:text-zinc-300 disabled:opacity-20 text-xs px-0.5"
          title="Move up"
        >
          ↑
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="text-zinc-600 hover:text-zinc-300 disabled:opacity-20 text-xs px-0.5"
          title="Move down"
        >
          ↓
        </button>
        <button
          onClick={onRemove}
          className="text-zinc-600 hover:text-red-400 text-sm px-0.5 ml-1"
          title="Remove"
        >
          ×
        </button>
      </div>

      {cipher.configSchema.length > 0 && (
        <div className="flex flex-wrap gap-3 px-3 pb-3 pt-0">
          {cipher.configSchema.map((field) => (
            <div key={field.name} className="flex flex-col gap-1">
              <label className="text-xs text-zinc-500">{field.label}</label>
              <input
                type={field.type}
                value={String(node.config[field.name] ?? field.default)}
                onChange={(e) =>
                  onUpdateConfig(
                    field.name,
                    field.type === "number"
                      ? Number(e.target.value)
                      : e.target.value,
                  )
                }
                min={field.min}
                className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm font-mono text-zinc-200 w-32 focus:outline-none focus:border-zinc-500"
              />
            </div>
          ))}
        </div>
      )}

      {result && (
        <div className="border-t border-zinc-800 px-3 py-2 space-y-0.5">
          {result.error ? (
            <p className="font-mono text-xs text-red-400">{result.error}</p>
          ) : (
            <>
              <p className="font-mono text-sm">
                <span className="text-[#5aab8a] ">in </span>
                <span className="text-zinc-500">
                  {result.input.slice(0, 60)}
                  {result.input.length > 60 ? "…" : ""}
                </span>
              </p>
              <p className="font-mono text-sm">
                <span className="text-violet-500">out </span>
                <span className="text-zinc-300">
                  {result.output.slice(0, 60)}
                  {result.output.length > 60 ? "…" : ""}
                </span>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
