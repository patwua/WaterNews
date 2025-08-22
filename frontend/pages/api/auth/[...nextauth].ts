import NextAuth, { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { dbConnect } from '../../../lib/mongodb'
import User from '../../../models/User'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null
        await dbConnect()
        // Use the typed model to avoid Mongoose union-callable type error
        const user = await User.findOne({ email: credentials.email }).exec()
        if (!user) return null
        const ok = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!ok) return null
        return { id: user._id.toString(), name: user.name || '', email: user.email, image: user.profilePhotoUrl || '' }
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.uid = (user as any).id
      return token
    },
    async session({ session, token }) {
      if (token?.uid) (session.user as any).id = token.uid
      return session
    }
  },
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET
}
export default NextAuth(authOptions)
