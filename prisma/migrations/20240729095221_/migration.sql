/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `gyms` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "gyms_title_key" ON "gyms"("title");
