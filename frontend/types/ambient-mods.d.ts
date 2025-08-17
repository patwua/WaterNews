// Loosen unresolved packages when registry blocks installs
declare module "mongoose" { const v: any; export default v; export = v; }
declare module "marked" { const v: any; export default v; export = v; }

