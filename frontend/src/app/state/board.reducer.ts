import { createReducer, on } from '@ngrx/store';
import { BoardActions } from './board.actions';
import { BoardState, ColumnModel } from './board.models';

export const initialBoardState: BoardState = {
  board: null,
  loading: false,
  error: null
};

function upsertCardInColumns(columns: ColumnModel[], card: { id: number; column_id: number; title: string; description: string; position: number }) {
  const columnsWithoutCard = columns.map((column) => ({
    ...column,
    cards: column.cards.filter((existingCard) => existingCard.id !== card.id)
  }));

  return columnsWithoutCard.map((column) => {
    if (column.id !== card.column_id) {
      return column;
    }

    const cards = [...column.cards, card].sort((a, b) => a.position - b.position || a.id - b.id);
    return { ...column, cards };
  });
}

export const boardReducer = createReducer(
  initialBoardState,
  on(BoardActions.loadBoard, (state) => ({ ...state, loading: true, error: null })),
  on(BoardActions.loadBoardSuccess, (state, { board }) => ({
    ...state,
    loading: false,
    board,
    error: null
  })),
  on(BoardActions.loadBoardFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(BoardActions.addCardFailure, BoardActions.moveCardFailure, (state, { error }) => ({ ...state, error })),
  on(BoardActions.socketCardCreated, (state, { boardId, card }) => {
    if (!state.board || state.board.id !== boardId) {
      return state;
    }

    return {
      ...state,
      board: {
        ...state.board,
        columns: upsertCardInColumns(state.board.columns, card)
      }
    };
  }),
  on(BoardActions.socketCardMoved, (state, { boardId, card }) => {
    if (!state.board || state.board.id !== boardId) {
      return state;
    }

    return {
      ...state,
      board: {
        ...state.board,
        columns: upsertCardInColumns(state.board.columns, card)
      }
    };
  })
);
