-- CreateTable
CREATE TABLE "Novel" (
    "id" SERIAL NOT NULL,
    "workId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "titleReading" TEXT NOT NULL,
    "sortReading" TEXT,
    "publicationDate" TEXT NOT NULL,
    "lastUpdateDate" TEXT NOT NULL,
    "cardUrl" TEXT NOT NULL,
    "authorSurname" TEXT NOT NULL,
    "authorGivenName" TEXT,
    "authorSurnameReading" TEXT NOT NULL,
    "authorGivenNameReading" TEXT,
    "authorSurnameSortReading" TEXT NOT NULL,
    "authorGivenNameSortReading" TEXT,
    "authorSurnameRomaji" TEXT NOT NULL,
    "authorGivenNameRomaji" TEXT,
    "characterCount" DOUBLE PRECISION,
    "openingSentence" TEXT,
    "totalAccessCount" INTEGER NOT NULL,
    "htmlFileUrl" TEXT NOT NULL,

    CONSTRAINT "Novel_pkey" PRIMARY KEY ("id")
);
