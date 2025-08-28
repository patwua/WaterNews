// Minimal Next.js types to unblock tsc when @types packages are unavailable
declare module "next/link" {
  const Link: any;
  export default Link;
}
declare module "next/head" {
  const Head: any;
  export default Head;
}
declare module "next/dynamic" {
  const dynamic: any;
  export default dynamic;
}
declare module "next/router" {
  export const useRouter: any;
  const _default: any;
  export default _default;
}
declare module "next/app" {
  export type AppProps = any;
}
declare module "next/image" {
  const Image: any;
  export default Image;
}
declare module "next/document" {
  export const Html: any;
  export const Head: any;
  export const Main: any;
  export const NextScript: any;
  export default class Document {
    render(): any;
  }
}
declare module "next" {
  export interface NextApiRequest {
    method?: string;
    query: any;
    body: any;
    headers: any;
  }
  export interface NextApiResponse<T = any> {
    status: (n: number) => NextApiResponse<T>;
    json: (b: any) => void;
    setHeader: (k: string, v: any) => void;
    end: (b?: any) => void;
    send: (b?: any) => void;
  }
  export type GetStaticPaths = any;
  export type GetStaticProps = any;
  export type GetServerSideProps = any;
  export interface NextConfig { [key: string]: any }
}
