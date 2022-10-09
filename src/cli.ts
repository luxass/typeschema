#!/usr/bin/env node
import { program } from 'commander';

import { createTypeSchema } from '.';
import { loadTypeSchemaConfig } from './config';

declare global {
  const __VERSION__: string;
}

program
  .name('typeschema')
  .version(__VERSION__)
  .option('-c, --config <path>', 'path to config file')
  .action(async () => {
    const opts = program.opts();
    try {
      const config = await loadTypeSchemaConfig(opts.config || process.cwd());
      if (!config.data || !config.path) {
        throw new Error('Could not load config');
      }
      await createTypeSchema(config.data);
    } catch (e) {
      console.error(e);
    }
  });

program.parse(process.argv);
