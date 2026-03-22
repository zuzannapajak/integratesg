/*
  Warnings:

  - The values [professor] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('educator', 'student');
ALTER TABLE "public"."Profile" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Profile" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "Profile" ALTER COLUMN "role" SET DEFAULT 'student';
COMMIT;
