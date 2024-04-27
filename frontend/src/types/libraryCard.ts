import { reader } from "./reader";

export type libraryCard = {
  id?: number;
  dateCreated: string | Date;
  readerId?: string | number;
  reader?: reader | string;
}