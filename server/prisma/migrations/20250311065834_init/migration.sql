-- CreateTable
CREATE TABLE "User" (
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userName")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
