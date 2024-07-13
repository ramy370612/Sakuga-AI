-- CreateTable
CREATE TABLE "Paragraph" (
    "novelId" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "paragraph" TEXT NOT NULL,
    "imageKey" TEXT,

    CONSTRAINT "Paragraph_pkey" PRIMARY KEY ("novelId","index")
);

-- AddForeignKey
ALTER TABLE "Paragraph" ADD CONSTRAINT "Paragraph_novelId_fkey" FOREIGN KEY ("novelId") REFERENCES "Novel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
