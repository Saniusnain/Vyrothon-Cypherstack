import type { CipherDefinition } from "./types";

function caesarShift(char: string, shift: number): string {
  const cc = char.charCodeAt(0);
  if (cc >= 65 && cc <= 90)
    return String.fromCharCode(((((cc - 65 + shift) % 26) + 26) % 26) + 65);
  if (cc >= 97 && cc <= 122)
    return String.fromCharCode(((((cc - 97 + shift) % 26) + 26) % 26) + 97);
  return char;
}

function getRailPattern(len: number, rails: number): number[] {
  const pattern: number[] = [];
  let rail = 0,
    dir = 1;
  for (let i = 0; i < len; i++) {
    pattern.push(rail);
    if (rail === 0) dir = 1;
    else if (rail === rails - 1) dir = -1;
    rail += dir;
  }
  return pattern;
}

function getColOrder(keyword: string): number[] {
  return keyword
    .split("")
    .map((c, i) => ({ c: c.toUpperCase(), i }))
    .sort((a, b) => (a.c < b.c ? -1 : a.c > b.c ? 1 : a.i - b.i))
    .map((x) => x.i);
}

export const CIPHERS: Record<string, CipherDefinition> = {
  caesar: {
    id: "caesar",
    label: "Caesar",
    description: "Shift letters by N",
    configurable: true,
    configSchema: [
      { name: "shift", label: "Shift", type: "number", min: 1, default: 3 },
    ],
    defaultConfig: { shift: 3 },
    encrypt: (input, config) =>
      input
        .split("")
        .map((c) => caesarShift(c, Number(config.shift)))
        .join(""),
    decrypt: (input, config) =>
      input
        .split("")
        .map((c) => caesarShift(c, -Number(config.shift)))
        .join(""),
  },

  vigenere: {
    id: "vigenere",
    label: "Vigenère",
    description: "Keyword-based shifts",
    configurable: true,
    configSchema: [
      { name: "keyword", label: "Keyword", type: "text", default: "SECRET" },
    ],
    defaultConfig: { keyword: "SECRET" },
    encrypt: (input, config) => {
      const kw =
        String(config.keyword)
          .toUpperCase()
          .replace(/[^A-Z]/g, "") || "KEY";
      let ki = 0;
      return input
        .split("")
        .map((ch) => {
          const cc = ch.charCodeAt(0);
          if (cc >= 65 && cc <= 90) {
            const s = kw.charCodeAt(ki++ % kw.length) - 65;
            return String.fromCharCode(((cc - 65 + s) % 26) + 65);
          }
          if (cc >= 97 && cc <= 122) {
            const s = kw.charCodeAt(ki++ % kw.length) - 65;
            return String.fromCharCode(((cc - 97 + s) % 26) + 97);
          }
          return ch;
        })
        .join("");
    },
    decrypt: (input, config) => {
      const kw =
        String(config.keyword)
          .toUpperCase()
          .replace(/[^A-Z]/g, "") || "KEY";
      let ki = 0;
      return input
        .split("")
        .map((ch) => {
          const cc = ch.charCodeAt(0);
          if (cc >= 65 && cc <= 90) {
            const s = kw.charCodeAt(ki++ % kw.length) - 65;
            return String.fromCharCode(((((cc - 65 - s) % 26) + 26) % 26) + 65);
          }
          if (cc >= 97 && cc <= 122) {
            const s = kw.charCodeAt(ki++ % kw.length) - 65;
            return String.fromCharCode(((((cc - 97 - s) % 26) + 26) % 26) + 97);
          }
          return ch;
        })
        .join("");
    },
  },

  xor: {
    id: "xor",
    label: "XOR",
    description: "XOR bytes → hex",
    configurable: true,
    configSchema: [
      { name: "key", label: "Key", type: "text", default: "mykey" },
    ],
    defaultConfig: { key: "mykey" },
    encrypt: (input, config) => {
      const key = String(config.key) || "k";
      return input
        .split("")
        .map((c, i) =>
          (c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
            .toString(16)
            .padStart(2, "0"),
        )
        .join("");
    },
    decrypt: (input, config) => {
      const key = String(config.key) || "k";
      const pairs = input.match(/.{1,2}/g) ?? [];
      return pairs
        .map((h, i) =>
          String.fromCharCode(parseInt(h, 16) ^ key.charCodeAt(i % key.length)),
        )
        .join("");
    },
  },

  railfence: {
    id: "railfence",
    label: "Rail Fence",
    description: "Zigzag transposition",
    configurable: true,
    configSchema: [
      { name: "rails", label: "Rails", type: "number", min: 2, default: 3 },
    ],
    defaultConfig: { rails: 3 },
    encrypt: (input, config) => {
      const r = Math.max(2, Number(config.rails));
      if (!input) return "";
      const pattern = getRailPattern(input.length, r);
      const rails: string[][] = Array.from({ length: r }, () => []);
      for (let i = 0; i < input.length; i++) rails[pattern[i]].push(input[i]);
      return rails.map((a) => a.join("")).join("");
    },
    decrypt: (input, config) => {
      const r = Math.max(2, Number(config.rails));
      if (!input) return "";
      const n = input.length;
      const pattern = getRailPattern(n, r);
      const counts = Array<number>(r).fill(0);
      for (const p of pattern) counts[p]++;
      const railStrs: string[] = [];
      let pos = 0;
      for (let i = 0; i < r; i++) {
        railStrs.push(input.slice(pos, pos + counts[i]));
        pos += counts[i];
      }
      const ptrs = Array<number>(r).fill(0);
      let result = "";
      for (let i = 0; i < n; i++) {
        const rail = pattern[i];
        result += railStrs[rail][ptrs[rail]++];
      }
      return result;
    },
  },

  columnar: {
    id: "columnar",
    label: "Columnar",
    description: "Column transposition",
    configurable: true,
    configSchema: [
      { name: "keyword", label: "Keyword", type: "text", default: "ZEBRA" },
    ],
    defaultConfig: { keyword: "ZEBRA" },
    encrypt: (input, config) => {
      const kw = String(config.keyword) || "KEY";
      const numCols = kw.length;
      const numRows = Math.ceil(input.length / numCols);
      const padding = numRows * numCols - input.length;
      const order = getColOrder(kw);
      return order
        .map((col) => {
          const isShort = col >= numCols - padding;
          const colLen = isShort ? numRows - 1 : numRows;
          let s = "";
          for (let row = 0; row < colLen; row++)
            s += input[row * numCols + col] ?? "";
          return s;
        })
        .join("");
    },
    decrypt: (input, config) => {
      const kw = String(config.keyword) || "KEY";
      const numCols = kw.length;
      const numRows = Math.ceil(input.length / numCols);
      const padding = numRows * numCols - input.length;
      const order = getColOrder(kw);
      const colLengths = Array<number>(numCols).fill(numRows);
      for (let c = numCols - padding; c < numCols; c++)
        colLengths[c] = numRows - 1;
      const cols: string[] = Array<string>(numCols).fill("");
      let pos = 0;
      for (const col of order) {
        cols[col] = input.slice(pos, pos + colLengths[col]);
        pos += colLengths[col];
      }
      const ptrs = Array<number>(numCols).fill(0);
      let result = "";
      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          if (ptrs[col] < cols[col].length) result += cols[col][ptrs[col]++];
        }
      }
      return result;
    },
  },

  rot13: {
    id: "rot13",
    label: "ROT13",
    description: "Self-inverse rotation",
    configurable: false,
    configSchema: [],
    defaultConfig: {},
    encrypt: (input) =>
      input
        .split("")
        .map((c) => caesarShift(c, 13))
        .join(""),
    decrypt: (input) =>
      input
        .split("")
        .map((c) => caesarShift(c, 13))
        .join(""),
  },

  reverse: {
    id: "reverse",
    label: "Reverse",
    description: "Reverses the text",
    configurable: false,
    configSchema: [],
    defaultConfig: {},
    encrypt: (input) => input.split("").reverse().join(""),
    decrypt: (input) => input.split("").reverse().join(""),
  },

  base64: {
    id: "base64",
    label: "Base64",
    description: "Encode / decode",
    configurable: false,
    configSchema: [],
    defaultConfig: {},
    encrypt: (input) => {
      const bytes = new TextEncoder().encode(input);
      const binary = Array.from(bytes)
        .map((b) => String.fromCharCode(b))
        .join("");
      return btoa(binary);
    },
    decrypt: (input) => {
      const binary = atob(input);
      const bytes = Uint8Array.from(
        binary.split("").map((c) => c.charCodeAt(0)),
      );
      return new TextDecoder().decode(bytes);
    },
  },
};
