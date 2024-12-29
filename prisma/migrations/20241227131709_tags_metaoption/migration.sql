/*
  Warnings:

  - The values [DRAFT,SCHEDULED,REVIEW,PUBLISHED] on the enum `postStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [POST,PAGE,STORY,SERIES] on the enum `postType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "postStatus_new" AS ENUM ('draft', 'scheduled', 'review', 'published');
ALTER TABLE "posts" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "posts" ALTER COLUMN "status" TYPE "postStatus_new" USING ("status"::text::"postStatus_new");
ALTER TYPE "postStatus" RENAME TO "postStatus_old";
ALTER TYPE "postStatus_new" RENAME TO "postStatus";
DROP TYPE "postStatus_old";
ALTER TABLE "posts" ALTER COLUMN "status" SET DEFAULT 'draft';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "postType_new" AS ENUM ('post', 'page', 'story', 'series');
ALTER TABLE "posts" ALTER COLUMN "postType" DROP DEFAULT;
ALTER TABLE "posts" ALTER COLUMN "postType" TYPE "postType_new" USING ("postType"::text::"postType_new");
ALTER TYPE "postType" RENAME TO "postType_old";
ALTER TYPE "postType_new" RENAME TO "postType";
DROP TYPE "postType_old";
ALTER TABLE "posts" ALTER COLUMN "postType" SET DEFAULT 'post';
COMMIT;

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "postType" SET DEFAULT 'post',
ALTER COLUMN "status" SET DEFAULT 'draft';
