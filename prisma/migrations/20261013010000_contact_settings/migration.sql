-- CreateTable
CREATE TABLE "ContactSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "telegram" TEXT NOT NULL DEFAULT '',
    "whatsapp" TEXT NOT NULL DEFAULT '',
    "instagram" TEXT NOT NULL DEFAULT '',
    "linkedin" TEXT NOT NULL DEFAULT '',
    "replyDays" TEXT NOT NULL DEFAULT '2',

    CONSTRAINT "ContactSettings_pkey" PRIMARY KEY ("id")
);
