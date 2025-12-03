import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { getTheme } from './config/app-config';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Furniture Shop';
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    const theme = getTheme();
    // Access document through globalThis to satisfy SSR and linter "no-undef"
    const g: any = (typeof globalThis !== 'undefined') ? (globalThis as any) : undefined;
    const d: any = g && g.document ? g.document : null;
    if (isPlatformBrowser(this.platformId) && d && d.body) {
      d.body.style.backgroundColor = theme.background;
      d.body.style.color = theme.text;
    }
  }
}
