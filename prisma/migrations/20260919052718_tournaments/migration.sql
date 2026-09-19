
-- CreateEnum
CREATE TYPE "TournamentStatus" AS ENUM ('UPCOMING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RoundStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Tournament" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "status" "TournamentStatus" NOT NULL DEFAULT 'UPCOMING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentEntrant" (
    "id" UUID NOT NULL,
    "tournamentId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "seed" INTEGER NOT NULL,

    CONSTRAINT "TournamentEntrant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Round" (
    "id" UUID NOT NULL,
    "tournamentId" UUID NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "status" "RoundStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoundMatch" (
    "id" UUID NOT NULL,
    "roundId" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "userAId" UUID,
    "userBId" UUID,
    "byeWinnerId" UUID,
    "battleId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoundMatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TournamentEntrant_tournamentId_userId_key" ON "TournamentEntrant"("tournamentId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "TournamentEntrant_tournamentId_seed_key" ON "TournamentEntrant"("tournamentId", "seed");

-- CreateIndex
CREATE UNIQUE INDEX "Round_tournamentId_roundNumber_key" ON "Round"("tournamentId", "roundNumber");

-- CreateIndex
CREATE UNIQUE INDEX "RoundMatch_battleId_key" ON "RoundMatch"("battleId");

-- CreateIndex
CREATE UNIQUE INDEX "RoundMatch_roundId_position_key" ON "RoundMatch"("roundId", "position");

-- AddForeignKey
ALTER TABLE "TournamentEntrant" ADD CONSTRAINT "TournamentEntrant_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentEntrant" ADD CONSTRAINT "TournamentEntrant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoundMatch" ADD CONSTRAINT "RoundMatch_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoundMatch" ADD CONSTRAINT "RoundMatch_userAId_fkey" FOREIGN KEY ("userAId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoundMatch" ADD CONSTRAINT "RoundMatch_userBId_fkey" FOREIGN KEY ("userBId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoundMatch" ADD CONSTRAINT "RoundMatch_byeWinnerId_fkey" FOREIGN KEY ("byeWinnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoundMatch" ADD CONSTRAINT "RoundMatch_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "Battle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

