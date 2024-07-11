/*
  Warnings:

  - The primary key for the `Novel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Paragraph` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Paragraph" DROP CONSTRAINT "Paragraph_novelId_fkey";

-- AlterTable
ALTER TABLE "Novel" DROP CONSTRAINT "Novel_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Novel_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Novel_id_seq";

-- AlterTable
ALTER TABLE "Paragraph" DROP CONSTRAINT "Paragraph_pkey",
ALTER COLUMN "novelId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Paragraph_pkey" PRIMARY KEY ("novelId", "index");

-- AddForeignKey
ALTER TABLE "Paragraph" ADD CONSTRAINT "Paragraph_novelId_fkey" FOREIGN KEY ("novelId") REFERENCES "Novel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
