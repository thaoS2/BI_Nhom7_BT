import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FashionService } from '../../services/fashion.service';
import { Fashion } from '../../models/fashion.model';

interface StyleGroup {
  style: string;
  fashions: Fashion[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  allFashions: Fashion[] = [];
  styleGroups: StyleGroup[] = [];
  styles: string[] = [];
  selectedStyle = '';
  searchStyle = '';
  loading = true;
  errorMsg = '';

  constructor(private fashionService: FashionService, private router: Router) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.fashionService.getAll().subscribe({
      next: (res) => {
        this.allFashions = res.data;
        this.groupByStyle(this.allFashions);
        this.styles = [...new Set(this.allFashions.map(f => f.style))];
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = 'Không thể tải dữ liệu: ' + err.message;
        this.loading = false;
      }
    });
  }

  groupByStyle(fashions: Fashion[]): void {
    const map = new Map<string, Fashion[]>();
    fashions.forEach(f => {
      if (!map.has(f.style)) map.set(f.style, []);
      map.get(f.style)!.push(f);
    });
    this.styleGroups = Array.from(map.entries()).map(([style, fashions]) => ({ style, fashions }));
  }

  onStyleSelect(): void {
    this.searchStyle = this.selectedStyle;
    this.filterByStyle();
  }

  filterByStyle(): void {
    const keyword = this.searchStyle.trim();
    if (!keyword) {
      this.groupByStyle(this.allFashions);
      return;
    }
    this.fashionService.getByStyle(keyword).subscribe({
      next: (res) => this.groupByStyle(res.data),
      error: () => this.groupByStyle([])
    });
  }

  clearFilter(): void {
    this.selectedStyle = '';
    this.searchStyle = '';
    this.groupByStyle(this.allFashions);
  }

  viewDetail(id: string): void {
    this.router.navigate(['/detail', id]);
  }

  getThumbnailUrl(thumbnail: string): string {
    if (!thumbnail) return 'https://via.placeholder.com/300x200?text=No+Image';
    if (thumbnail.startsWith('http')) return thumbnail;
    return 'http://localhost:4000' + thumbnail;
  }

  getStyleIcon(style: string): string {
    const icons: Record<string, string> = {
      'Casual': '👕',
      'Formal': '👔',
      'Streetwear': '🧥',
      'Sportswear': '⚽',
      'Vintage': '🎩',
      'Bohemian': '🌸'
    };
    return icons[style] || '✨';
  }
}

