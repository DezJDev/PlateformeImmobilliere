import prisma from "../global/globalPrisma";
import { Question } from "@prisma/client";

export async function addQuestionAnswer(params: {
    questionId: number;
    answer: string;
    responderId: number;
}): Promise<Question> {
    const { questionId, answer, responderId } = params;

    return prisma.question.update({
        where: { id: questionId },
        data: {
            answer: answer.trim(),
            answerAuthorId: responderId,
            answeredAt: new Date(),
        },
    });
}

export async function createQuestion(params: {
    annonceId: number;
    content: string;
    authorId: number;
}): Promise<Question> {
    const { annonceId, content, authorId } = params;
    const question = await prisma.question.create({
        data: {
            annonceId: Number(annonceId),
            content: content.trim(),
            authorId: Number(authorId),
        },
    });
    return question;
}
