/*
  Warnings:

  - You are about to drop the column `active` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `location1` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `location2` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `location3` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Password` table. All the data in the column will be lost.
  - Added the required column `cipher` to the `Password` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iv` to the `Password` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salt` to the `Password` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Password" DROP COLUMN "active",
DROP COLUMN "createdAt",
DROP COLUMN "email",
DROP COLUMN "location1",
DROP COLUMN "location2",
DROP COLUMN "location3",
DROP COLUMN "password",
DROP COLUMN "username",
ADD COLUMN     "cipher" TEXT NOT NULL,
ADD COLUMN     "iv" TEXT NOT NULL,
ADD COLUMN     "salt" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Entry" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "location1" TEXT NOT NULL,
    "location2" TEXT,
    "location3" TEXT,
    "username" TEXT,
    "email" TEXT,
    "passwordId" INTEGER NOT NULL,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Entry_passwordId_key" ON "Entry"("passwordId");

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_passwordId_fkey" FOREIGN KEY ("passwordId") REFERENCES "Password"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
