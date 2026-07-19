-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "company" VARCHAR(100),
    "service" VARCHAR(100),
    "budget" VARCHAR(50),
    "subject" VARCHAR(150) NOT NULL,
    "message" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Contact_email_idx" ON "Contact"("email");

-- CreateIndex
CREATE INDEX "Contact_status_idx" ON "Contact"("status");

-- CreateIndex
CREATE INDEX "Contact_createdAt_idx" ON "Contact"("createdAt");
