import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <header class="site-header">
      <div class="header-inner">
        <a href="/" class="logo">✨ FashionWorld</a>
        <nav class="site-nav">
          <a href="/">Trang chủ</a>
          <a href="http://localhost:4001" target="_blank">Admin</a>
        </nav>
      </div>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
    <footer class="site-footer">
      <p>© 2024 FashionWorld - Khám phá phong cách của bạn</p>
    </footer>
  `,
  styles: [`
    .site-header {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      padding: 0 30px;
      box-shadow: 0 2px 20px rgba(0,0,0,0.3);
      position: sticky; top: 0; z-index: 1000;
    }
    .header-inner {
      max-width: 1300px; margin: 0 auto;
      display: flex; justify-content: space-between; align-items: center; height: 60px;
    }
    .logo { font-size: 22px; font-weight: bold; color: white; text-decoration: none; letter-spacing: 1px; }
    .site-nav { display: flex; gap: 25px; }
    .site-nav a { color: #ccc; text-decoration: none; font-size: 15px; transition: color 0.2s; padding: 5px 0; border-bottom: 2px solid transparent; }
    .site-nav a:hover { color: white; border-bottom-color: #764ba2; }
    .site-footer { background: #1a1a2e; color: #ccc; text-align: center; padding: 20px; margin-top: 50px; font-size: 14px; }
  `]
})
export class App {
  title = 'client-fashion';
}

