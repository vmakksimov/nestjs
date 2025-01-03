/*
  Warnings:

  - You are about to drop the column `createDate` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `deleteDate` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `updateDate` on the `Tag` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "createDate",
DROP COLUMN "deleteDate",
DROP COLUMN "updateDate";
