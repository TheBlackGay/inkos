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

export interface Chapter {
  id: string;
  number: number;
  title: string;
  status: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
  auditIssues: string[];
  content: string;
  bookId: string;
  parentChapterId?: string;
  order: number;
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
        // 如果不是JSON格式，尝试获取文本内容并返回错误
        const text = await response.text();
        console.error('非JSON响应:', text);
        return { 
          success: false, 
          error: `响应不是 JSON 格式: ${text.substring(0, 100)}...` 
        };
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '请求失败');
      }

      return { success: true, data };
    } catch (error) {
      console.error('请求错误:', error);
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

  // 章节相关 API
  async getChapters(bookId: string, params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse<PaginatedResponse<Chapter>>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const url = `/books/${bookId}/chapters${queryString ? `?${queryString}` : ''}`;
    return this.request<PaginatedResponse<Chapter>>(url);
  }

  async getChapter(bookId: string, chapterId: string): Promise<ApiResponse<Chapter>> {
    return this.request<Chapter>(`/books/${bookId}/chapters/${chapterId}`);
  }

  async createChapter(bookId: string, chapter: {
    title: string;
    content?: string;
    parentChapterId?: string;
  }): Promise<ApiResponse<Chapter>> {
    return this.request<Chapter>(`/books/${bookId}/chapters`, {
      method: 'POST',
      body: JSON.stringify(chapter),
    });
  }

  async updateChapter(bookId: string, chapterId: string, chapter: Partial<Chapter>): Promise<ApiResponse<Chapter>> {
    return this.request<Chapter>(`/books/${bookId}/chapters/${chapterId}`, {
      method: 'PUT',
      body: JSON.stringify(chapter),
    });
  }

  async deleteChapter(bookId: string, chapterId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/books/${bookId}/chapters/${chapterId}`, {
      method: 'DELETE',
    });
  }

  async reorderChapters(bookId: string, order: { id: string; order: number }[]): Promise<ApiResponse<void>> {
    return this.request<void>(`/books/${bookId}/chapters/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ order }),
    });
  }
}

export const apiService = new ApiService();
