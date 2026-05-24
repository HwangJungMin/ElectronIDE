import { invoke } from '../utils/ipc-wrapper';

export const plcApi = {
  connect: () => invoke('plc:connect'),
};
