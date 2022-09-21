import * as colors from 'colorette';

export const log = (label: string, ...args: any[]) =>
  console.log(`${colors.green(label.toUpperCase())} `, ...args);
