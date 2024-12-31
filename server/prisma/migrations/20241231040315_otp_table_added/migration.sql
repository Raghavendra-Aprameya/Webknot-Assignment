-- CreateTable
CREATE TABLE "OTP" (
    "id" SERIAL NOT NULL,
    "otp" INTEGER NOT NULL,
    "userid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OTP" ADD CONSTRAINT "OTP_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;
