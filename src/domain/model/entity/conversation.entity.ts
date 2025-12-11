import { StartDate } from '../vo/start-date.vo';
import { Question } from './question.entity';

export class Conversation {
  private _ended: boolean;
  private _firstMediaId: bigint | null;
  private _questions: Question[];

  private constructor(
    private _id: bigint | null,
    private _childProfileId: number,
    private _startDate: StartDate,
    private _title: string | null,
    ended: boolean,
    firstMediaId: bigint | null,
    questions: Question[],
  ) {
    this._ended = ended;
    this._firstMediaId = firstMediaId;
    this._questions = questions;
  }

  static create(props: {
    childProfileId: number;
    startDate: StartDate;
  }): Conversation {
    if (!Number.isInteger(props.childProfileId) || props.childProfileId <= 0) {
      throw new Error('INVALID_CHILD_PROFILE_ID');
    }
    return new Conversation(
      null,
      props.childProfileId,
      props.startDate,
      null,
      false,
      null,
      [],
    );
  }

  static rehydrate(snapshot: {
    id: bigint;
    childProfileId: number;
    startDate: StartDate;
    title: string | null;
    ended: boolean;
    firstMediaId: bigint | null;
    questions: Question[];
  }): Conversation {
    const normalizedTitle = snapshot.title?.trim() ?? null;
    return new Conversation(
      snapshot.id,
      snapshot.childProfileId,
      snapshot.startDate,
      normalizedTitle,
      snapshot.ended,
      snapshot.firstMediaId,
      [...snapshot.questions],
    );
  }

  addQuestion(question: Question): void {
    this.ensureNotEnded();
    if (!question.getAnswerText()?.trim()) {
      throw new Error('ANSWER_REQUIRED_FOR_QUESTION');
    }

    const hasSameOrder = this._questions.some(
      (questionItem) =>
        questionItem.getOrder().value === question.getOrder().value,
    );
    if (hasSameOrder) throw new Error('DUPLICATE_QUESTION_ORDER');

    const maxOrder = this._questions.reduce(
      (currentMax, questionItem) =>
        Math.max(currentMax, questionItem.getOrder().value),
      0,
    );
    if (question.getOrder().value !== maxOrder + 1) {
      throw new Error('ORDER_MUST_BE_CONSECUTIVE');
    }
    this._questions.push(question);

    if (this._firstMediaId == null && question.getImageMediaId() != null) {
      this._firstMediaId = question.getImageMediaId();
    }
  }

  end(): void {
    this.ensureNotEnded();
    this._ended = true;
  }

  setTitleFromInsight(title: string): void {
    if (!this._ended) throw new Error('CONVERSATION_NOT_ENDED');
    if (this._title !== null) throw new Error('TITLE_ALREADY_SET');
    const trimmedTitle = title?.trim();
    if (!trimmedTitle) throw new Error('EMPTY_TITLE');
    this._title = trimmedTitle;
  }

  private ensureNotEnded(): void {
    if (this._ended) throw new Error('CONVERSATION_ALREADY_ENDED');
  }

  getId(): bigint | null {
    return this._id;
  }
  getChildProfileId(): number {
    return this._childProfileId;
  }
  getStartDate(): StartDate {
    return this._startDate;
  }
  getTitle(): string | null {
    return this._title;
  }
  isEnded(): boolean {
    return this._ended;
  }
  getFirstMediaId(): bigint | null {
    return this._firstMediaId;
  }
  getQuestions(): readonly Question[] {
    return this._questions;
  }
}
