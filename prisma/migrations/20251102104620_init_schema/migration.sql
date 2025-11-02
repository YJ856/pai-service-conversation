-- CreateTable
CREATE TABLE "Conversation" (
    "id" BIGSERIAL NOT NULL,
    "childProfileId" INTEGER NOT NULL,
    "startDate" DATE NOT NULL,
    "title" TEXT,
    "firstMediaId" BIGINT,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" BIGSERIAL NOT NULL,
    "conversationId" BIGINT NOT NULL,
    "questionOrder" BIGINT NOT NULL,
    "questionText" TEXT NOT NULL,
    "imageMediaId" BIGINT,
    "keyword" TEXT,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" BIGSERIAL NOT NULL,
    "questionId" BIGINT NOT NULL,
    "answerText" TEXT NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Conversation_childProfileId_idx" ON "Conversation"("childProfileId");

-- CreateIndex
CREATE INDEX "Question_conversationId_idx" ON "Question"("conversationId");

-- CreateIndex
CREATE UNIQUE INDEX "Question_conversationId_questionOrder_key" ON "Question"("conversationId", "questionOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Answer_questionId_key" ON "Answer"("questionId");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
