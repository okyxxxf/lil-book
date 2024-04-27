export type issuing = {
  id?: number;
  dateIssue: Date | string;
  dateReturn: Date | string;
  bookId: number;
  book: string;
  libraryCardId: string | number;
}