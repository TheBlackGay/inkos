import React, { useState } from 'react';
import { Book, Plus, Edit, Trash2, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Input, Select, Card } from '../components/ui';

interface Book {
  id: string;
  title: string;
  genre: string;
  status: string;
  chapters: number;
  wordCount: number;
  createdAt: string;
}

const Books: React.FC = () => {
  // Mock data for books
  const [books, setBooks] = useState<Book[]>([
    {
      id: '1',
      title: '吞天魔帝',
      genre: '玄幻',
      status: 'active',
      chapters: 31,
      wordCount: 452191,
      createdAt: '2026-01-15'
    },
    {
      id: '2',
      title: '都市修仙',
      genre: '都市',
      status: 'active',
      chapters: 15,
      wordCount: 225000,
      createdAt: '2026-02-01'
    },
    {
      id: '3',
      title: '星际穿越',
      genre: '科幻',
      status: 'incubating',
      chapters: 5,
      wordCount: 75000,
      createdAt: '2026-03-10'
    },
    {
      id: '4',
      title: '剑侠情缘',
      genre: '仙侠',
      status: 'paused',
      chapters: 20,
      wordCount: 300000,
      createdAt: '2026-01-20'
    },
    {
      id: '5',
      title: '鬼灭之刃同人',
      genre: '同人',
      status: 'active',
      chapters: 10,
      wordCount: 150000,
      createdAt: '2026-02-15'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [newBook, setNewBook] = useState({
    title: '',
    genre: '',
    status: 'incubating'
  });

  const statusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge badge-success';
      case 'incubating':
        return 'badge badge-info';
      case 'paused':
        return 'badge badge-warning';
      case 'completed':
        return 'badge badge-success';
      case 'dropped':
        return 'badge badge-danger';
      default:
        return 'badge badge-secondary';
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return '进行中';
      case 'incubating':
        return '孵化中';
      case 'paused':
        return '暂停';
      case 'completed':
        return '已完成';
      case 'dropped':
        return '已放弃';
      default:
        return status;
    }
  };

  const handleCreateBook = () => {
    if (newBook.title && newBook.genre) {
      const book: Book = {
        id: String(books.length + 1),
        title: newBook.title,
        genre: newBook.genre,
        status: newBook.status,
        chapters: 0,
        wordCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setBooks([book, ...books]);
      setIsCreateModalOpen(false);
      setNewBook({ title: '', genre: '', status: 'incubating' });
    }
  };

  const handleEditBook = () => {
    if (currentBook && newBook.title && newBook.genre) {
      setBooks(books.map(book => 
        book.id === currentBook.id 
          ? { ...book, title: newBook.title, genre: newBook.genre, status: newBook.status }
          : book
      ));
      setIsEditModalOpen(false);
      setCurrentBook(null);
      setNewBook({ title: '', genre: '', status: 'incubating' });
    }
  };

  const handleDeleteBook = (id: string) => {
    if (window.confirm('确定要删除这本书吗？')) {
      setBooks(books.filter(book => book.id !== id));
    }
  };



  const filteredBooks = books
    .filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === 'all' || book.status === filterStatus)
    )
    .sort((a, b) => {
      let aValue = a[sortBy as keyof Book];
      let bValue = b[sortBy as keyof Book];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">书籍管理</h1>
        <Button 
          variant="primary" 
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          新建书籍
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="搜索书籍..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">所有状态</option>
            <option value="incubating">孵化中</option>
            <option value="active">进行中</option>
            <option value="paused">暂停</option>
            <option value="completed">已完成</option>
            <option value="dropped">已放弃</option>
          </Select>
          <div className="flex items-center space-x-2">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt">创建日期</option>
              <option value="title">标题</option>
              <option value="chapters">章节数</option>
              <option value="wordCount">字数</option>
            </Select>
            <Button
              variant="secondary"
              size="sm"
              className="p-2"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Books Table */}
      <Card className="overflow-x-auto">
        <div className="min-w-[640px]">
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                标题
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                题材
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                章节数
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                字数
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                创建日期
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBooks.map((book) => (
              <tr key={book.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Book className="h-5 w-5 text-primary mr-2" />
                    <Link to={`/books/${book.id}/chapters`} className="font-medium text-gray-900 hover:text-primary">
                      {book.title}
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{book.genre}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={statusBadgeClass(book.status)}>
                    {statusLabel(book.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{book.chapters}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{book.wordCount.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{book.createdAt}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Link to={`/books/${book.id}/chapters`} className="text-primary hover:text-primary/80">
                      <Edit className="h-4 w-4" />
                    </Link>
                    <Link to={`/books/${book.id}/state`} className="text-secondary hover:text-secondary/80">
                      <Book className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="text-danger hover:text-danger/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredBooks.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">未找到书籍</p>
          </div>
        )}
        </div>
      </Card>

      {/* Create Book Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">新建书籍</h2>
            <div className="space-y-4">
              <Input
                label="标题"
                type="text"
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              />
              <Input
                label="题材"
                type="text"
                value={newBook.genre}
                onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
              />
              <Select
                label="状态"
                value={newBook.status}
                onChange={(e) => setNewBook({ ...newBook, status: e.target.value })}
              >
                <option value="incubating">孵化中</option>
                <option value="active">进行中</option>
                <option value="paused">暂停</option>
                <option value="completed">已完成</option>
                <option value="dropped">已放弃</option>
              </Select>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <Button
                variant="secondary"
                onClick={() => setIsCreateModalOpen(false)}
              >
                取消
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateBook}
              >
                创建
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {isEditModalOpen && currentBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">编辑书籍</h2>
            <div className="space-y-4">
              <Input
                label="标题"
                type="text"
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              />
              <Input
                label="题材"
                type="text"
                value={newBook.genre}
                onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
              />
              <Select
                label="状态"
                value={newBook.status}
                onChange={(e) => setNewBook({ ...newBook, status: e.target.value })}
              >
                <option value="incubating">孵化中</option>
                <option value="active">进行中</option>
                <option value="paused">暂停</option>
                <option value="completed">已完成</option>
                <option value="dropped">已放弃</option>
              </Select>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <Button
                variant="secondary"
                onClick={() => setIsEditModalOpen(false)}
              >
                取消
              </Button>
              <Button
                variant="primary"
                onClick={handleEditBook}
              >
                保存
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;