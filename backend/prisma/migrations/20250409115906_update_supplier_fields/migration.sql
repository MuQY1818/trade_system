/*
  Warnings:

  - You are about to drop the column `contact` on the `supplier` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `supplier` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `supplier` table. All the data in the column will be lost.
  - Added the required column `contact_person` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contact_phone` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `credit_rating` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_category` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplier_name` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Made the column `address` on table `supplier` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `supplier` DROP COLUMN `contact`,
    DROP COLUMN `name`,
    DROP COLUMN `phone`,
    ADD COLUMN `contact_person` VARCHAR(191) NOT NULL,
    ADD COLUMN `contact_phone` VARCHAR(191) NOT NULL,
    ADD COLUMN `credit_rating` VARCHAR(191) NOT NULL,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `product_category` VARCHAR(191) NOT NULL,
    ADD COLUMN `remarks` TEXT NULL,
    ADD COLUMN `supplier_name` VARCHAR(191) NOT NULL,
    MODIFY `address` VARCHAR(191) NOT NULL;
