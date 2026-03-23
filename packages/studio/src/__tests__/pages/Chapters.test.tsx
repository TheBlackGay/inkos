import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Chapters from '../../pages/Chapters';
import { apiService } from '../../services/api';

// 模拟 apiService
jest.mock('../../services/api', () => ({
  apiService: {
    getBook: jest.fn(),
    getChapters: jest.fn(),
    createChapter: jest.fn(),
    updateChapter: jest.fn(),
    deleteChapter: jest.fn(),
    reorderChapters: jest.fn(),
  },
}));

const mockApiService = apiService as jest.Mocked<typeof apiService>;

describe('Chapters Component', () => {
  const mockBook = {
    id: '1',
    title: '测试书籍',
    genre: 'fantasy',
    status: 'active',
    chapters: 3,
    wordCount: 45000,
    createdAt: '2026-01-01',
  };

  const mockChapters = [
    {
      id: '1',
      number: 1,
      title: '第一章 开始',
      status: 'approved',
      wordCount: 15000,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      auditIssues: [],
      content: '这是第一章的内容',
      bookId: '1',
      order: 0,
    },
    {
      id: '2',
      number: 2,
      title: '第二章 发展',
      status: 'approved',
      wordCount: 15000,
      createdAt: '2026-01-02',
      updatedAt: '2026-01-02',
      auditIssues: [],
      content: '这是第二章的内容',
      bookId: '1',
      order: 1,
    },
    {
      id: '3',
      number: 3,
      title: '第三章 高潮',
      status: 'drafted',
      wordCount: 15000,
      createdAt: '2026-01-03',
      updatedAt: '2026-01-03',
      auditIssues: [],
      content: '这是第三章的内容',
      bookId: '1',
      order: 2,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockApiService.getBook.mockResolvedValue({
      success: true,
      data: mockBook,
    });
    mockApiService.getChapters.mockResolvedValue({
      success: true,
      data: {
        items: mockChapters,
        total: 3,
        page: 1,
        pageSize: 100,
      },
    });
  });

  const renderChapters = () => {
    return render(
      <MemoryRouter initialEntries={['/books/1/chapters']}>
        <Routes>
          <Route path="/books/:id/chapters" element={<Chapters />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders Chapters component', async () => {
    renderChapters();
    
    await waitFor(() => {
      expect(screen.getByText('章节管理')).toBeInTheDocument();
    });
    
    expect(screen.getByText('书籍: 测试书籍')).toBeInTheDocument();
  });

  test('loads and displays chapters', async () => {
    renderChapters();
    
    await waitFor(() => {
      expect(screen.getByText('第一章 开始')).toBeInTheDocument();
      expect(screen.getByText('第二章 发展')).toBeInTheDocument();
      expect(screen.getByText('第三章 高潮')).toBeInTheDocument();
    });
  });

  test('opens create chapter modal when clicking new chapter button', async () => {
    renderChapters();
    
    await waitFor(() => {
      expect(screen.getByText('新建章节')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('新建章节'));
    
    await waitFor(() => {
      expect(screen.getByText('章节标题')).toBeInTheDocument();
      expect(screen.getByText('章节内容')).toBeInTheDocument();
    });
  });

  test('opens view chapter modal when clicking view button', async () => {
    renderChapters();
    
    await waitFor(() => {
      expect(screen.getAllByTitle('查看')).toHaveLength(3);
    });
    
    fireEvent.click(screen.getAllByTitle('查看')[0]);
    
    await waitFor(() => {
      expect(screen.getByText('第一章 开始')).toBeInTheDocument();
      expect(screen.getByText('这是第一章的内容')).toBeInTheDocument();
    });
  });

  test('opens edit chapter modal when clicking edit button', async () => {
    renderChapters();
    
    await waitFor(() => {
      expect(screen.getAllByTitle('编辑内容')).toHaveLength(3);
    });
    
    fireEvent.click(screen.getAllByTitle('编辑内容')[0]);
    
    await waitFor(() => {
      expect(screen.getByText('编辑第1章: 第一章 开始')).toBeInTheDocument();
    });
  });

  test('opens rename chapter modal when clicking rename button', async () => {
    renderChapters();
    
    await waitFor(() => {
      expect(screen.getAllByTitle('重命名')).toHaveLength(3);
    });
    
    fireEvent.click(screen.getAllByTitle('重命名')[0]);
    
    await waitFor(() => {
      expect(screen.getByText('重命名章节')).toBeInTheDocument();
    });
  });

  test('handles chapter deletion', async () => {
    mockApiService.deleteChapter.mockResolvedValue({ success: true });
    
    renderChapters();
    
    await waitFor(() => {
      expect(screen.getAllByTitle('删除')).toHaveLength(3);
    });
    
    // 模拟确认对话框
    window.confirm = jest.fn().mockReturnValue(true);
    
    fireEvent.click(screen.getAllByTitle('删除')[0]);
    
    await waitFor(() => {
      expect(mockApiService.deleteChapter).toHaveBeenCalledWith('1', '1');
    });
  });

  test('handles chapter reordering', async () => {
    mockApiService.reorderChapters.mockResolvedValue({ success: true });
    
    renderChapters();
    
    await waitFor(() => {
      expect(screen.getAllByTitle('下移')).toHaveLength(3);
    });
    
    fireEvent.click(screen.getAllByTitle('下移')[0]);
    
    await waitFor(() => {
      expect(mockApiService.reorderChapters).toHaveBeenCalled();
    });
  });

  test('handles sync functionality', async () => {
    renderChapters();
    
    await waitFor(() => {
      expect(screen.getByText('同步')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('同步'));
    
    await waitFor(() => {
      expect(mockApiService.getChapters).toHaveBeenCalled();
    });
  });
});
