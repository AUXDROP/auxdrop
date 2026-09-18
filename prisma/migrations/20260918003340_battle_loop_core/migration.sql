-- CreateEnum
CREATE TYPE "BattleStatus" AS ENUM ('UPCOMING', 'OPEN', 'PENDING', 'COMPLETED', 'ERROR');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING_REVIEW', 'ACCEPTED', 'FLAGGED', 'DISQUALIFIED');

-- AlterTable
ALTER TABLE "Battle" ADD COLUMN     "durationMinutes" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN     "entryFee" DECIMAL(10,2) NOT NULL DEFAULT 25,
ADD COLUMN     "genre" TEXT,
ADD COLUMN     "prizePool" DECIMAL(10,2),
ADD COLUMN     "startsAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "BattleStatus" NOT NULL DEFAULT 'UPCOMING',
ADD COLUMN     "submissionDeadline" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "createdAt",
ADD COLUMN     "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
ADD COLUMN     "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "trackId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "Track" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "waveformPeaks" JSONB,
    "durationSec" INTEGER NOT NULL,
    "creatorId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BattleResult" (
    "id" UUID NOT NULL,
    "battleId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "submissionId" UUID NOT NULL,
    "placement" INTEGER,
    "score" DOUBLE PRECISION,
    "advanced" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BattleResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BattleResult_submissionId_key" ON "BattleResult"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX "BattleResult_battleId_userId_key" ON "BattleResult"("battleId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_trackId_key" ON "Submission"("trackId");

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleResult" ADD CONSTRAINT "BattleResult_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "Battle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleResult" ADD CONSTRAINT "BattleResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BattleResult" ADD CONSTRAINT "BattleResult_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

