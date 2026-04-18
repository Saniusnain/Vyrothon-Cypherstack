"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import NodeCard from "./NodeCard";
import IOPanel from "./IOPanel";
import { CIPHERS } from "@/ciphers/registry";
import type { PipelineNode, StepResult } from "@/ciphers/types";

export default function CipherStack() {
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [nodes, setNodes] = useState<PipelineNode[]>([]);
  const [results, setResults] = useState<StepResult[]>([]);
  const [output, setOutput] = useState("");

  const clearResults = () => {
    setResults([]);
    setOutput("");
  };

  const reset = () => {
    setInputText("");
    setNodes([]);
    setResults([]);
    setOutput("");
  };

  const addNode = (cipherId: string) => {
    const cipher = CIPHERS[cipherId];
    if (!cipher) return;
    setNodes((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        cipherId,
        config: { ...cipher.defaultConfig },
      },
    ]);
  };

  const removeNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    clearResults();
  };

  const moveNode = (id: string, dir: -1 | 1) => {
    setNodes((prev) => {
      const i = prev.findIndex((n) => n.id === id);
      const j = i + dir;
      if (i === -1 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    clearResults();
  };

  const updateConfig = (id: string, key: string, value: unknown) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, config: { ...n.config, [key]: value } } : n,
      ),
    );
    clearResults();
  };

  const run = () => {
    const ordered = mode === "decrypt" ? [...nodes].reverse() : nodes;
    const stepResults: StepResult[] = [];
    let current = inputText;

    for (const node of ordered) {
      const cipher = CIPHERS[node.cipherId];
      if (!cipher) continue;
      const snapshot = current;
      try {
        current =
          mode === "encrypt"
            ? cipher.encrypt(current, node.config)
            : cipher.decrypt(current, node.config);
        stepResults.push({ nodeId: node.id, input: snapshot, output: current });
      } catch (e) {
        stepResults.push({
          nodeId: node.id,
          input: snapshot,
          output: "",
          error: String(e),
        });
        break;
      }
    }

    setResults(stepResults);
    setOutput(current);
  };

  const switchMode = (m: "encrypt" | "decrypt") => {
    setMode(m);
    clearResults();
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden">
      <header className="shrink-0 flex items-center justify-between px-6 h-12 border-b border-zinc-800">
        <span className="font-mono text-xs tracking-widest text-zinc-400">
          CIPHERSTACK
        </span>
        <div className="flex text-xs">
          <button
            onClick={() => switchMode("encrypt")}
            className={`px-3 py-1 rounded-l border border-zinc-700 transition-colors ${
              mode === "encrypt"
                ? "bg-violet-600 border-violet-600 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Encrypt
          </button>
          <button
            onClick={() => switchMode("decrypt")}
            className={`px-3 py-1 rounded-r border border-l-0 border-zinc-700 transition-colors ${
              mode === "decrypt"
                ? "bg-violet-600 border-violet-600 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Decrypt
          </button>
        </div>
      </header>

      {/* Mobile cipher strip */}
      <div className="flex md:hidden overflow-x-auto border-b border-zinc-800 px-4 py-2 gap-2 shrink-0">
        {Object.values(CIPHERS).map((cipher) => (
          <button
            key={cipher.id}
            onClick={() => addNode(cipher.id)}
            className="shrink-0 px-3 py-1 text-xs font-mono text-zinc-300 border border-zinc-700 rounded hover:bg-zinc-800 transition-colors"
          >
            {cipher.label}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar onAdd={addNode} />

        <main className="flex flex-col flex-1 overflow-hidden">
          <IOPanel
            value={inputText}
            onChange={setInputText}
            output={output}
            mode={mode}
            onRun={run}
            onReset={reset}
            nodeCount={nodes.length}
            configurableCount={nodes.filter((n) => CIPHERS[n.cipherId]?.configurable).length}
          />

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {nodes.length === 0 && (
              <p className="text-zinc-700 text-sm text-center pt-12">
                <span className="hidden md:inline">
                  Click a cipher in the sidebar
                </span>
                <span className="md:hidden">Tap a cipher above</span> to build
                your pipeline.
              </p>
            )}

            {nodes.length > 0 &&
              nodes.filter((n) => CIPHERS[n.cipherId]?.configurable).length < 3 && (
                <p className="text-amber-600 text-xs text-center mb-3">
                  Add at least 3 configurable cipher nodes (
                  {nodes.filter((n) => CIPHERS[n.cipherId]?.configurable).length} / 3)
                </p>
              )}

            {mode === "decrypt" && nodes.length > 0 && (
              <p className="text-zinc-700 text-xs text-center mb-3">
                Pipeline runs bottom → top in decrypt mode
              </p>
            )}

            <div className="flex flex-col gap-2 max-w-2xl mx-auto">
              {nodes.map((node, i) => {
                const cipher = CIPHERS[node.cipherId];
                if (!cipher) return null;
                const result = results.find((r) => r.nodeId === node.id);
                return (
                  <NodeCard
                    key={node.id}
                    node={node}
                    cipher={cipher}
                    result={result}
                    isFirst={i === 0}
                    isLast={i === nodes.length - 1}
                    onRemove={() => removeNode(node.id)}
                    onMoveUp={() => moveNode(node.id, -1)}
                    onMoveDown={() => moveNode(node.id, 1)}
                    onUpdateConfig={(key, val) =>
                      updateConfig(node.id, key, val)
                    }
                    index={i}
                  />
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
