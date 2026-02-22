import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { BoardActions } from './state/board.actions';
import { BoardModel } from './state/board.models';
import { selectBoard, selectBoardError, selectBoardLoading } from './state/board.selectors';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private store = inject(Store);

  board$: Observable<BoardModel | null> = this.store.select(selectBoard);
  loading$: Observable<boolean> = this.store.select(selectBoardLoading);
  error$: Observable<string | null> = this.store.select(selectBoardError);

  boardId = 1;
  newCardColumnId = 1;
  newCardTitle = '';
  newCardDescription = '';

  ngOnInit() {
    this.store.dispatch(BoardActions.loadBoard({ boardId: this.boardId }));
  }

  addCard() {
    if (!this.newCardTitle.trim()) {
      return;
    }

    this.store.dispatch(
      BoardActions.addCard({
        boardId: this.boardId,
        columnId: this.newCardColumnId,
        title: this.newCardTitle.trim(),
        description: this.newCardDescription.trim()
      })
    );

    this.newCardTitle = '';
    this.newCardDescription = '';
  }

  moveCard(cardId: number, toColumnId: number) {
    this.store.dispatch(
      BoardActions.moveCard({
        boardId: this.boardId,
        cardId,
        toColumnId,
        position: 9999
      })
    );
  }
}
