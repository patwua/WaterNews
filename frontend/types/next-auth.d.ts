declare module 'next-auth' {
  export type NextAuthOptions = any;
  const NextAuth: any;
  export default NextAuth;
  export const getServerSession: any;
}
declare module 'next-auth/react' {
  export const SessionProvider: any;
}
declare module 'next-auth/next' {
  export const getServerSession: any;
}
declare module 'next-auth/providers/credentials' {
  const CredentialsProvider: any;
  export default CredentialsProvider;
}
