import { resolve } from 'node:path';

export const resolveAppPath = (...segments: string[]) => resolve(process.cwd(), ...segments);
