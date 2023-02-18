#!/usr/bin/env node
import { cac } from "cac";
import chalk from "chalk";
import prompts from "prompts";

import { initializeConfig, loadTypeSchemaConfig } from "./config";

import { createTypeSchema } from "./index";

declare global {
  const __VERSION__: string;
}

const templates = ["json-schema", "zod-schema", "zod-and-json-schema"];

const cli = cac("typeschema");

cli.option("-c, --config <path>", "[string] path to config file");

cli
  .command("init", "create a new typeschema config file")
  .option("-t, --type [type]", "template you want to generate")
  .action(async (options: { type: string }) => {
    let { type } = options;

    if (!options.type) {
      type = await prompts({
        type: "select",
        choices: templates.map((t) => ({ title: t, value: t })),
        name: "type",
        message: "What template do you want to generate?"
      }).then((type) => type.type)
    }
    if (options.type) {
      if (!templates.includes(options.type)) {
        throw new TypeError(`Invalid template type: ${options.type}`);
      }
      console.log(`Initializing config for ${type}`);
      
    } else {
      console.log("No template type selected");
    }
  });

cli
  .command("", "build typeschema")
  .option("-w, --watch", "[boolean] rebuilds when modules have changed on disk")
  .action(async (options: { watch?: boolean; config?: string }) => {
    try {
      const config = await loadTypeSchemaConfig(process.cwd(), options.config);
      if (!config) {
        throw new TypeError("Could not load config");
      }
      await createTypeSchema(config);
    } catch (e) {
      process.exitCode = 1;
      console.error(
        `\n${chalk.red(chalk.bold(chalk.inverse(" Unhandled Error ")))}`
      );
      console.error(e);
      console.error("\n\n");
    }
  });

cli.help();
cli.version(__VERSION__);

cli.parse();

// program
//   .name("typeschema")
//   .version(__VERSION__)
//   .option("-c, --config <path>", "path to config file")
//   .command("init")
//   .action(async () => {
//     console.log("init");
//   })
//   .action(async () => {
//     const opts = program.opts();
// try {
//   const config = await loadTypeSchemaConfig(process.cwd(), opts.config);
//   if (!config) {
//     throw new TypeError("Could not load config");
//   }
//   await createTypeSchema(config);
// } catch (e) {
//   process.exitCode = 1;
//   console.error(
//     `\n${chalk.red(chalk.bold(chalk.inverse(" Unhandled Error ")))}`
//   );
//   console.error(e);
//   console.error("\n\n");
// }
//   });

// program.parse(process.argv);
