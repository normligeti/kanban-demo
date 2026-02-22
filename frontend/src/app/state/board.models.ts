export interface CardModel {
  id: number;
  column_id: number;
  title: string;
  description: string;
  position: number;
}

export interface ColumnModel {
  id: number;
  board_id: number;
  title: string;
  position: number;
  cards: CardModel[];
}

export interface BoardModel {
  id: number;
  name: string;
  columns: ColumnModel[];
}

export interface BoardState {
  board: BoardModel | null;
  loading: boolean;
  error: string | null;
}
