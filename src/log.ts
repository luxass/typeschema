import * as colors from 'colorette';

export const info = (label: string, ...args: any[]) => {
  console.log(`${colors.green(label.toUpperCase())}`, ...args);
}

export const error = (label: string, ...args: any[]) => {
  console.error(`${colors.red(label.toUpperCase())}`, ...args);
}

export const warn = (label: string, ...args: any[]) => {
  console.warn(`${colors.yellow(label.toUpperCase())}`, ...args);
}