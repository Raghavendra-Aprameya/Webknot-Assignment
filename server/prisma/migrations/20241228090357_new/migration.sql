-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('Pending', 'Completed');

-- CreateTable
CREATE TABLE "Task" (
    "task_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "deadline" DATE NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'Pending',
    "attendee_id" INTEGER,
    "event_id" INTEGER,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("task_id")
);

-- CreateTable
CREATE TABLE "Attendee" (
    "attendee_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Attendee_pkey" PRIMARY KEY ("attendee_id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_attendee_id_fkey" FOREIGN KEY ("attendee_id") REFERENCES "Attendee"("attendee_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("event_id") ON DELETE SET NULL ON UPDATE CASCADE;
