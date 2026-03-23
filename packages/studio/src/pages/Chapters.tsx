import React, { useState, useEffect, Fragment } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Book, FileText, Edit, Trash2, Search, ChevronDown, ChevronUp, ChevronRight, CheckCircle, AlertTriangle, Clock, Activity, RefreshCw, Plus, ArrowUp, ArrowDown, Pencil } from 'lucide-react';
import { Button, Input, Select, Textarea, Card } from '../components/ui';
import { apiService } from '../services/api';

interface Chapter {
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

const Chapters: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('number');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isReviseModalOpen, setIsReviseModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [newChapter, setNewChapter] = useState({ title: '', content: '', parentChapterId: '' });
  const [renameTitle, setRenameTitle] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [page] = useState(1);
  const [pageSize] = useState(100);

  // 从本地存储加载章节数据
  const loadChaptersFromLocalStorage = () => {
    if (!id) return;
    try {
      const storedChapters = localStorage.getItem(`chapters_${id}`);
      if (storedChapters) {
        const parsedChapters = JSON.parse(storedChapters);
        setChapters(parsedChapters);
      }
      const storedBookTitle = localStorage.getItem(`bookTitle_${id}`);
      if (storedBookTitle) {
        setBookTitle(storedBookTitle);
      }
      const storedExpanded = localStorage.getItem(`expandedChapters_${id}`);
      if (storedExpanded) {
        setExpandedChapters(new Set(JSON.parse(storedExpanded)));
      }
    } catch (error) {
      console.error('从本地存储加载章节数据失败:', error);
    }
  };

  // 保存章节数据到本地存储
  const saveChaptersToLocalStorage = (chaptersData: Chapter[], bookTitleData: string) => {
    if (!id) return;
    try {
      localStorage.setItem(`chapters_${id}`, JSON.stringify(chaptersData));
      localStorage.setItem(`bookTitle_${id}`, bookTitleData);
      localStorage.setItem(`expandedChapters_${id}`, JSON.stringify([...expandedChapters]));
    } catch (error) {
      console.error('保存章节数据到本地存储失败:', error);
    }
  };

  // 加载章节列表
  const loadChapters = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    
    // 先从本地存储加载数据，提高响应速度
    loadChaptersFromLocalStorage();
    
