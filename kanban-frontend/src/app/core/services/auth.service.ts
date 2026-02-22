import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly tokenStorageKey = 'kanban.auth.token';

    login(token: string): void {
        localStorage.setItem(this.tokenStorageKey, token);
    }

    logout(): void {
        localStorage.removeItem(this.tokenStorageKey);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenStorageKey);
    }

    isAuthenticated(): boolean {
        return Boolean(this.getToken());
    }
}
