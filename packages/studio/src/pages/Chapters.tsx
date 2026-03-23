import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Book, FileText, Edit, Trash2, Search, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, Clock, Activity, RefreshCw } from 'lucide-react';

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
}

const Chapters: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('number');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isReviseModalOpen, setIsReviseModalOpen] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [bookTitle] = useState('吞天魔帝');

  // Mock data for chapters
  useEffect(() => {
    // Simulate fetching chapters from API
    const mockChapters: Chapter[] = [
      {
        id: '1',
        number: 1,
        title: '第一章 缘起',
        status: 'approved',
        wordCount: 14500,
        createdAt: '2026-01-15',
        updatedAt: '2026-01-15',
        auditIssues: [],
        content: '这是第一章的内容...'
      },
      {
        id: '2',
        number: 2,
        title: '第二章 觉醒',
        status: 'approved',
        wordCount: 14200,
        createdAt: '2026-01-16',
        updatedAt: '2026-01-16',
        auditIssues: [],
        content: '这是第二章的内容...'
      },
      {
        id: '3',
        number: 3,
        title: '第三章 修炼',
        status: 'approved',
        wordCount: 14800,
        createdAt: '2026-01-17',
        updatedAt: '2026-01-17',
        auditIssues: [],
        content: '这是第三章的内容...'
      },
      {
        id: '31',
        number: 31,
        title: '第三十一章 突破',
        status: 'approved',
        wordCount: 15000,
        createdAt: '2026-03-20',
        updatedAt: '2026-03-20',
        auditIssues: [],
        content: '这是第三十一章的内容...'
      },
      {
        id: '32',
        number: 32,
        title: '第三十二章 新的开始',
        status: 'drafted',
        wordCount: 14000,
        createdAt: '2026-03-23',
        updatedAt: '2026-03-23',
        auditIssues: [],
        content: '这是第三十二章的内容...'
      }
    ];
    setChapters(mockChapters);
  }, [id]);

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

  const handleSaveEdit = () => {
    if (selectedChapter) {
      setChapters(chapters.map(chapter => 
        chapter.id === selectedChapter.id 
          ? { ...chapter, content: editContent, updatedAt: new Date().toISOString().split('T')[0] }
          : chapter
      ));
      setIsEditModalOpen(false);
      setSelectedChapter(null);
      setEditContent('');
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

  const handleDeleteChapter = (id: string) => {
    if (window.confirm('确定要删除这章吗？')) {
      setChapters(chapters.filter(chapter => chapter.id !== id));
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Chapters</h1>
          <p className="text-sm text-gray-500">Book: {bookTitle}</p>
        </div>
        <div className="flex space-x-2">
          <Link to={`/books/${id}/state`} className="btn btn-secondary">
            <Book className="mr-2 h-4 w-4" />
            View State
          </Link>
          <button className="btn btn-primary">
            <FileText className="mr-2 h-4 w-4" />
            Write Next Chapter
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search chapters..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select
            className="select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="drafted">Drafted</option>
            <option value="auditing">Auditing</option>
            <option value="audit-passed">Audit Passed</option>
            <option value="audit-failed">Audit Failed</option>
            <option value="revising">Revising</option>
            <option value="ready-for-review">Ready for Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="published">Published</option>
          </select>
          <div className="flex items-center space-x-2">
            <select
              className="select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="number">Chapter Number</option>
              <option value="title">Title</option>
              <option value="wordCount">Word Count</option>
              <option value="updatedAt">Updated At</option>
            </select>
            <button
              className="btn btn-secondary p-2"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Chapters Table */}
      <div className="card overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chapter
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Word Count
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredChapters.map((chapter) => (
              <tr key={chapter.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">{chapter.number}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">{chapter.title}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={statusBadgeClass(chapter.status)}>
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
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleViewChapter(chapter)}
                      className="text-primary hover:text-primary/80"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEditChapter(chapter)}
                      className="text-secondary hover:text-secondary/80"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleAuditChapter(chapter)}
                      className="text-warning hover:text-warning/80"
                    >
                      <Activity className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleReviseChapter(chapter)}
                      className="text-info hover:text-info/80"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteChapter(chapter.id)}
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
        {filteredChapters.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No chapters found</p>
          </div>
        )}
      </div>

      {/* View Chapter Modal */}
      {isViewModalOpen && selectedChapter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Chapter {selectedChapter.number}: {selectedChapter.title}</h2>
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setIsViewModalOpen(false)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className={statusBadgeClass(selectedChapter.status)}>
                  {statusLabel(selectedChapter.status)}
                </span>
                <span className="text-sm text-gray-500">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Updated: {selectedChapter.updatedAt}
                </span>
                <span className="text-sm text-gray-500">
                  <FileText className="inline h-4 w-4 mr-1" />
                  {selectedChapter.wordCount.toLocaleString()} words
                </span>
              </div>
              <div className="prose max-w-none">
                <p>{selectedChapter.content}</p>
              </div>
              {selectedChapter.auditIssues.length > 0 && (
                <div className="mt-4 p-4 bg-danger/10 rounded-md">
                  <h3 className="text-sm font-medium text-danger mb-2">Audit Issues</h3>
                  <ul className="list-disc list-inside text-sm text-danger space-y-1">
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
              <h2 className="text-lg font-semibold text-gray-900">Edit Chapter {selectedChapter.number}: {selectedChapter.title}</h2>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  className="input min-h-[300px]"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveEdit}
                >
                  Save
                </button>
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
              <h2 className="text-lg font-semibold text-gray-900">Audit Chapter {selectedChapter.number}: {selectedChapter.title}</h2>
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
                <h3 className="text-sm font-medium text-gray-900 mb-2">Audit Results</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    <span className="text-sm text-gray-900">Character consistency: Pass</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    <span className="text-sm text-gray-900">Plot continuity: Pass</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    <span className="text-sm text-gray-900">World building: Pass</span>
                  </div>
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-warning mr-2" />
                    <span className="text-sm text-gray-900">Pace: Warning - Some sections may be too slow</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsAuditModalOpen(false)}
                >
                  Close
                </button>
                <button className="btn btn-primary">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Revise
                </button>
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
              <h2 className="text-lg font-semibold text-gray-900">Revise Chapter {selectedChapter.number}: {selectedChapter.title}</h2>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Revision Notes</label>
                <textarea
                  className="input min-h-[100px]"
                  placeholder="Enter revision notes..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Revised Content</label>
                <textarea
                  className="input min-h-[300px]"
                  value={selectedChapter.content}
                  onChange={(e) => setEditContent(e.target.value)}
                />
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsReviseModalOpen(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Save Revision
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chapters;