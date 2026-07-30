import base from "../../eslint.config.mjs";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  ...base,
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
];
