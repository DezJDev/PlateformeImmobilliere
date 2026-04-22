export interface QuestionProp {
  id: number;
  annonceId: number;

  authorId?: number | null;
  authorName?: string | null;

  content: string;

  answer?: string | null;
  answerAuthorId?: number | null;
  answerAuthorName?: string | null;
  answeredAt?: string | null;

  createdAt: string;
}


export interface CreateQuestionDto {
  annonceId: number;
  content: string;
}

export interface AnswerQuestionDto {
  questionId: number;
  answer: string;
}

