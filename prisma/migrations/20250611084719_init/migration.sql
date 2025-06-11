-- CreateTable
CREATE TABLE "Password" (
    "id" SERIAL NOT NULL,
    "location1" TEXT NOT NULL,
    "location2" TEXT,
    "location3" TEXT,
    "username" TEXT,
    "email" TEXT,
    "password" TEXT NOT NULL,

    CONSTRAINT "Password_pkey" PRIMARY KEY ("id")
);
