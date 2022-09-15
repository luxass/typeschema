#!/bin/env node
import { program } from 'commander';

import { createTypeSchema } from '.';
import { loadTypeSchemaConfig } from './config';

declare global {
  const __VERSION__: string;
}

program
  .name('typeschema')
  .version(__VERSION__)
  .option('-o, --output <path>', 'set output path')
  .action(async () => {
    try {
      const config = await loadTypeSchemaConfig(process.cwd());
      if (!config.data || !config.path) {
        throw new Error('Could not load config');
      }
      await createTypeSchema(config.data);
    } catch (e) {
      console.error(e);
    }
  });

program.parse(process.argv);
