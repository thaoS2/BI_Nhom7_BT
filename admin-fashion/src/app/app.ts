import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <nav class="navbar">
      <div class="nav-brand">👗 Fashion Admin</div>
      <div class="nav-links">
        <a href="/admin/list">Danh sách Fashion</a>
        <a href="/admin/add">Thêm mới</a>
      </div>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 24px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      color: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
    .nav-brand { font-size: 20px; font-weight: bold; }
    .nav-links { display: flex; gap: 20px; }
    .nav-links a {
      color: #ccc;
      text-decoration: none;
      padding: 6px 12px;
      border-radius: 6px;
      transition: all 0.2s;
    }
    .nav-links a:hover { color: white; background: rgba(255,255,255,0.1); }
  `]
})
export class App {
  title = 'admin-fashion';
}
