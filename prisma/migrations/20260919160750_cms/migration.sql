
-- CreateEnum
CREATE TYPE "ContentBlockType" AS ENUM ('STATIC_PAGE', 'FAQ_ENTRY', 'PRESS_RELEASE');

-- CreateTable
CREATE TABLE "ContentBlock" (
    "id" UUID NOT NULL,
    "type" "ContentBlockType" NOT NULL,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "position" INTEGER,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentBlock_type_slug_key" ON "ContentBlock"("type", "slug");

