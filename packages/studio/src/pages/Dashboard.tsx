import React from 'react';
import { Book, Activity, Server, Settings, TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Card } from '../components/ui';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  // Mock data for charts
  const wordCountData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Word Count',
        data: [12000, 15000, 18000, 14000, 20000, 22000],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chapterData = {
    labels: ['Drafting', 'Auditing', 'Revising', 'Ready', 'Approved', 'Published'],
    datasets: [
      {
        label: 'Chapters',
        data: [5, 3, 2, 4, 10, 15],
        backgroundColor: [
          '#f59e0b',
          '#3b82f6',
          '#64748b',
          '#10b981',
          '#8b5cf6',
          '#14b8a6',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
        <div className="flex space-x-2">
          <button className="btn btn-primary">
            <TrendingUp className="mr-2 h-4 w-4" />
            生成报告
          </button>
          <button className="btn btn-secondary">
            <Settings className="mr-2 h-4 w-4" />
            设置
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">总书籍数</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
            <div className="p-3 rounded-full bg-primary/10">
              <Book className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm font-medium text-success flex items-center">
              <TrendingUp className="mr-1 h-4 w-4" />
              12%
            </span>
            <span className="text-sm text-gray-500 ml-2">较上月</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">总章节数</p>
              <p className="text-2xl font-bold text-gray-900">39</p>
            </div>
            <div className="p-3 rounded-full bg-success/10">
              <Activity className="h-6 w-6 text-success" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm font-medium text-success flex items-center">
              <TrendingUp className="mr-1 h-4 w-4" />
              8%
            </span>
            <span className="text-sm text-gray-500 ml-2">较上月</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">总字数</p>
              <p className="text-2xl font-bold text-gray-900">452,191</p>
            </div>
            <div className="p-3 rounded-full bg-warning/10">
              <TrendingUp className="h-6 w-6 text-warning" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm font-medium text-success flex items-center">
              <TrendingUp className="mr-1 h-4 w-4" />
              15%
            </span>
            <span className="text-sm text-gray-500 ml-2">较上月</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">守护进程状态</p>
              <p className="text-2xl font-bold text-success">运行中</p>
            </div>
            <div className="p-3 rounded-full bg-success/10">
              <Server className="h-6 w-6 text-success" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm font-medium text-gray-500 flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              运行时间: 2天14小时
            </span>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">字数趋势</h2>
          <div className="h-80">
            <Line data={wordCountData} options={chartOptions} />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">章节状态</h2>
          <div className="h-80">
            <Bar data={chapterData} options={chartOptions} />
          </div>
        </Card>
      </div>

      {/* 最近活动 */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">最近活动</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="p-2 rounded-full bg-success/10">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">《吞天魔帝》第31章已批准</p>
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
              <p className="text-sm font-medium text-gray-900">《吞天魔帝》第32章已草稿</p>
              <p className="text-sm text-gray-500">4小时前</p>
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
              <p className="text-sm text-gray-500">6小时前</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="p-2 rounded-full bg-primary/10">
                <Book className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">新建书籍《星际穿越》</p>
              <p className="text-sm text-gray-500">1天前</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;