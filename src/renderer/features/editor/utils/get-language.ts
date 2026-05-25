// 파일 확장자 → Monaco language ID.
//
// 학습 포인트:
//   Monaco의 language ID는 자체 표준 (예: 'typescript', 'javascript', 'markdown').
//   파일 확장자와 1:1 매칭이 안 되므로 명시적 맵이 필요.
//   여기 없는 확장자는 'plaintext'로 폴백 — 색칠은 없지만 그래도 표시는 됨.

const EXT_TO_LANGUAGE: Record<string, string> = {
  ts: 'typescript',
  tsx: 'typescript',
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  json: 'json',
  jsonc: 'json',
  html: 'html',
  htm: 'html',
  css: 'css',
  scss: 'scss',
  less: 'less',
  md: 'markdown',
  markdown: 'markdown',
  py: 'python',
  go: 'go',
  rs: 'rust',
  java: 'java',
  c: 'c',
  h: 'c',
  cpp: 'cpp',
  cc: 'cpp',
  hpp: 'cpp',
  cs: 'csharp',
  sh: 'shell',
  bash: 'shell',
  zsh: 'shell',
  ps1: 'powershell',
  yml: 'yaml',
  yaml: 'yaml',
  toml: 'ini',
  ini: 'ini',
  xml: 'xml',
  svg: 'xml',
  sql: 'sql',
  dockerfile: 'dockerfile',
};

export function getLanguageFromPath(path: string): string {
  const lower = path.toLowerCase();
  const base = lower.split(/[\\/]/).pop() ?? '';
  if (base === 'dockerfile') return 'dockerfile';
  const ext = base.includes('.') ? base.split('.').pop()! : '';
  return EXT_TO_LANGUAGE[ext] ?? 'plaintext';
}
