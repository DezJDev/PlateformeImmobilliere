import { QuestionProp } from "@/lib/types/QuestionProp";
import type { Question } from "@prisma/client";

type PrismaQuestionWithUsers = Question & {
    author?: { firstName: string; lastName: string } | null;
    answerAuthor?: { firstName: string; lastName: string } | null;
};

export function toQuestionProp(q: PrismaQuestionWithUsers): QuestionProp {
    return {
        id: q.id,
        annonceId: q.annonceId,
        authorId: q.authorId ?? null,
        authorName: q.author ? `${q.author.firstName} ${q.author.lastName}` : null,
        content: q.content,
        answer: q.answer ?? null,
        answerAuthorId: q.answerAuthorId ?? null,
        answerAuthorName: q.answerAuthor ? `${q.answerAuthor.firstName} ${q.answerAuthor.lastName}` : null,
        answeredAt: q.answeredAt ? q.answeredAt.toISOString() : null,
        createdAt: q.createdAt.toISOString(),
    };
}
