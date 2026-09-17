/*
  Warnings:

  - You are about to drop the column `externalId` on the `place` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[osmId]` on the table `place` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `place` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cityId` to the `place` table without a default value. This is not possible if the table is not empty.
  - Made the column `latitude` on table `place` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `place` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "PlaceCategory" AS ENUM ('food', 'culture', 'nature', 'shopping', 'nightlife', 'attraction');

-- CreateEnum
CREATE TYPE "PlaceLabel" AS ENUM ('popular', 'hidden', 'instagram', 'skip');

-- CreateEnum
CREATE TYPE "PriceBand" AS ENUM ('free', 'low', 'mid', 'high');

-- AlterTable
ALTER TABLE "place" DROP COLUMN "externalId",
ADD COLUMN     "aiConfidence" DOUBLE PRECISION,
ADD COLUMN     "aiLabel" "PlaceLabel",
ADD COLUMN     "category" "PlaceCategory" NOT NULL,
ADD COLUMN     "cityId" TEXT NOT NULL,
ADD COLUMN     "indoor" BOOLEAN,
ADD COLUMN     "labels" "PlaceLabel"[],
ADD COLUMN     "openingHours" TEXT,
ADD COLUMN     "osmId" TEXT,
ADD COLUMN     "priceBand" "PriceBand",
ADD COLUMN     "source" TEXT DEFAULT 'osm',
ADD COLUMN     "verified" BOOLEAN DEFAULT false,
ADD COLUMN     "verifiedAt" TIMESTAMP(3),
ADD COLUMN     "verifiedById" TEXT,
ALTER COLUMN "latitude" SET NOT NULL,
ALTER COLUMN "longitude" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "place_osmId_key" ON "place"("osmId");

-- CreateIndex
CREATE INDEX "place_cityId_verified_category_idx" ON "place"("cityId", "verified", "category");

-- AddForeignKey
ALTER TABLE "place" ADD CONSTRAINT "place_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
