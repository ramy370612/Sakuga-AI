-- CreateTable
CREATE TABLE "Voice" (
    "novelId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "speaker" INTEGER NOT NULL,
    "voiceKey" TEXT NOT NULL,

    CONSTRAINT "Voice_pkey" PRIMARY KEY ("novelId","index")
);

-- AddForeignKey
ALTER TABLE "Voice" ADD CONSTRAINT "Voice_novelId_fkey" FOREIGN KEY ("novelId") REFERENCES "Novel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
