/*
  Warnings:

  - You are about to drop the column `paragraph` on the `Paragraph` table. All the data in the column will be lost.
  - Added the required column `content` to the `Paragraph` table without a default value. This is not possible if the table is not empty.
  - Made the column `imageKey` on table `Paragraph` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Paragraph" DROP COLUMN "paragraph",
ADD COLUMN     "content" TEXT NOT NULL,
ALTER COLUMN "imageKey" SET NOT NULL;
