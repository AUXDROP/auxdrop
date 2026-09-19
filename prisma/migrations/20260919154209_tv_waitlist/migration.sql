
-- CreateTable
CREATE TABLE "TvWaitlistEntry" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "userId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TvWaitlistEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TvWaitlistEntry_email_key" ON "TvWaitlistEntry"("email");

-- AddForeignKey
ALTER TABLE "TvWaitlistEntry" ADD CONSTRAINT "TvWaitlistEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

