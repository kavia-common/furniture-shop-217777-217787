import { Injectable } from '@angular/core';

const KEY = 'furniture_user_id';

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class UserContextService {
  /** Provides a stable pseudo-user id stored in localStorage for demo purposes. */
  getUserId(): string {
    try {
      // SSR-safe: Only use localStorage/crypto in browser
      const g = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
      const localStorage = g?.localStorage ?? undefined;
      const crypto = g?.crypto ?? undefined;

      const existing = localStorage?.getItem(KEY);
      if (existing) return existing;

      const generated = typeof crypto?.randomUUID === 'function'
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);

      if (localStorage) localStorage.setItem(KEY, generated);
      return generated;
    } catch {
      // Fallback if localStorage/crypto not available (SSR/Node); generate ephemeral id
      return Math.random().toString(36).slice(2);
    }
  }

  // PUBLIC_INTERFACE
  getAuthHeaders(): { [k: string]: string } {
    /** Returns the X-User-Id header object to be merged into HTTP requests. */
    return { 'X-User-Id': this.getUserId() };
  }
}
