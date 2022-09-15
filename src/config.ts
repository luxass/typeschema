import { bundleRequire } from 'bundle-require';
import JoyCon from 'joycon';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import strip from 'strip-json-comments';

import { TypeSchemaConfig } from './types';

const joycon = new JoyCon();

const loadJson = async (filepath: string) => {
  try {
    // eslint-disable-next-line no-new-func
    return new Function(`return ${strip(await readFile(filepath, 'utf8')).trim()}`)();
  } catch (error) {
    if (error instanceof Error) {
      throw new TypeError(
        `Failed to parse ${path.relative(process.cwd(), filepath)}: ${error.message}`
      );
    } else {
      throw error;
    }
  }
};

const jsonLoader = {
  test: /\.json$/,
  load(filepath: string) {
    return loadJson(filepath);
  }
};

joycon.addLoader(jsonLoader);

export async function loadTypeSchemaConfig(
  cwd: string
): Promise<{ path?: string; data?: ReturnType<typeof defineConfig> }> {
  const configJoycon = new JoyCon();
  const configPath = await configJoycon.resolve({
    files: [
      'typeschema.config.ts',
      'typeschema.config.js',
      'typeschema.config.cjs',
      'typeschema.config.mjs',
      'typeschema.config.json',
      'package.json'
    ],
    cwd,
    stopDir: path.parse(cwd).root,
    packageKey: 'typeschema'
  });

  if (configPath) {
    if (configPath.endsWith('.json')) {
      let data = await loadJson(configPath);
      if (configPath.endsWith('package.json')) {
        data = data.typeschema;
      }
      if (data) {
        return { path: configPath, data };
      }
      return {};
    }

    const config = await bundleRequire({
      filepath: configPath
    });
    return {
      path: configPath,
      data: config.mod.typeschema || config.mod.default || config.mod
    };
  }

  return {};
}

export const defineConfig = (config: TypeSchemaConfig) => config;
