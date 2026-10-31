import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FashionService } from '../../services/fashion.service';
import { Fashion } from '../../models/fashion.model';

@Component({
  selector: 'app-fashion-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fashion-detail.component.html',
  styleUrls: ['./fashion-detail.component.css']
})
export class FashionDetailComponent implements OnInit {
  fashion: Fashion | null = null;
  relatedFashions: Fashion[] = [];
  loading = true;
  errorMsg = '';

  constructor(
    private fashionService: FashionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) this.loadFashion(id);
    });
  }

  loadFashion(id: string): void {
    this.loading = true;
    this.fashionService.getById(id).subscribe({
      next: (res) => {
        this.fashion = res.data;
        this.loading = false;
        this.loadRelated(res.data.style);
      },
      error: (err) => {
        this.errorMsg = 'Lỗi tải dữ liệu: ' + err.message;
        this.loading = false;
      }
    });
  }

  loadRelated(style: string): void {
    this.fashionService.getByStyle(style).subscribe({
      next: (res) => {
        this.relatedFashions = res.data.filter(f => f._id !== this.fashion?._id).slice(0, 4);
      },
      error: () => {}
    });
  }

  goBack(): void { this.router.navigate(['/']); }

  viewRelated(id: string): void {
    this.router.navigate(['/detail', id]);
    window.scrollTo(0, 0);
  }

  getThumbnailUrl(thumbnail: string): string {
    if (!thumbnail) return 'https://via.placeholder.com/600x400?text=No+Image';
    if (thumbnail.startsWith('http')) return thumbnail;
    return 'http://localhost:4000' + thumbnail;
  }

  getStyleIcon(style: string): string {
    const icons: Record<string, string> = {
      'Casual': '👕', 'Formal': '👔', 'Streetwear': '🧥',
      'Sportswear': '⚽', 'Vintage': '🎩', 'Bohemian': '🌸'
    };
    return icons[style] || '✨';
  }
}

