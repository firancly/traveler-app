/*
  Warnings:

  - You are about to drop the column `verifiedById` on the `place` table. All the data in the column will be lost.
  - Made the column `source` on table `place` required. This step will fail if there are existing NULL values in that column.
  - Made the column `verified` on table `place` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "place" DROP CONSTRAINT "place_verifiedById_fkey";

-- AlterTable
ALTER TABLE "place" DROP COLUMN "verifiedById",
ALTER COLUMN "source" SET NOT NULL,
ALTER COLUMN "verified" SET NOT NULL;
