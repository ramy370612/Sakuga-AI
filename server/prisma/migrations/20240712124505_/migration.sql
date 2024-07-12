/*
  Warnings:

  - You are about to drop the column `imageURL` on the `Paragraph` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Paragraph" DROP COLUMN "imageURL",
ADD COLUMN     "imageKey" TEXT;
