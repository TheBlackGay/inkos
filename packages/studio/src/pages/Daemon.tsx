import React, { useState } from 'react';
import { Server, Play, RefreshCw, Activity, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { Button, Input, Card } from '../components/ui';

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
        <h1 className="text-2xl font-bold text-gray-900">守护进程管理</h1>
        <div className="flex space-x-2">
          {daemonStatus.isRunning ? (
            <>
              <Button 
                variant="secondary" 
                onClick={handleRestartDaemon}
                disabled={isStopping}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {isStopping ? '重启中...' : '重启'}
              </Button>
              <Button 
                variant="danger" 
                onClick={handleStopDaemon}
                disabled={isStopping}
              >
                <X className="mr-2 h-4 w-4" />
                {isStopping ? '停止中...' : '停止'}
              </Button>
            </>
          ) : (
            <Button 
              variant="primary" 
              onClick={handleStartDaemon}
              disabled={isStarting}
            >
              <Play className="mr-2 h-4 w-4" />
              {isStarting ? '启动中...' : '启动'}
            </Button>
          )}
        </div>
      </div>

      {/* Daemon Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">状态</h2>
            <div className={`p-2 rounded-full ${daemonStatus.isRunning ? 'bg-success/10' : 'bg-danger/10'}`}>
              <Server className={`h-6 w-6 ${daemonStatus.isRunning ? 'text-success' : 'text-danger'}`} />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">状态</span>
              <span className={`text-sm font-medium ${daemonStatus.isRunning ? 'text-success' : 'text-danger'}`}>
                {daemonStatus.isRunning ? '运行中' : '已停止'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">运行时间</span>
              <span className="text-sm font-medium text-gray-900">{daemonStatus.uptime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">上次运行</span>
              <span className="text-sm font-medium text-gray-900">{daemonStatus.lastRun}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">下次运行</span>
              <span className="text-sm font-medium text-gray-900">{daemonStatus.nextRun}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">活跃书籍</span>
              <span className="text-sm font-medium text-gray-900">{daemonStatus.activeBooks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">已完成章节</span>
              <span className="text-sm font-medium text-gray-900">{daemonStatus.completedChapters}</span>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">最近活动</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="p-2 rounded-full bg-success/10">
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">《吞天魔帝》第32章已草稿</p>
                <p className="text-sm text-gray-500">2小时前</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="p-2 rounded-full bg-primary/10">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">守护进程已启动</p>
                <p className="text-sm text-gray-500">1天前</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="p-2 rounded-full bg-success/10">
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">《吞天魔帝》第31章已批准</p>
                <p className="text-sm text-gray-500">1天前</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="p-2 rounded-full bg-warning/10">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">《都市修仙》第28章审计失败</p>
                <p className="text-sm text-gray-500">2天前</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Daemon Logs */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">守护进程日志</h2>
        <div className="bg-gray-50 p-4 rounded-md font-mono text-sm overflow-x-auto">
          <pre className="text-gray-800">
{`[2026-03-23 10:30:00] INFO: 守护进程运行中
[2026-03-23 10:30:05] INFO: 处理书籍 "吞天魔帝"
[2026-03-23 10:35:20] INFO: 第32章草稿成功
[2026-03-23 10:35:25] INFO: 审计第32章
[2026-03-23 10:38:40] INFO: 审计通过
[2026-03-23 10:38:45] INFO: 移动到下一本书
[2026-03-23 10:38:50] INFO: 处理书籍 "都市修仙"
[2026-03-23 10:40:15] INFO: 第29章草稿成功
[2026-03-23 10:42:30] INFO: 审计第29章
[2026-03-23 10:45:10] INFO: 审计通过
[2026-03-23 10:45:15] INFO: 下次运行计划于 2026-03-23 11:00:00`}
          </pre>
        </div>
      </Card>

      {/* Daemon Configuration */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">配置</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="雷达 Cron"
                type="text"
                defaultValue="0 */6 * * *"
              />
            </div>
            <div>
              <Input
                label="写作 Cron"
                type="text"
                defaultValue="*/15 * * * *"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                label="最大并发书籍"
                type="number"
                defaultValue="3"
              />
            </div>
            <div>
              <Input
                label="每周期章节数"
                type="number"
                defaultValue="1"
              />
            </div>
            <div>
              <Input
                label="每日最大章节数"
                type="number"
                defaultValue="50"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              variant="primary"
            >
              保存配置
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Daemon;