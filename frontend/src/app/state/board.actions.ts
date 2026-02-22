import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { BoardModel, CardModel } from './board.models';

export const BoardActions = createActionGroup({
  source: 'Board',
  events: {
    'Load Board': props<{ boardId: number }>(),
    'Load Board Success': props<{ board: BoardModel }>(),
    'Load Board Failure': props<{ error: string }>(),
    'Add Card': props<{ boardId: number; columnId: number; title: string; description: string }>(),
    'Add Card Failure': props<{ error: string }>(),
    'Move Card': props<{ boardId: number; cardId: number; toColumnId: number; position: number }>(),
    'Move Card Failure': props<{ error: string }>(),
    'Socket Connected': emptyProps(),
    'Socket Card Created': props<{ boardId: number; card: CardModel }>(),
    'Socket Card Moved': props<{ boardId: number; card: CardModel }>()
  }
});
