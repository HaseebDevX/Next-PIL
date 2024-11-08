/*
  Warnings:

  - You are about to drop the column `Reason for wanting to remove your current representation from y` on the `Incident` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Incident" DROP COLUMN "Reason for wanting to remove your current representation from y",
ADD COLUMN     "Reason for wanting to remove your current representation from your claim?" TEXT;
