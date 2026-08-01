CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

ALTER TABLE "Order"
ADD COLUMN "status_new" "OrderStatus" NOT NULL DEFAULT 'PENDING';

UPDATE "Order"
SET "status_new" = CASE
  WHEN "status" = true THEN 'COMPLETED'::"OrderStatus"
  ELSE 'PENDING'::"OrderStatus"
END;

ALTER TABLE "Order" DROP COLUMN "status";
ALTER TABLE "Order" RENAME COLUMN "status_new" TO "status";
