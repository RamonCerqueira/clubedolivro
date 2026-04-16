-- DropForeignKey
ALTER TABLE "ClubPost" DROP CONSTRAINT "ClubPost_clubId_fkey";

-- AlterTable
ALTER TABLE "ClubPost" ALTER COLUMN "clubId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ClubPost" ADD CONSTRAINT "ClubPost_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;
