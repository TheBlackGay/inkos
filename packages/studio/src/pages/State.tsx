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
        title: 'Current State',
        content: '# Current State\n\n## Chapter 31\n\n### Location\nThe Azure Mountains\n\n### Protagonist\n- Status: Advancing to the 9th layer of the Nascent Soul realm\n- Current Goal: Defeat the Azure Dragon\n- Constraints: Low on spiritual energy\n\n### Enemies\n- Azure Dragon: Powerful beast, territorial\n- Elder Zhang: Jealous of protagonist\n\n### Known Truths\n- The Azure Dragon guards a spiritual artifact\n- Elder Zhang is working with the demonic sect\n\n### Current Conflict\nProtagonist vs Azure Dragon\n\n### Anchor\nProtagonist remembers his master\'s teachings',
        updatedAt: '2026-03-20'
      },
      {
        id: '2',
        name: 'particle_ledger.md',
        title: 'Particle Ledger',
        content: '# Particle Ledger\n\n## Hard Cap\n1000\n\n## Current Total\n850\n\n## Entries\n- Chapter 30: +50 from spiritual herbs\n- Chapter 31: -100 to activate defensive array',
        updatedAt: '2026-03-20'
      },
      {
        id: '3',
        name: 'pending_hooks.md',
        title: 'Pending Hooks',
        content: '# Pending Hooks\n\n## Open\n- Hook 1: The mysterious amulet\n- Hook 2: The demonic sect\'s plan\n\n## Progressing\n- Hook 3: Elder Zhang\'s betrayal\n\n## Resolved\n- Hook 4: The missing spiritual stone',
        updatedAt: '2026-03-20'
      },
      {
        id: '4',
        name: 'chapter_summaries.md',
        title: 'Chapter Summaries',
        content: '# Chapter Summaries\n\n## Chapter 30\n- Protagonist finds spiritual herbs\n- Elder Zhang shows signs of betrayal\n\n## Chapter 31\n- Protagonist battles Azure Dragon\n- Discovers demonic sect involvement',
        updatedAt: '2026-03-20'
      },
      {
        id: '5',
        name: 'subplot_board.md',
        title: 'Subplot Board',
        content: '# Subplot Board\n\n## A Line: Main Story\n- Status: Active\n\n## B Line: Elder Zhang\'s Betrayal\n- Status: Active\n\n## C Line: Demonic Sect\n- Status: Active',
        updatedAt: '2026-03-20'
      },
      {
        id: '6',
        name: 'emotional_arcs.md',
        title: 'Emotional Arcs',
        content: '# Emotional Arcs\n\n## Protagonist\n- Chapter 30: Determination\n- Chapter 31: Anger at betrayal\n\n## Supporting Characters\n- Senior Sister Li: Worry\n- Master Chen: Pride',
        updatedAt: '2026-03-20'
      },
      {
        id: '7',
        name: 'character_matrix.md',
        title: 'Character Matrix',
        content: '# Character Matrix\n\n## Protagonist & Elder Zhang\n- First meeting: Chapter 5\n- Current relationship: Hostile\n\n## Protagonist & Senior Sister Li\n- First meeting: Chapter 1\n- Current relationship: Friendly',
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
          <h1 className="text-2xl font-bold text-gray-900">State Management</h1>
          <p className="text-sm text-gray-500">Book: {bookTitle}</p>
        </div>
        <Link to={`/books/${id}/chapters`} className="btn btn-secondary">
          <Book className="mr-2 h-4 w-4" />
          View Chapters
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
              <h2 className="text-lg font-semibold text-gray-900">Edit {selectedFile.title}</h2>
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
    </div>
  );
};

export default State;