    try {
      // 加载书籍信息
      const bookResponse = await apiService.getBook(id);
      if (bookResponse.success && bookResponse.data) {
        setBookTitle(bookResponse.data.title);
      }
      
      // 加载章节列表
      const response = await apiService.getChapters(id, {
        page,
        pageSize,
        search: searchTerm,
        status: filterStatus,
        sortBy,
        sortOrder
      });
      if (response.success && response.data) {
        setChapters(response.data.items);
        // 保存到本地存储
        saveChaptersToLocalStorage(response.data.items, bookTitle);
        setLastSyncTime(new Date().toLocaleString());
      } else {
        setError(response.error || '加载章节失败');
      }
    } catch (err) {
      setError('网络错误，使用本地存储的数据');
    } finally {
      setLoading(false);
    }
  };

  // 手动同步章节数据
  const syncChapters = async () => {
    if (!id) return;
    setIsSyncing(true);
    try {
      const response = await apiService.getChapters(id, {
        page,
        pageSize,
        search: searchTerm,
        status: filterStatus,
        sortBy,
        sortOrder
      });
      if (response.success && response.data) {
        setChapters(response.data.items);
        saveChaptersToLocalStorage(response.data.items, bookTitle);
        setLastSyncTime(new Date().toLocaleString());
        alert('同步成功');
      } else {
        alert('同步失败: ' + (response.error || '未知错误'));
      }
    } catch (error) {
      alert('网络错误，同步失败');
    } finally {
      setIsSyncing(false);
    }
  };

  // 初始加载和参数变化时重新加载
  useEffect(() => {
    loadChapters();
  }, [id, page, pageSize, searchTerm, filterStatus, sortBy, sortOrder]);

  const statusBadgeClass = (status: string) => {
    switch (status) {
      case 'drafted':
        return 'badge badge-info';
      case 'auditing':
        return 'badge badge-warning';
      case 'audit-passed':
        return 'badge badge-success';
      case 'audit-failed':
        return 'badge badge-danger';
      case 'revising':
        return 'badge badge-warning';
      case 'ready-for-review':
        return 'badge badge-info';
      case 'approved':
        return 'badge badge-success';
      case 'rejected':
        return 'badge badge-danger';
      case 'published':
        return 'badge badge-success';
      case 'imported':
        return 'badge badge-info';
      default:
        return 'badge badge-secondary';
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'drafted':
        return '已草稿';
      case 'auditing':
        return '审计中';
      case 'audit-passed':
        return '审计通过';
      case 'audit-failed':
        return '审计失败';
      case 'revising':
        return '修订中';
      case 'ready-for-review':
        return '待审核';
      case 'approved':
        return '已批准';
      case 'rejected':
        return '已拒绝';
      case 'published':
        return '已发布';
      case 'imported':
        return '已导入';
      default:
        return status;
    }
  };

  const handleViewChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setIsViewModalOpen(true);
  };

  const handleEditChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setEditContent(chapter.content);
    setIsEditModalOpen(true);
  };

  const handleCreateChapter = async () => {
    if (!id || !newChapter.title) return;
    try {
      const response = await apiService.createChapter(id, {
        title: newChapter.title,
        content: newChapter.content,
        parentChapterId: newChapter.parentChapterId || undefined
      });
      if (response.success) {
        setIsCreateModalOpen(false);
        setNewChapter({ title: '', content: '', parentChapterId: '' });
        loadChapters();
      } else {
        alert(response.error || '创建章节失败');
      }
    } catch (error) {
      alert('网络错误，请稍后重试');
    }
  };

  const handleSaveEdit = async () => {
    if (!id || !selectedChapter) return;
    try {
      const response = await apiService.updateChapter(id, selectedChapter.id, {
        content: editContent
      });
      if (response.success) {
        setIsEditModalOpen(false);
        setSelectedChapter(null);
        setEditContent('');
        loadChapters();
      } else {
        alert(response.error || '更新章节失败');
      }
    } catch (error) {
      alert('网络错误，请稍后重试');
    }
  };

  const handleAuditChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setIsAuditModalOpen(true);
  };

  const handleReviseChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setIsReviseModalOpen(true);
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!id) return;
    if (window.confirm('确定要删除这章吗？')) {
      try {
        const response = await apiService.deleteChapter(id, chapterId);
        if (response.success) {
          loadChapters();
        } else {
          alert(response.error || '删除章节失败');
        }
      } catch (error) {
        alert('网络错误，请稍后重试');
      }
    }
  };

  const handleMoveChapter = async (chapterId: string, direction: 'up' | 'down') => {
    if (!id) return;
    try {
      // 获取当前章节的索引
      const chapterIndex = chapters.findIndex(ch => ch.id === chapterId);
      if (chapterIndex === -1) return;

      // 确定目标索引
      const targetIndex = direction === 'up' ? chapterIndex - 1 : chapterIndex + 1;
      if (targetIndex < 0 || targetIndex >= chapters.length) return;

      // 创建新的排序顺序
      const newOrder = [...chapters];
      [newOrder[chapterIndex], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[chapterIndex]];

      // 准备排序数据
      const orderData = newOrder.map((ch, idx) => ({
        id: ch.id,
        order: idx
      }));

      // 调用API进行排序
      const response = await apiService.reorderChapters(id, orderData);
      if (response.success) {
        loadChapters();
      } else {
        alert(response.error || '排序章节失败');
      }
    } catch (error) {
      alert('网络错误，请稍后重试');
    }
  };

  const handleRenameChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setRenameTitle(chapter.title);
    setIsRenameModalOpen(true);
  };

  const handleSaveRename = async () => {
    if (!id || !selectedChapter) return;
    try {
      const response = await apiService.updateChapter(id, selectedChapter.id, {
        title: renameTitle
      });
      if (response.success) {
        setIsRenameModalOpen(false);
        setSelectedChapter(null);
        setRenameTitle('');
        loadChapters();
      } else {
        alert(response.error || '重命名章节失败');
      }
    } catch (error) {
      alert('网络错误，请稍后重试');
    }
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  const isExpanded = (chapterId: string) => {
    return expandedChapters.has(chapterId);
  };

  const getChildChapters = (parentId: string) => {
    return chapters.filter(chapter => chapter.parentChapterId === parentId);
  };

  const hasChildren = (chapterId: string) => {
    return chapters.some(chapter => chapter.parentChapterId === chapterId);
  };

  const filteredChapters = chapters
    .filter(chapter => 
      chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === 'all' || chapter.status === filterStatus)
    )
    .sort((a, b) => {
      let aValue = a[sortBy as keyof Chapter];
      let bValue = b[sortBy as keyof Chapter];
      
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">章节管理</h1>
          <p className="text-sm text-gray-500">书籍: {bookTitle}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link to={`/books/${id}/state`} className="btn btn-secondary">
            <Book className="mr-2 h-4 w-4" />
            查看状态
          </Link>
          <Button
            variant="secondary"
            onClick={syncChapters}
            disabled={isSyncing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? '同步中...' : '同步'}
          </Button>
          {lastSyncTime && (
            <span className="text-xs text-gray-500 ml-2">
              最后同步: {lastSyncTime}
            </span>
          )}
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            新建章节
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="搜索章节..."
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
            <option value="drafted">已草稿</option>
            <option value="auditing">审计中</option>
            <option value="audit-passed">审计通过</option>
            <option value="audit-failed">审计失败</option>
            <option value="revising">修订中</option>
            <option value="ready-for-review">待审核</option>
            <option value="approved">已批准</option>
            <option value="rejected">已拒绝</option>
            <option value="published">已发布</option>
          </Select>
          <div className="flex items-center space-x-2">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="number">章节号</option>
              <option value="title">标题</option>
              <option value="wordCount">字数</option>
              <option value="updatedAt">更新时间</option>
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

      {/* Chapters Table */}
      <Card className="overflow-x-auto">
        <div className="min-w-[720px]">
          {loading ? (
            <div className="px-6 py-12 text-center">
              <div className="inline-block animate-spin h-8 w-8 border-4 border-gray-200 border-t-primary rounded-full"></div>
              <p className="mt-2 text-gray-600">加载中...</p>
            </div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      章节
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      标题
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      字数
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      更新时间
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredChapters
                    .filter(chapter => !chapter.parentChapterId) // 只显示顶级章节
                    .map((chapter) => (
                      <Fragment key={chapter.id}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">{chapter.number}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {hasChildren(chapter.id) && (
                                <button
                                  onClick={() => toggleChapter(chapter.id)}
                                  className="mr-2 text-gray-500 hover:text-gray-700"
                                  title={isExpanded(chapter.id) ? "折叠" : "展开"}
                                >
                                  {isExpanded(chapter.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </button>
                              )}
                              {!hasChildren(chapter.id) && <div className="w-5 mr-2" />}
                              <span className="text-sm text-gray-900">{chapter.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${statusBadgeClass(chapter.status)}`}>
                              {statusLabel(chapter.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{chapter.wordCount.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{chapter.updatedAt}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex flex-col items-end space-y-1">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleViewChapter(chapter)}
                                  className="text-primary hover:text-primary/80"
                                  title="查看"
                                >
                                  <FileText className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleEditChapter(chapter)}
                                  className="text-secondary hover:text-secondary/80"
                                  title="编辑内容"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleRenameChapter(chapter)}
                                  className="text-info hover:text-info/80"
                                  title="重命名"
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleAuditChapter(chapter)}
                                  className="text-warning hover:text-warning/80"
                                  title="审计"
                                >
                                  <Activity className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleReviseChapter(chapter)}
                                  className="text-blue-500 hover:text-blue-600"
                                  title="修订"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteChapter(chapter.id)}
                                  className="text-danger hover:text-danger/80"
                                  title="删除"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="flex space-x-1 mt-1">
                                <button
                                  onClick={() => handleMoveChapter(chapter.id, 'up')}
                                  className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                  title="上移"
                                  disabled={filteredChapters.filter(ch => !ch.parentChapterId).findIndex(ch => ch.id === chapter.id) === 0}
                                >
                                  <ArrowUp className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => handleMoveChapter(chapter.id, 'down')}
                                  className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                  title="下移"
                                  disabled={filteredChapters.filter(ch => !ch.parentChapterId).findIndex(ch => ch.id === chapter.id) === filteredChapters.filter(ch => !ch.parentChapterId).length - 1}
                                >
                                  <ArrowDown className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                        {/* 显示子章节 */}
                        {isExpanded(chapter.id) && getChildChapters(chapter.id).map((childChapter) => (
                          <tr key={childChapter.id} className="hover:bg-gray-50">
                            <td className="px-6 py-3 whitespace-nowrap pl-12">
                              <span className="text-sm text-gray-600">{childChapter.number}</span>
                            </td>
                            <td className="px-6 py-3 pl-16">
                              <span className="text-sm text-gray-600">{childChapter.title}</span>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${statusBadgeClass(childChapter.status)}`}>
                                {statusLabel(childChapter.status)}
                              </span>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap">
                              <span className="text-sm text-gray-600">{childChapter.wordCount.toLocaleString()}</span>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap">
                              <span className="text-sm text-gray-600">{childChapter.updatedAt}</span>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handleViewChapter(childChapter)}
                                  className="text-primary hover:text-primary/80"
                                  title="查看"
                                >
                                  <FileText className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleEditChapter(childChapter)}
                                  className="text-secondary hover:text-secondary/80"
                                  title="编辑内容"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleRenameChapter(childChapter)}
                                  className="text-info hover:text-info/80"
                                  title="重命名"
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteChapter(childChapter.id)}
                                  className="text-danger hover:text-danger/80"
                                  title="删除"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                </tbody>
              </table>
              {filteredChapters.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-500">未找到章节</p>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* View Chapter Modal */}
      {isViewModalOpen && selectedChapter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">第{selectedChapter.number}章: {selectedChapter.title}</h2>
              <button
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
                onClick={() => setIsViewModalOpen(false)}
                title="关闭"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3 py-3 border-b border-gray-200">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadgeClass(selectedChapter.status)}`}>
                  {statusLabel(selectedChapter.status)}
                </span>
                <span className="text-sm text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  更新时间: {selectedChapter.updatedAt}
                </span>
                <span className="text-sm text-gray-500 flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  {selectedChapter.wordCount.toLocaleString()}字
                </span>
              </div>
              <div className="prose max-w-none prose-lg">
                {selectedChapter.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed">{paragraph || <br />}</p>
                ))}
              </div>
              {selectedChapter.auditIssues.length > 0 && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <h3 className="text-sm font-medium text-red-700 mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    审计问题
                  </h3>
                  <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                    {selectedChapter.auditIssues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Chapter Modal */}
      {isEditModalOpen && selectedChapter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">编辑第{selectedChapter.number}章: {selectedChapter.title}</h2>
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setIsEditModalOpen(false)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <Textarea
                label="内容"
                className="min-h-[300px]"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <div className="mt-6 flex justify-end space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  取消
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveEdit}
                >
                  保存
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit Chapter Modal */}
      {isAuditModalOpen && selectedChapter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">审计第{selectedChapter.number}章: {selectedChapter.title}</h2>
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setIsAuditModalOpen(false)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="text-sm font-medium text-gray-900 mb-2">审计结果</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    <span className="text-sm text-gray-900">角色一致性: 通过</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    <span className="text-sm text-gray-900">情节连续性: 通过</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    <span className="text-sm text-gray-900">世界观构建: 通过</span>
                  </div>
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-warning mr-2" />
                    <span className="text-sm text-gray-900">节奏: 警告 - 部分章节可能过于缓慢</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => setIsAuditModalOpen(false)}
                >
                  关闭
                </Button>
                <Button
                  variant="primary"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  修订
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Chapter Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">新建章节</h2>
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setIsCreateModalOpen(false)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <Input
                label="章节标题"
                type="text"
                value={newChapter.title}
                onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                placeholder="输入章节标题..."
              />
              <Select
                label="父章节"
                value={newChapter.parentChapterId}
                onChange={(e) => setNewChapter({ ...newChapter, parentChapterId: e.target.value })}
              >
                <option value="">顶级章节</option>
                {chapters
                  .filter(chapter => !chapter.parentChapterId)
                  .map(chapter => (
                    <option key={chapter.id} value={chapter.id}>
                      第{chapter.number}章: {chapter.title}
                    </option>
                  ))}
              </Select>
              <Textarea
                label="章节内容"
                className="min-h-[300px]"
                value={newChapter.content}
                onChange={(e) => setNewChapter({ ...newChapter, content: e.target.value })}
                placeholder="输入章节内容..."
              />
              <div className="mt-6 flex justify-end space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  取消
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCreateChapter}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  创建章节
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rename Chapter Modal */}
      {isRenameModalOpen && selectedChapter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">重命名章节</h2>
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setIsRenameModalOpen(false)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <Input
                label="章节标题"
                type="text"
                value={renameTitle}
                onChange={(e) => setRenameTitle(e.target.value)}
                placeholder="输入新的章节标题..."
              />
              <div className="mt-6 flex justify-end space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => setIsRenameModalOpen(false)}
                >
                  取消
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveRename}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  保存
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revise Chapter Modal */}
      {isReviseModalOpen && selectedChapter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">修订第{selectedChapter.number}章: {selectedChapter.title}</h2>
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setIsReviseModalOpen(false)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <Textarea
                label="修订说明"
                className="min-h-[100px]"
                placeholder="输入修订说明..."
              />
              <Textarea
                label="修订内容"
                className="min-h-[300px]"
                value={selectedChapter.content}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <div className="mt-6 flex justify-end space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => setIsReviseModalOpen(false)}
                >
                  取消
                </Button>
                <Button
                  variant="primary"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  保存修订
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chapters;