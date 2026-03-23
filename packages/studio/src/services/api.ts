// 暂时使用本地类型定义，因为 @inkos/core 模块无法直接导入
export interface BookConfig {
  id: string;
  title: string;
  platform: string;
  genre: string;
  status: string;
  targetChapters: number;
  chapterWordCount: number;
  language?: string;
  createdAt: string;
  updatedAt: string;
  parentBookId?: string;
  fanficMode?: string;
}

interface Book extends BookConfig {
  chapters: number;
  wordCount: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export class ApiService {
  private baseUrl = '/api';

  private async request<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // 处理 204 No Content 响应
      if (response.status === 204) {
        return { success: true };
      }

      // 检查响应是否有内容
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('响应不是 JSON 格式');
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '请求失败');
      }

      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '未知错误' 
      };
    }
  }

  // 书籍相关 API
  async getBooks(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse<PaginatedResponse<Book>>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const url = `/books${queryString ? `?${queryString}` : ''}`;
    return this.request<PaginatedResponse<Book>>(url);
  }

  async getBook(id: string): Promise<ApiResponse<Book>> {
    return this.request<Book>(`/books/${id}`);
  }

  async createBook(book: {
    title: string;
    genre: string;
    status: string;
    platform?: string;
  }): Promise<ApiResponse<Book>> {
    return this.request<Book>('/books', {
      method: 'POST',
      body: JSON.stringify(book),
    });
  }

  async updateBook(id: string, book: Partial<BookConfig>): Promise<ApiResponse<Book>> {
    return this.request<Book>(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(book),
    });
  }

  async deleteBook(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/books/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
