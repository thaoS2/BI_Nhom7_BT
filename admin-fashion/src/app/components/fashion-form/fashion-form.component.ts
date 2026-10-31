import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FashionService } from '../../services/fashion.service';
import { Fashion } from '../../models/fashion.model';

declare var tinymce: any;

@Component({
  selector: 'app-fashion-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fashion-form.component.html',
  styleUrls: ['./fashion-form.component.css']
})
export class FashionFormComponent implements OnInit, AfterViewInit {
  fashion: Fashion = {
    tieude: '',
    chitiet: '',
    thumbnail: '',
    style: '',
    ngaytao: new Date().toISOString().substring(0, 10)
  };

  isEditMode = false;
  fashionId: string | null = null;
  loading = false;
  saving = false;
  errorMsg = '';
  successMsg = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  editorReady = false;

  stylesOptions = ['Casual', 'Formal', 'Streetwear', 'Sportswear', 'Vintage', 'Bohemian'];

  constructor(
    private fashionService: FashionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fashionId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.fashionId;

    if (this.isEditMode && this.fashionId) {
      this.loading = true;
      this.fashionService.getById(this.fashionId).subscribe({
        next: (res) => {
          this.fashion = res.data;
          if (this.fashion.ngaytao) {
            this.fashion.ngaytao = new Date(this.fashion.ngaytao).toISOString().substring(0, 10);
          }
          this.loading = false;
          this.setEditorContent();
        },
        error: (err) => {
          this.errorMsg = 'Lỗi tải dữ liệu: ' + err.message;
          this.loading = false;
        }
      });
    }
  }

  ngAfterViewInit(): void {
    this.initTinyMCE();
  }

  initTinyMCE(): void {
    setTimeout(() => {
      if (typeof tinymce !== 'undefined') {
        tinymce.init({
          selector: '#chitiet-editor',
          height: 350,
          menubar: true,
          plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount',
          toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | image link | code | help',
          content_style: 'body { font-family: Arial, sans-serif; font-size: 14px; }',
          setup: (editor: any) => {
            editor.on('init', () => {
              this.editorReady = true;
              editor.setContent(this.fashion.chitiet || '');
            });
            editor.on('change keyup', () => {
              this.fashion.chitiet = editor.getContent();
            });
          }
        });
      }
    }, 500);
  }

  setEditorContent(): void {
    if (typeof tinymce !== 'undefined') {
      const editor = tinymce.get('chitiet-editor');
      if (editor) {
        editor.setContent(this.fashion.chitiet || '');
      }
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  getEditorContent(): string {
    if (typeof tinymce !== 'undefined') {
      const editor = tinymce.get('chitiet-editor');
      if (editor) return editor.getContent();
    }
    return this.fashion.chitiet || '';
  }

  onSubmit(): void {
    if (!this.fashion.tieude || !this.fashion.style) {
      this.errorMsg = 'Vui lòng điền đầy đủ thông tin bắt buộc!';
      return;
    }

    this.saving = true;
    this.errorMsg = '';
    this.fashion.chitiet = this.getEditorContent();

    const formData = new FormData();
    formData.append('tieude', this.fashion.tieude);
    formData.append('chitiet', this.fashion.chitiet || '');
    formData.append('style', this.fashion.style);
    if (this.fashion.ngaytao) formData.append('ngaytao', this.fashion.ngaytao.toString());
    if (this.selectedFile) {
      formData.append('thumbnail', this.selectedFile);
    } else {
      formData.append('thumbnail', this.fashion.thumbnail || '');
    }

    const req = this.isEditMode && this.fashionId
      ? this.fashionService.update(this.fashionId, formData)
      : this.fashionService.create(formData);

    req.subscribe({
      next: () => {
        this.successMsg = this.isEditMode ? 'Cập nhật thành công!' : 'Thêm mới thành công!';
        setTimeout(() => this.router.navigate(['/admin/list']), 1500);
      },
      error: (err) => {
        this.errorMsg = 'Lỗi: ' + err.message;
        this.saving = false;
      }
    });
  }

  goBack(): void {
    if (typeof tinymce !== 'undefined') tinymce.remove('#chitiet-editor');
    this.router.navigate(['/admin/list']);
  }

  getThumbnailUrl(): string {
    if (this.previewUrl) return this.previewUrl;
    if (!this.fashion.thumbnail) return '';
    if (this.fashion.thumbnail.startsWith('http')) return this.fashion.thumbnail;
    return 'http://localhost:4000' + this.fashion.thumbnail;
  }
}

