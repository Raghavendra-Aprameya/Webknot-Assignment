-- CreateTable
CREATE TABLE "Event" (
    "event_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "date" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "capacity" INTEGER,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("event_id")
);
