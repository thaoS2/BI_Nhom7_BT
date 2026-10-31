import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FashionService } from '../../services/fashion.service';
import { Fashion } from '../../models/fashion.model';

@Component({
  selector: 'app-fashion-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './fashion-list.component.html',
  styleUrls: ['./fashion-list.component.css']
})
export class FashionListComponent implements OnInit {
  fashions: Fashion[] = [];
  loading = true;
  errorMsg = '';
  successMsg = '';

  constructor(private fashionService: FashionService, private router: Router) {}

  ngOnInit(): void {
    this.loadFashions();
  }

  loadFashions(): void {
    this.loading = true;
    this.fashionService.getAll().subscribe({
      next: (res) => {
        this.fashions = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = 'Lỗi tải danh sách: ' + err.message;
        this.loading = false;
      }
    });
  }

  viewDetail(id: string): void {
    this.router.navigate(['/admin/detail', id]);
  }

  editFashion(id: string): void {
    this.router.navigate(['/admin/edit', id]);
  }

  addNew(): void {
    this.router.navigate(['/admin/add']);
  }

  deleteFashion(fashion: Fashion): void {
    if (!confirm(`Bạn có chắc muốn xóa fashion "${fashion.tieude}" không?`)) return;
    this.fashionService.delete(fashion._id!).subscribe({
      next: () => {
        this.successMsg = 'Đã xóa thành công!';
        this.fashions = this.fashions.filter(f => f._id !== fashion._id);
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err) => {
        this.errorMsg = 'Lỗi khi xóa: ' + err.message;
      }
    });
  }

  getThumbnailUrl(thumbnail: string): string {
    if (!thumbnail) return 'https://via.placeholder.com/60x60?text=No+Image';
    if (thumbnail.startsWith('http')) return thumbnail;
    return 'http://localhost:4000' + thumbnail;
  }
}

