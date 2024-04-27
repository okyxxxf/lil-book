export type book = {
  id?: number;
  name: string;
  year: number;
  price: number;
  count: number;
  authorId: number;
  author?: string;
  publisherId: number;
  publisher?: string;
}