/*
  Warnings:

  - You are about to drop the column `createdAt` on the `MetaOption` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `MetaOption` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[googleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MetaOption" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
