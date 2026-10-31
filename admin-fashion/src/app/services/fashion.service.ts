import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fashion, ApiResponse } from '../models/fashion.model';

@Injectable({
  providedIn: 'root'
})
export class FashionService {
  private apiUrl = 'http://localhost:4000/api/fashions';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Fashion[]>> {
    return this.http.get<ApiResponse<Fashion[]>>(this.apiUrl);
  }

  getById(id: string): Observable<ApiResponse<Fashion>> {
    return this.http.get<ApiResponse<Fashion>>(`${this.apiUrl}/${id}`);
  }

  getByStyle(style: string): Observable<ApiResponse<Fashion[]>> {
    return this.http.get<ApiResponse<Fashion[]>>(`${this.apiUrl}/style/${encodeURIComponent(style)}`);
  }

  getStyles(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.apiUrl}/styles`);
  }

  create(formData: FormData): Observable<ApiResponse<Fashion>> {
    return this.http.post<ApiResponse<Fashion>>(this.apiUrl, formData);
  }

  update(id: string, formData: FormData): Observable<ApiResponse<Fashion>> {
    return this.http.put<ApiResponse<Fashion>>(`${this.apiUrl}/${id}`, formData);
  }

  delete(id: string): Observable<ApiResponse<Fashion>> {
    return this.http.delete<ApiResponse<Fashion>>(`${this.apiUrl}/${id}`);
  }
}

