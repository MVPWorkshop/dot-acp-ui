/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEST_MINT_RPC_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
