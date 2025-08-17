// Lightweight NextAuth helpers for local typechecking
declare module "next-auth" {
  export interface NextAuthOptions {
    [key: string]: any;
  }
  const NextAuth: (options: NextAuthOptions) => any;
  export default NextAuth;
  export function getServerSession(...args: any[]): Promise<any>;
}

declare module "next-auth/react" {
  export function useSession(): any;
  export function signIn(provider?: string, options?: any): Promise<any>;
  export function signOut(options?: any): Promise<any>;
  export const SessionProvider: any;
}

declare module "next-auth/providers/credentials" {
  export default function Credentials(config?: any): any;
}

declare module "next-auth/next" {
  export function getServerSession(...args: any[]): Promise<any>;
}
