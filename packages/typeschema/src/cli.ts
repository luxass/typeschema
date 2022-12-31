#!/usr/bin/env node
import { program } from "commander";
import type { TypeSchemaConfig } from "@typeschema/types";
import chalk from "chalk";
import { loadTypeSchemaConfig } from "./config";
import { createTypeSchema } from ".";

declare global {
  const __VERSION__: string;
}

program
  .name("typeschema")
  .version(__VERSION__)
  .option("-c, --config <path>", "path to config file")

  .action(async () => {
    const opts = program.opts();
    let config: TypeSchemaConfig = {};
    try {
      console.log(opts);

      const { path, data } = await loadTypeSchemaConfig(process.cwd(), opts.config);
      if (!data || !path) {
        throw new TypeError("Could not load config");
      }
      config = data;
      await createTypeSchema(config);
    } catch (e) {
      process.exitCode = 1;
      console.error(`\n${chalk.red(chalk.bold(chalk.inverse(" Unhandled Error ")))}`);
      console.error(e);
      console.error("\n\n");
    }
  });

program.parse(process.argv);
