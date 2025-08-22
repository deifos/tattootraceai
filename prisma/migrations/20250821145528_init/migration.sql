-- CreateTable
CREATE TABLE "public"."user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "availableCredits" INTEGER NOT NULL DEFAULT 0,
    "freeCreditsUsed" INTEGER NOT NULL DEFAULT 0,
    "stripeCustomerId" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."purchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT,
    "stripeSessionId" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "status" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creditsRemaining" INTEGER NOT NULL,
    "creditsUsed" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."generation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "baseImageUrl" TEXT,
    "tattooImageUrl" TEXT,
    "bodyPart" TEXT,
    "creditsUsed" INTEGER NOT NULL DEFAULT 1,
    "wasFree" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prompt" TEXT,

    CONSTRAINT "generation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "public"."session"("token");

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."purchase" ADD CONSTRAINT "purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."generation" ADD CONSTRAINT "generation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
