import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BoardActions } from './state/board.actions';
import { BoardModel } from './state/board.models';

@Injectable({ providedIn: 'root' })
export class BoardApiService {
  private http = inject(HttpClient);
  private store = inject(Store);

  private readonly apiBaseUrl = 'http://localhost:3000/api';
  private readonly wsUrl = 'ws://localhost:3000/ws';

  private socket: WebSocket | null = null;

  getBoard(boardId: number): Observable<BoardModel> {
    return this.http.get<BoardModel>(`${this.apiBaseUrl}/boards/${boardId}`);
  }

  addCard(boardId: number, columnId: number, title: string, description: string) {
    return this.http.post(`${this.apiBaseUrl}/boards/${boardId}/cards`, {
      columnId,
      title,
      description
    });
  }

  moveCard(boardId: number, cardId: number, toColumnId: number, position: number) {
    return this.http.patch(`${this.apiBaseUrl}/boards/${boardId}/cards/${cardId}/move`, {
      toColumnId,
      position
    });
  }

  connectSocket() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return;
    }

    this.socket = new WebSocket(this.wsUrl);

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'card.created') {
        this.store.dispatch(
          BoardActions.socketCardCreated({
            boardId: message.boardId,
            card: message.payload
          })
        );
      }

      if (message.type === 'card.moved') {
        this.store.dispatch(
          BoardActions.socketCardMoved({
            boardId: message.boardId,
            card: message.payload
          })
        );
      }
    };
  }
}
