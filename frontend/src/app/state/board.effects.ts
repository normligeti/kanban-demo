import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { BoardApiService } from '../board-api.service';
import { BoardActions } from './board.actions';

@Injectable()
export class BoardEffects {
  loadBoard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.loadBoard),
      mergeMap(({ boardId }) =>
        this.boardApi.getBoard(boardId).pipe(
          map((board) => BoardActions.loadBoardSuccess({ board })),
          catchError((error) =>
            of(
              BoardActions.loadBoardFailure({
                error: error?.message || 'Failed to load board'
              })
            )
          )
        )
      )
    )
  );

  addCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.addCard),
      mergeMap(({ boardId, columnId, title, description }) =>
        this.boardApi.addCard(boardId, columnId, title, description).pipe(
          map(() => BoardActions.socketConnected()),
          catchError((error) =>
            of(
              BoardActions.addCardFailure({
                error: error?.message || 'Failed to add card'
              })
            )
          )
        )
      )
    )
  );

  moveCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.moveCard),
      mergeMap(({ boardId, cardId, toColumnId, position }) =>
        this.boardApi.moveCard(boardId, cardId, toColumnId, position).pipe(
          map(() => BoardActions.socketConnected()),
          catchError((error) =>
            of(
              BoardActions.moveCardFailure({
                error: error?.message || 'Failed to move card'
              })
            )
          )
        )
      )
    )
  );

  connectSocket$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BoardActions.loadBoard),
        tap(() => this.boardApi.connectSocket())
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private boardApi: BoardApiService) {}
}
