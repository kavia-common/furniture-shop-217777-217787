import { Injectable } from '@angular/core';

const KEY = 'furniture_user_id';

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class UserContextService {
  /** Provides a stable pseudo-user id stored in localStorage for demo purposes. */
  getUserId(): string {
    try {
      const existing = globalThis?.localStorage?.getItem(KEY);
      if (existing) return existing;
      const generated = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
      globalThis?.localStorage?.setItem(KEY, generated);
      return generated;
    } catch {
      // Fallback if localStorage not available (SSR); generate ephemeral id
      return Math.random().toString(36).slice(2);
    }
  }

  // PUBLIC_INTERFACE
  getAuthHeaders(): { [k: string]: string } {
    /** Returns the X-User-Id header object to be merged into HTTP requests. */
    return { 'X-User-Id': this.getUserId() };
  }
}
