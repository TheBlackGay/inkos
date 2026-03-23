import React, { useState } from 'react';
import { Server, Play, RefreshCw, Activity, AlertTriangle, CheckCircle, X } from 'lucide-react';

interface DaemonStatus {
  isRunning: boolean;
  uptime: string;
  lastRun: string;
  nextRun: string;
  activeBooks: number;
  completedChapters: number;
  errors: string[];
}

const Daemon: React.FC = () => {
  const [daemonStatus, setDaemonStatus] = useState<DaemonStatus>({
    isRunning: true,
    uptime: '2d 14h 30m',
    lastRun: '2026-03-23 10:30:00',
    nextRun: '2026-03-23 10:45:00',
    activeBooks: 3,
    completedChapters: 5,
    errors: []
  });

  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);

  const handleStartDaemon = () => {
    setIsStarting(true);
    // Simulate starting daemon
    setTimeout(() => {
      setDaemonStatus({
        ...daemonStatus,
        isRunning: true,
        uptime: '0s',
        lastRun: new Date().toLocaleString(),
        nextRun: new Date(Date.now() + 15 * 60000).toLocaleString(),
        errors: []
      });
      setIsStarting(false);
    }, 2000);
  };

  const handleStopDaemon = () => {
    setIsStopping(true);
    // Simulate stopping daemon
    setTimeout(() => {
      setDaemonStatus({
        ...daemonStatus,
        isRunning: false,
        uptime: '0s',
        lastRun: new Date().toLocaleString(),
        nextRun: 'N/A',
        errors: []
      });
      setIsStopping(false);
    }, 2000);
  };

  const handleRestartDaemon = () => {
    setIsStopping(true);
    // Simulate restarting daemon
    setTimeout(() => {
      setDaemonStatus({
        ...daemonStatus,
        isRunning: true,
        uptime: '0s',
        lastRun: new Date().toLocaleString(),
        nextRun: new Date(Date.now() + 15 * 60000).toLocaleString(),
        errors: []
      });
      setIsStopping(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Daemon Management</h1>
        <div className="flex space-x-2">
          {daemonStatus.isRunning ? (
            <>
              <button 
                className="btn btn-secondary" 
                onClick={handleRestartDaemon}
                disabled={isStopping}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {isStopping ? 'Restarting...' : 'Restart'}
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleStopDaemon}
                disabled={isStopping}
              >
                <X className="mr-2 h-4 w-4" />
                {isStopping ? 'Stopping...' : 'Stop'}
              </button>
            </>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={handleStartDaemon}
              disabled={isStarting}
            >
              <Play className="mr-2 h-4 w-4" />
              {isStarting ? 'Starting...' : 'Start'}
            </button>
          )}
        </div>
      </div>

      {/* Daemon Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Status</h2>
            <div className={`p-2 rounded-full ${daemonStatus.isRunning ? 'bg-success/10' : 'bg-danger/10'}`}>
              <Server className={`h-6 w-6 ${daemonStatus.isRunning ? 'text-success' : 'text-danger'}`} />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Status</span>
              <span className={`text-sm font-medium ${daemonStatus.isRunning ? 'text-success' : 'text-danger'}`}>
                {daemonStatus.isRunning ? 'Running' : 'Stopped'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Uptime</span>
              <span className="text-sm font-medium text-gray-900">{daemonStatus.uptime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Last Run</span>
              <span className="text-sm font-medium text-gray-900">{daemonStatus.lastRun}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Next Run</span>
              <span className="text-sm font-medium text-gray-900">{daemonStatus.nextRun}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Active Books</span>
              <span className="text-sm font-medium text-gray-900">{daemonStatus.activeBooks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Completed Chapters</span>
              <span className="text-sm font-medium text-gray-900">{daemonStatus.completedChapters}</span>
            </div>
          </div>
        </div>

        <div className="card lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="p-2 rounded-full bg-success/10">
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Chapter 32 of "吞天魔帝" drafted</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="p-2 rounded-full bg-primary/10">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Daemon started</p>
                <p className="text-sm text-gray-500">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="p-2 rounded-full bg-success/10">
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Chapter 31 of "吞天魔帝" approved</p>
                <p className="text-sm text-gray-500">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="p-2 rounded-full bg-warning/10">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Chapter 28 of "都市修仙" failed audit</p>
                <p className="text-sm text-gray-500">2 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daemon Logs */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Daemon Logs</h2>
        <div className="bg-gray-50 p-4 rounded-md font-mono text-sm overflow-x-auto">
          <pre className="text-gray-800">
{`[2026-03-23 10:30:00] INFO: Daemon running
[2026-03-23 10:30:05] INFO: Processing book "吞天魔帝"
[2026-03-23 10:35:20] INFO: Chapter 32 drafted successfully
[2026-03-23 10:35:25] INFO: Auditing chapter 32
[2026-03-23 10:38:40] INFO: Audit passed
[2026-03-23 10:38:45] INFO: Moving to next book
[2026-03-23 10:38:50] INFO: Processing book "都市修仙"
[2026-03-23 10:40:15] INFO: Chapter 29 drafted successfully
[2026-03-23 10:42:30] INFO: Auditing chapter 29
[2026-03-23 10:45:10] INFO: Audit passed
[2026-03-23 10:45:15] INFO: Next run scheduled for 2026-03-23 11:00:00`}
          </pre>
        </div>
      </div>

      {/* Daemon Configuration */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Radar Cron</label>
              <input
                type="text"
                className="input"
                defaultValue="0 */6 * * *"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Write Cron</label>
              <input
                type="text"
                className="input"
                defaultValue="*/15 * * * *"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Concurrent Books</label>
              <input
                type="number"
                className="input"
                defaultValue="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chapters Per Cycle</label>
              <input
                type="number"
                className="input"
                defaultValue="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Chapters Per Day</label>
              <input
                type="number"
                className="input"
                defaultValue="50"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button className="btn btn-primary">
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Daemon;