CREATE TYPE "AdminAvatarPreset" AS ENUM ('DOG', 'BEAR', 'CAT', 'FOX', 'KOALA', 'OWL');

CREATE TABLE "AdminProfile" (
  "id" SERIAL NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "avatarPreset" "AdminAvatarPreset" NOT NULL DEFAULT 'BEAR',
  "avatarImage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "AdminProfile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AdminProfile_email_key" ON "AdminProfile"("email");
