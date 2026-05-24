import { contextBridge } from 'electron';
import { exposedApi } from './exposed/exposed-api';

contextBridge.exposeInMainWorld('api', exposedApi);
