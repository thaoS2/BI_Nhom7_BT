export interface Fashion {
  _id?: string;
  tieude: string;
  chitiet: string;
  thumbnail: string;
  style: string;
  ngaytao?: Date | string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

