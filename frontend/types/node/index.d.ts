declare namespace NodeJS {
  interface ProcessEnv { [key: string]: string | undefined }
  interface Process { env: ProcessEnv }
}
declare var process: NodeJS.Process;
declare var __dirname: string;
declare var module: any;
declare var global: any;
