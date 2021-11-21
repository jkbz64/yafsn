import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

const pkg = require("./package.json");

export default {
  input: "index.ts",
  output: [
    { file: pkg.module, format: "es" },
    { file: pkg.main, format: "umd", name: "yafsn" },
  ],
  plugins: [typescript({ tsconfig: "./tsconfig.json" }), svelte(), resolve()],
};
