import { QuestionOrder } from '../vo/question-order.vo';

export class Question {
  private constructor(
    private _id: bigint | null,
    private _order: QuestionOrder,
    private _questionText: string,
    private _imageMediaId: bigint | null,
    private _keyword: string | null,
    private _answerText: string,
  ) {
    Object.freeze(this._order);
  }

  static create(props: {
    order: QuestionOrder;
    questionText: string;
    imageMediaId?: bigint | null;
    keyword?: string | null;
    answerText: string;
  }): Question {
    const text = props.questionText?.trim();
    if (!text) throw new Error('EMPTY_QUESTION');

    const answer = props.answerText?.trim();
    if (!answer) throw new Error('EMPTY_ANSWER');

    return new Question(
      null,
      props.order,
      text,
      props.imageMediaId ?? null,
      props.keyword?.trim() ?? null,
      answer,
    );
  }

  static rehydrate(snapshot: {
    id: bigint;
    order: QuestionOrder;
    questionText: string;
    imageMediaId: bigint | null;
    keyword: string | null;
    answerText: string;
  }): Question {
    return new Question(
      snapshot.id,
      snapshot.order,
      snapshot.questionText?.trim(),
      snapshot.imageMediaId,
      snapshot.keyword?.trim() ?? null,
      snapshot.answerText?.trim(),
    );
  }

  getId(): bigint | null {
    return this._id;
  }
  getOrder(): QuestionOrder {
    return this._order;
  }
  getQuestionText(): string {
    return this._questionText;
  }
  getImageMediaId(): bigint | null {
    return this._imageMediaId;
  }
  getKeyword(): string | null {
    return this._keyword;
  }
  getAnswerText(): string {
    return this._answerText;
  }
}
