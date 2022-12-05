#!/usr/bin/env node
import { Option, program } from 'commander';

import { TypeSchemaConfig, createTypeSchema, runTypeSchema } from '.';
import { loadTypeSchemaConfig } from './config';

declare global {
  const __VERSION__: string;
}

// TODO: Add zod and jsonschema options to CLI.
program
  .name('typeschema')
  .version(__VERSION__)
  .option('-c, --config <path>', 'path to config file')

  .action(async () => {
    const opts = program.opts();
    let config: TypeSchemaConfig = {};
    try {
      const { path, data } = await loadTypeSchemaConfig(process.cwd(), opts.config);
      if (!data || !path) {
        throw new Error('Could not load config');
      }
      config = data;
      await runTypeSchema(config);
      // await createTypeSchema(config);
    } catch (e) {
      console.error(e);
    }
  });

program.parse(process.argv);
