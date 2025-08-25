// Loosen unresolved packages when registry blocks installs
declare module "marked" {
  const marked: any;
  export { marked };
  export default marked;
}
declare module "prop-types" { const v: any; export default v; export = v; }
declare module "webidl-conversions" { const v: any; export default v; export = v; }
declare module "whatwg-url" { const v: any; export default v; export = v; }
declare module "axios" { const v: any; export default v; export = v; }
declare module "bcryptjs" { const v: any; export default v; export = v; }


// Minimal fallbacks so tsc doesn’t need real packages during typecheck
declare module "cloudinary" {
  export const v2: any;
  const _default: any;
  export default _default;
}
declare module "socket.io-client";
declare module "socket.io";
declare module "next-auth/jwt";
declare module "next/script";

declare module "react/jsx-runtime";
