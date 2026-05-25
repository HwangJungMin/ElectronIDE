import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles/globals.css';
// 부팅 시 1회 사이드이펙트: self.MonacoEnvironment 등록 (Monaco worker 로딩용).
import './features/editor/services/monaco-setup';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
