/*
  Warnings:

  - The values [beginner,medium,advanced] on the enum `Level` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `duration` on the `Lectures` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Level_new" AS ENUM ('Beginner', 'Intermediate', 'Advanced');
ALTER TABLE "Course" ALTER COLUMN "courseLevel" DROP DEFAULT;
ALTER TABLE "Course" ALTER COLUMN "courseLevel" TYPE "Level_new" USING ("courseLevel"::text::"Level_new");
ALTER TYPE "Level" RENAME TO "Level_old";
ALTER TYPE "Level_new" RENAME TO "Level";
DROP TYPE "Level_old";
ALTER TABLE "Course" ALTER COLUMN "courseLevel" SET DEFAULT 'Beginner';
COMMIT;

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "courseLevel" SET DEFAULT 'Beginner';

-- AlterTable
ALTER TABLE "Lectures" DROP COLUMN "duration",
ADD COLUMN     "isPreviewFree" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publicId" TEXT,
ALTER COLUMN "videoUrl" DROP NOT NULL;
