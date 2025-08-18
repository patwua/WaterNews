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

