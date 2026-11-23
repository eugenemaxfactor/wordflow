export interface Flashcard {
  id: string;
  word: string;
  translation: string;
  imageUrl?: string;
  example?: string;
  learned: boolean;
}
