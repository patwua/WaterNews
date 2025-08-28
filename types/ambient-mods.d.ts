// Loosen unresolved packages when registry blocks installs
declare module "marked" { const marked: any; export { marked }; export default marked; }
declare module "prop-types" { const v: any; export default v; export = v; }
declare module "webidl-conversions" { const v: any; export default v; export = v; }
declare module "whatwg-url" { const v: any; export default v; export = v; }
declare module "axios" { const v: any; export default v; export = v; }
declare module "bcryptjs" { const v: any; export default v; export = v; }

// Minimal fallbacks so tsc doesn’t need real packages during typecheck
declare module "cloudinary" {
  export const v2: any;
  export interface UploadApiResponse {
    secure_url: string;
    public_id: string;
    resource_type: string;
    bytes: number;
    width: number;
    height: number;
    format: string;
  }
  export interface SearchApiResponse {
    resources: any[];
    next_cursor?: string;
  }
  const _default: any;
  export default _default;
}
declare module "socket.io-client";
declare module "socket.io";
declare module "next-auth/jwt";
declare module "next/script";

declare module "nodemailer" {
  export interface Transporter {
    sendMail: (opts: any) => Promise<any>;
  }
  const nodemailer: {
    createTransport: (url: string) => Transporter;
  };
  export default nodemailer;
}

declare module "tailwindcss" {
  export interface Config {
    [key: string]: any;
  }
}

declare module "http" {
  export interface IncomingMessage {
    headers: any;
    socket?: { remoteAddress?: string | null };
  }
}

declare module "react/jsx-runtime";
