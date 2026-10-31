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
  loading = true;
  errorMsg = '';

  constructor(
    private fashionService: FashionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fashionService.getById(id).subscribe({
        next: (res) => {
          this.fashion = res.data;
          this.loading = false;
        },
        error: (err) => {
          this.errorMsg = 'Lỗi tải dữ liệu: ' + err.message;
          this.loading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/list']);
  }

  editFashion(): void {
    if (this.fashion?._id) {
      this.router.navigate(['/admin/edit', this.fashion._id]);
    }
  }

  getThumbnailUrl(): string {
    if (!this.fashion?.thumbnail) return 'https://via.placeholder.com/400x300?text=No+Image';
    if (this.fashion.thumbnail.startsWith('http')) return this.fashion.thumbnail;
    return 'http://localhost:4000' + this.fashion.thumbnail;
  }
}

