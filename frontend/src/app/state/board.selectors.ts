import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BoardState } from './board.models';

export const selectBoardState = createFeatureSelector<BoardState>('board');

export const selectBoard = createSelector(selectBoardState, (state) => state.board);
export const selectBoardLoading = createSelector(selectBoardState, (state) => state.loading);
export const selectBoardError = createSelector(selectBoardState, (state) => state.error);
