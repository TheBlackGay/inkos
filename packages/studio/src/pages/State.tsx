import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Book, FileText, Edit, ChevronDown, ChevronUp } from 'lucide-react';

interface StateFile {
  id: string;
  name: string;
  title: string;
  content: string;
  updatedAt: string;
}

const State: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [stateFiles, setStateFiles] = useState<StateFile[]>([]);
  const [expandedFile, setExpandedFile] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<StateFile | null>(null);
  const [editContent, setEditContent] = useState('');
  const [bookTitle] = useState('吞天魔帝');

  // Mock data for state files
  useEffect(() => {
    // Simulate fetching state files from API
    const mockStateFiles: StateFile[] = [
      {
        id: '1',
        name: 'current_state.md',
        title: '当前状态',
        content: '# 当前状态\n\n## 第31章\n\n### 地点\n Azure山脉\n\n### 主角\n- 状态: 正在进阶到元婴期第9层\n- 当前目标: 击败Azure龙\n- 限制: 灵力不足\n\n### 敌人\n- Azure龙: 强大的野兽，有领地意识\n- 张长老: 嫉妒主角\n\n### 已知真相\n- Azure龙守护着一件灵物\n- 张长老与魔门勾结\n\n### 当前冲突\n主角 vs Azure龙\n\n### 锚点\n主角想起师傅的教导',
        updatedAt: '2026-03-20'
      },
      {
        id: '2',
        name: 'particle_ledger.md',
        title: '粒子 ledger',
        content: '# 粒子 ledger\n\n## 硬上限\n1000\n\n## 当前总数\n850\n\n## 条目\n- 第30章: +50 来自灵草\n- 第31章: -100 激活防御阵',
        updatedAt: '2026-03-20'
      },
      {
        id: '3',
        name: 'pending_hooks.md',
        title: '待处理钩子',
        content: '# 待处理钩子\n\n## 开放\n- 钩子1: 神秘的护身符\n- 钩子2: 魔门的计划\n\n## 进行中\n- 钩子3: 张长老的背叛\n\n## 已解决\n- 钩子4: 丢失的灵石',
        updatedAt: '2026-03-20'
      },
      {
        id: '4',
        name: 'chapter_summaries.md',
        title: '章节摘要',
        content: '# 章节摘要\n\n## 第30章\n- 主角找到灵草\n- 张长老表现出背叛迹象\n\n## 第31章\n- 主角与Azure龙战斗\n- 发现魔门参与',
        updatedAt: '2026-03-20'
      },
      {
        id: '5',
        name: 'subplot_board.md',
        title: '副情节板',
        content: '# 副情节板\n\n## A线: 主线故事\n- 状态: 活跃\n\n## B线: 张长老的背叛\n- 状态: 活跃\n\n## C线: 魔门\n- 状态: 活跃',
        updatedAt: '2026-03-20'
      },
      {
        id: '6',
        name: 'emotional_arcs.md',
        title: '情感弧线',
        content: '# 情感弧线\n\n## 主角\n- 第30章: 决心\n- 第31章: 对背叛的愤怒\n\n## 配角\n- 李师姐: 担忧\n- 陈师傅: 骄傲',
        updatedAt: '2026-03-20'
      },
      {
        id: '7',
        name: 'character_matrix.md',
        title: '角色矩阵',
        content: '# 角色矩阵\n\n## 主角 & 张长老\n- 首次见面: 第5章\n- 当前关系: 敌对\n\n## 主角 & 李师姐\n- 首次见面: 第1章\n- 当前关系: 友好',
        updatedAt: '2026-03-20'
      }
    ];
    setStateFiles(mockStateFiles);
  }, [id]);

  const handleToggleExpand = (fileId: string) => {
    setExpandedFile(expandedFile === fileId ? null : fileId);
  };

  const handleEditFile = (file: StateFile) => {
    setSelectedFile(file);
    setEditContent(file.content);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedFile) {
      setStateFiles(stateFiles.map(file => 
        file.id === selectedFile.id 
          ? { ...file, content: editContent, updatedAt: new Date().toISOString().split('T')[0] }
          : file
      ));
      setIsEditModalOpen(false);
      setSelectedFile(null);
      setEditContent('');
    }
  };

  const formatMarkdown = (content: string) => {
    return content
      .replace(/^# (.*$)/gm, '<h1 className="text-xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 className="text-lg font-semibold mb-2">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 className="text-md font-medium mb-1">$1</h3>')
      .replace(/^- (.*$)/gm, '<li className="ml-4 list-disc">$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^([^<].*[^>])$/gm, '<p>$1</p>');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">状态管理</h1>
          <p className="text-sm text-gray-500">书籍: {bookTitle}</p>
        </div>
        <Link to={`/books/${id}/chapters`} className="btn btn-secondary">
          <Book className="mr-2 h-4 w-4" />
          查看章节
        </Link>
      </div>

      {/* State Files */}
      <div className="space-y-4">
        {stateFiles.map((file) => (
          <div key={file.id} className="card">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => handleToggleExpand(file.id)}
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-primary mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">{file.title}</h2>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Updated: {file.updatedAt}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditFile(file);
                  }}
                  className="text-secondary hover:text-secondary/80"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-gray-400 hover:text-gray-500">
                  {expandedFile === file.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>
            {expandedFile === file.id && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formatMarkdown(file.content) }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit State File Modal */}
      {isEditModalOpen && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">编辑 {selectedFile.title}</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
                <textarea
                  className="input min-h-[400px] font-mono"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  取消
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveEdit}
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default State;