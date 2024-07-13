/*
  Warnings:

  - You are about to drop the column `imageKey` on the `Paragraph` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Paragraph" DROP COLUMN "imageKey",
ADD COLUMN     "imageURL" TEXT;
