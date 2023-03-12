#!/usr/bin/env node
import { CAC, cac } from "cac";
import chalk from "chalk";
import prompts from "prompts";

import { InitFlags, RunFlags } from "./@types/typeschema";

declare global {
  const __VERSION__: string;
}

// Add support for something similar to astro integrations or nuxt modules
const templates = ["json-schema", "zod-schema", "zod-and-json-schema"];

const cli = cac("typeschema");

cli.option("-c, --config <path>", "[string] path to config file");

cli.options = {
  dinMor: "aa"
};

cli
  .command("init", "create a new typeschema config file")
  .option("--type <type>", "template you want to generate")
  .action(async (options: InitFlags) => {
    let { type } = options;

    if (!type) {
      type = await prompts({
        type: "select",
        choices: templates.map((t) => ({ title: t, value: t })),
        name: "type",
        message: "What template do you want to generate?"
      }).then((type) => type.type);
    }

    if (!templates.includes(type!)) {
      console.error(
        `\n${chalk.red(
          chalk.bold(chalk.inverse(" Invalid template "))
        )}\n${chalk.red(
          `Template ${chalk.bold(type)} doesn't exist.`
        )}\n\n${chalk.white(
          `Available templates: ${chalk.bold(
            templates
              .map((t) => chalk.green(chalk.underline(t)))
              .join(chalk.white(", "))
          )}`
        )}\n`
      );
    } else {
      console.log(`Initializing config for ${type}`);
    }
  });

cli
  .command("[root]", "run typeschema")
  .alias("run")
  .option("-w, --watch", "[boolean] rebuilds when modules have changed on disk", {
    default: false
  })
  .action(async (_, options: RunFlags) => {
    const { createTypeSchema } = await import("./");
    try {
      await createTypeSchema({
        configPath: options.config,
        watch: options.watch
      });
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
