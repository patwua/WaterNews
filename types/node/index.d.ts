declare namespace NodeJS {
  interface ProcessEnv { [key: string]: string | undefined }
  interface Process { env: ProcessEnv }
}
declare var process: NodeJS.Process;
declare var __dirname: string;
declare var module: any;
declare var global: any;

declare module 'node:test' {
  export const mock: any;
  export const test: any;
}

declare module 'node:assert/strict' {
  const assert: any;
  export default assert;
}
