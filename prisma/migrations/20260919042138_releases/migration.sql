
-- CreateEnum
CREATE TYPE "ReleaseStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'LIVE');

-- CreateTable
CREATE TABLE "Release" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "season" TEXT,
    "status" "ReleaseStatus" NOT NULL DEFAULT 'DRAFT',
    "releaseDate" TIMESTAMP(3),
    "spotifyUrl" TEXT,
    "appleMusicUrl" TEXT,
    "tidalUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Release_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReleaseTrack" (
    "id" UUID NOT NULL,
    "releaseId" UUID NOT NULL,
    "trackId" UUID NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "ReleaseTrack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoyaltySplit" (
    "id" UUID NOT NULL,
    "releaseId" UUID NOT NULL,
    "userId" UUID,
    "percentage" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoyaltySplit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReleaseTrack_releaseId_trackId_key" ON "ReleaseTrack"("releaseId", "trackId");

-- AddForeignKey
ALTER TABLE "ReleaseTrack" ADD CONSTRAINT "ReleaseTrack_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReleaseTrack" ADD CONSTRAINT "ReleaseTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoyaltySplit" ADD CONSTRAINT "RoyaltySplit_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoyaltySplit" ADD CONSTRAINT "RoyaltySplit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

