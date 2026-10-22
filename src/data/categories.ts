export const categories = [
  {
    id: 'coding',
    name: 'AI 编程',
    task: '让开发多一个搭档',
    description: '理解代码、实现功能与审查改动',
    symbol: '</>',
  },
  {
    id: 'agents',
    name: 'Agent 与 MCP',
    task: '连接工具与行动',
    description: '协议、编排、调试与浏览器工具',
    symbol: '↔',
  },
  {
    id: 'build',
    name: '应用开发',
    task: '把模型接进产品',
    description: 'SDK、数据检索与模型网关',
    symbol: '{ }',
  },
  {
    id: 'models',
    name: '模型与本地运行',
    task: '找到合适的运行方式',
    description: '本地推理、模型加载与服务',
    symbol: '◈',
  },
  {
    id: 'research',
    name: '搜索与研究',
    task: '给回答找到依据',
    description: '网络搜索、网页读取与资料检索',
    symbol: '⌕',
  },
  {
    id: 'creative',
    name: '界面与创作',
    task: '让想法变得可见',
    description: '界面原型、生成工作流与媒体 API',
    symbol: '✳',
  },
] as const;
