/*
  Warnings:

  - The `schema` column on the `posts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "content" DROP NOT NULL,
DROP COLUMN "schema",
ADD COLUMN     "schema" JSONB,
ALTER COLUMN "featuredImageUrl" SET DATA TYPE VARCHAR(1024);
