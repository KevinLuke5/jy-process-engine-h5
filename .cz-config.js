module.exports =  {
  types: [
    { value: 'feat', name: 'feat: 一个新增功能' },
    { value: 'fix', name: 'fix: bug 修复' },
    { value: 'docs', name: 'docs: 文档的修改' },
    { value: 'style', name: 'style: 纯 UI 的修改,JS 逻辑无变化' },
    { value: 'refactor', name: 'refactor: 功能和代码重构' },
    { value: 'perf', name: 'perf: 代码格式化和优化逻辑' },
    { value: 'test', name: 'test: 无意义的测试代码' },
    { value: 'chore', name: 'chore: 构建过程或辅助工具的变动' },
    { value: 'revert', name: 'revert: 代码回滚' }
  ],
  messages: {
    type: '【必填】请选择提交的类型:',
    scope: '选择一个 scope:',
    customScope: '【必填】关联 TB 需求和 BUG 编号:',
    subject: '【必填】简短描述本次更改(100 个字内):',
    footer: "【可选】关联关闭的 issue，例如：#SCRUM-6931, #34:",
    confirmCommit: '确认按以上内容提交吗?'
  },
  allowCustomScopes: true,
  skipQuestions: ['body', 'breaking'],
  subjectLimit: 100,
  subjectDefault: false
};