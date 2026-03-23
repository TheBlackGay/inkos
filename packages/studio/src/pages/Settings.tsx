import React, { useState } from 'react';
import { Save, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface LLMConfig {
  provider: string;
  baseUrl: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

interface NotifyChannel {
  id: string;
  type: string;
  name: string;
  config: any;
}

const Settings: React.FC = () => {
  const [llmConfig, setLlmConfig] = useState<LLMConfig>({
    provider: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    apiKey: 'sk-...',
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 8192
  });

  const [notifyChannels, setNotifyChannels] = useState<NotifyChannel[]>([
    {
      id: '1',
      type: 'telegram',
      name: 'Telegram',
      config: {
        botToken: '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11',
        chatId: '123456789'
      }
    },
    {
      id: '2',
      type: 'webhook',
      name: 'Webhook',
      config: {
        url: 'https://example.com/webhook',
        secret: 'secret_key',
        events: ['draft', 'audit', 'revise', 'approve']
      }
    }
  ]);

  const [expandedSection, setExpandedSection] = useState<string | null>('llm');
  const [isAddingChannel, setIsAddingChannel] = useState(false);
  const [newChannel, setNewChannel] = useState({
    type: 'telegram',
    name: '',
    config: {}
  });

  const handleSaveLLMConfig = () => {
    // Save LLM configuration
    console.log('Saving LLM config:', llmConfig);
  };

  const handleSaveNotifyConfig = () => {
    // Save notification configuration
    console.log('Saving notify config:', notifyChannels);
  };

  const handleDeleteChannel = (id: string) => {
    setNotifyChannels(notifyChannels.filter(channel => channel.id !== id));
  };

  const handleAddChannel = () => {
    if (newChannel.name) {
      setNotifyChannels([...notifyChannels, {
        id: String(notifyChannels.length + 1),
        ...newChannel
      }]);
      setIsAddingChannel(false);
      setNewChannel({ type: 'telegram', name: '', config: {} });
    }
  };

  const handleToggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* LLM Configuration */}
      <div className="card">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => handleToggleSection('llm')}
        >
          <h2 className="text-lg font-semibold text-gray-900">LLM Configuration</h2>
          <button className="text-gray-400 hover:text-gray-500">
            {expandedSection === 'llm' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        {expandedSection === 'llm' && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                <select
                  className="select"
                  value={llmConfig.provider}
                  onChange={(e) => setLlmConfig({ ...llmConfig, provider: e.target.value })}
                >
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <input
                  type="text"
                  className="input"
                  value={llmConfig.model}
                  onChange={(e) => setLlmConfig({ ...llmConfig, model: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base URL</label>
              <input
                type="text"
                className="input"
                value={llmConfig.baseUrl}
                onChange={(e) => setLlmConfig({ ...llmConfig, baseUrl: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
              <input
                type="password"
                className="input"
                value={llmConfig.apiKey}
                onChange={(e) => setLlmConfig({ ...llmConfig, apiKey: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  className="input"
                  value={llmConfig.temperature}
                  onChange={(e) => setLlmConfig({ ...llmConfig, temperature: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
                <input
                  type="number"
                  className="input"
                  value={llmConfig.maxTokens}
                  onChange={(e) => setLlmConfig({ ...llmConfig, maxTokens: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button 
                className="btn btn-primary"
                onClick={handleSaveLLMConfig}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notification Configuration */}
      <div className="card">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => handleToggleSection('notify')}
        >
          <h2 className="text-lg font-semibold text-gray-900">Notification Configuration</h2>
          <button className="text-gray-400 hover:text-gray-500">
            {expandedSection === 'notify' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        {expandedSection === 'notify' && (
          <div className="mt-4 space-y-4">
            <div className="space-y-4">
              {notifyChannels.map((channel) => (
                <div key={channel.id} className="p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-md font-medium text-gray-900">{channel.name}</h3>
                      <p className="text-sm text-gray-500">{channel.type}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteChannel(channel.id)}
                      className="text-danger hover:text-danger/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {channel.type === 'telegram' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bot Token</label>
                            <input
                              type="text"
                              className="input"
                              defaultValue={channel.config.botToken}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Chat ID</label>
                            <input
                              type="text"
                              className="input"
                              defaultValue={channel.config.chatId}
                            />
                          </div>
                        </div>
                      </>
                    )}
                    {channel.type === 'webhook' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                          <input
                            type="text"
                            className="input"
                            defaultValue={channel.config.url}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Secret</label>
                          <input
                            type="password"
                            className="input"
                            defaultValue={channel.config.secret}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Events</label>
                          <input
                            type="text"
                            className="input"
                            defaultValue={channel.config.events.join(', ')}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {isAddingChannel ? (
              <div className="p-4 border border-dashed border-gray-300 rounded-md">
                <h3 className="text-md font-medium text-gray-900 mb-4">Add New Channel</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        className="select"
                        value={newChannel.type}
                        onChange={(e) => setNewChannel({ ...newChannel, type: e.target.value })}
                      >
                        <option value="telegram">Telegram</option>
                        <option value="wechat-work">WeChat Work</option>
                        <option value="feishu">Feishu</option>
                        <option value="webhook">Webhook</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        className="input"
                        value={newChannel.name}
                        onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
                      />
                    </div>
                  </div>
                  {newChannel.type === 'telegram' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bot Token</label>
                        <input
                          type="text"
                          className="input"
                          onChange={(e) => setNewChannel({ ...newChannel, config: { ...newChannel.config, botToken: e.target.value } })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Chat ID</label>
                        <input
                          type="text"
                          className="input"
                          onChange={(e) => setNewChannel({ ...newChannel, config: { ...newChannel.config, chatId: e.target.value } })}
                        />
                      </div>
                    </div>
                  )}
                  {newChannel.type === 'webhook' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                        <input
                          type="text"
                          className="input"
                          onChange={(e) => setNewChannel({ ...newChannel, config: { ...newChannel.config, url: e.target.value } })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Secret</label>
                        <input
                          type="password"
                          className="input"
                          onChange={(e) => setNewChannel({ ...newChannel, config: { ...newChannel.config, secret: e.target.value } })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Events (comma separated)</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="draft, audit, revise, approve"
                          onChange={(e) => setNewChannel({ ...newChannel, config: { ...newChannel.config, events: e.target.value.split(', ').map(e => e.trim()) } })}
                        />
                      </div>
                    </>
                  )}
                  <div className="flex justify-end space-x-2">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setIsAddingChannel(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleAddChannel}
                    >
                      Add Channel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                className="btn btn-secondary w-full flex items-center justify-center"
                onClick={() => setIsAddingChannel(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Channel
              </button>
            )}
            <div className="flex justify-end">
              <button 
                className="btn btn-primary"
                onClick={handleSaveNotifyConfig}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </button>
            </div>
          </div>
        )}
      </div>

      {/* General Configuration */}
      <div className="card">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => handleToggleSection('general')}
        >
          <h2 className="text-lg font-semibold text-gray-900">General Configuration</h2>
          <button className="text-gray-400 hover:text-gray-500">
            {expandedSection === 'general' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        {expandedSection === 'general' && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                className="select"
              >
                <option value="zh">中文</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
              <input
                type="text"
                className="input"
                defaultValue="InkOS Project"
              />
            </div>
            <div className="flex justify-end">
              <button className="btn btn-primary">
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;