'use client';

import React, { useState } from 'react';
import {
  Layout,
  Button,
  Card,
  Modal,
  Loading,
  Toast,
  ToastContainer,
  Badge,
  Tooltip,
  DataTable,
  LineChart,
  BarChart,
  PieChart,
  WordCloud,
} from '../index';
import { Download, Plus } from 'lucide-react';

const ComponentExamples: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: any }>>([]);

  // 示例数据
  const tableData = [
    { id: 1, name: '张三', email: 'zhangsan@example.com', role: '管理员', status: 'active' },
    { id: 2, name: '李四', email: 'lisi@example.com', role: '编辑', status: 'active' },
    { id: 3, name: '王五', email: 'wangwu@example.com', role: '用户', status: 'inactive' },
  ];

  const tableColumns = [
    { key: 'name', header: '姓名', sortable: true, filterable: true },
    { key: 'email', header: '邮箱', sortable: true, filterable: true },
    { key: 'role', header: '角色', sortable: true },
    {
      key: 'status',
      header: '状态',
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'success' : 'gray'}>
          {value === 'active' ? '活跃' : '未激活'}
        </Badge>
      ),
    },
  ];

  const lineChartData = {
    xAxis: ['1月', '2月', '3月', '4月', '5月', '6月'],
    series: [
      { name: '销售额', data: [120, 200, 150, 280, 370, 410] },
      { name: '访问量', data: [220, 182, 191, 234, 290, 330] },
    ],
  };

  const barChartData = {
    xAxis: ['产品A', '产品B', '产品C', '产品D', '产品E'],
    series: [
      { name: '2023年', data: [320, 302, 301, 334, 390] },
      { name: '2024年', data: [220, 182, 191, 234, 290] },
    ],
  };

  const pieChartData = [
    { name: '直接访问', value: 335 },
    { name: '邮件营销', value: 310 },
    { name: '联盟广告', value: 234 },
    { name: '视频广告', value: 135 },
    { name: '搜索引擎', value: 1548 },
  ];

  const wordCloudData = [
    { name: 'React', value: 100 },
    { name: 'TypeScript', value: 80 },
    { name: 'Tailwind', value: 70 },
    { name: 'ECharts', value: 60 },
    { name: 'Vite', value: 50 },
    { name: 'Redux', value: 40 },
  ];

  const addToast = (message: string, type: any) => {
    const id = Date.now().toString();
    setToasts([...toasts, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(toasts.filter(toast => toast.id !== id));
  };

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-gray-900">组件库使用示例</h1>

        {/* 按钮示例 */}
        <Card title="按钮组件" subtitle="不同样式和尺寸的按钮">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="primary">主要按钮</Button>
              <Button variant="secondary">次要按钮</Button>
              <Button variant="outline">轮廓按钮</Button>
              <Button variant="ghost">幽灵按钮</Button>
              <Button variant="danger">危险按钮</Button>
              <Button variant="success">成功按钮</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="xs">超小</Button>
              <Button size="sm">小号</Button>
              <Button size="md">中号</Button>
              <Button size="lg">大号</Button>
              <Button size="xl">超大</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button icon={<Plus className="w-4 h-4" />}>添加</Button>
              <Button icon={<Download className="w-4 h-4" />} iconPosition="right">
                下载
              </Button>
              <Button loading>加载中</Button>
              <Button disabled>禁用</Button>
              <Button rounded>圆角按钮</Button>
            </div>
          </div>
        </Card>

        {/* 卡片示例 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            title="基础卡片"
            subtitle="这是一个带标题的卡片"
            headerActions={<Button size="sm" variant="outline">操作</Button>}
          >
            <p className="text-gray-600">卡片内容区域</p>
          </Card>
          
          <Card
            title="带底部的卡片"
            footer={
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">取消</Button>
                <Button variant="primary" size="sm">确认</Button>
              </div>
            }
          >
            <p className="text-gray-600">这个卡片有底部操作区</p>
          </Card>
        </div>

        {/* 模态框示例 */}
        <Card title="模态框组件">
          <Button onClick={() => setModalOpen(true)}>打开模态框</Button>
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="示例模态框"
            footer={
              <>
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  取消
                </Button>
                <Button variant="primary" onClick={() => setModalOpen(false)}>
                  确认
                </Button>
              </>
            }
          >
            <p>这是模态框的内容区域。</p>
          </Modal>
        </Card>

        {/* Toast示例 */}
        <Card title="Toast提示组件">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => addToast('操作成功！', 'success')}>成功提示</Button>
            <Button onClick={() => addToast('发生错误！', 'error')}>错误提示</Button>
            <Button onClick={() => addToast('请注意！', 'warning')}>警告提示</Button>
            <Button onClick={() => addToast('提示信息', 'info')}>信息提示</Button>
          </div>
          <ToastContainer toasts={toasts} onRemove={removeToast} />
        </Card>

        {/* Badge和Tooltip示例 */}
        <Card title="Badge和Tooltip组件">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge>默认</Badge>
              <Badge variant="primary">主要</Badge>
              <Badge variant="success">成功</Badge>
              <Badge variant="danger">危险</Badge>
              <Badge variant="warning">警告</Badge>
              <Badge variant="info">信息</Badge>
              <Badge rounded>圆形</Badge>
              <Badge dot variant="danger">状态</Badge>
            </div>
            <div className="flex gap-4">
              <Tooltip content="这是一个提示">
                <Button variant="outline">悬停提示</Button>
              </Tooltip>
              <Tooltip content="点击显示" trigger="click">
                <Button variant="outline">点击提示</Button>
              </Tooltip>
            </div>
          </div>
        </Card>

        {/* 表格示例 */}
        <Card title="数据表格组件">
          <DataTable
            columns={tableColumns}
            data={tableData}
            showFilter
            showPagination
            pageSize={5}
          />
        </Card>

        {/* 图表示例 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="折线图">
            <LineChart
              data={lineChartData}
              height={300}
              yAxisLabel="数值"
              xAxisLabel="月份"
            />
          </Card>
          
          <Card title="柱状图">
            <BarChart
              data={barChartData}
              height={300}
              yAxisLabel="销售额"
              xAxisLabel="产品"
            />
          </Card>
          
          <Card title="饼图">
            <PieChart
              data={pieChartData}
              height={300}
              donut
            />
          </Card>
          
          <Card title="词云图">
            <WordCloud
              data={wordCloudData}
              height={300}
            />
          </Card>
        </div>

        {/* 加载状态示例 */}
        <Card title="加载组件">
          <div className="flex gap-4 items-center">
            <Loading size="sm" />
            <Loading size="md" />
            <Loading size="lg" />
            <Loading size="xl" />
            <Loading text="加载中..." />
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default ComponentExamples;