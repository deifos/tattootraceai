import { PrismaClient } from '@prisma/client'

// PrismaClient singleton for Next.js
// Prevents multiple instances during development hot reloads

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma