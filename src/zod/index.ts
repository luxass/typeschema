import { loadTsConfig } from 'bundle-require';
import { parentPort } from 'node:worker_threads';
import TS from 'typescript';

import { ZodConfig } from '../types';

const DEFAULT_TSCONFIG = {
  compilerOptions: {
    target: TS.ScriptTarget.ESNext,
    module: TS.ModuleKind.ESNext
  }
};

function loadTSConfig() {
  const tsconfig = loadTsConfig(process.cwd());
  if (tsconfig) {
    const parsed = tsconfig.data;
    delete parsed.compilerOptions.outDir;
    delete parsed.compilerOptions.outFile;
    delete parsed.compilerOptions.declaration;
    delete parsed.compilerOptions.declarationDir;
    delete parsed.compilerOptions.declarationMap;
    return parsed;
  } else {
    return DEFAULT_TSCONFIG;
  }
}

export async function createZodSchema(config: ZodConfig) {
  try {
    const tsconfig = loadTSConfig();

    const program = TS.createProgram({
      rootNames: config.input,
      options: tsconfig
    });
    const rootFileNames = program.getRootFileNames();
    const rootSourceFiles = program
      .getSourceFiles()
      .filter((sourceFile) => rootFileNames.includes(sourceFile.fileName));
    console.log(rootSourceFiles);

    parentPort?.postMessage('success');
  } catch (error) {
    parentPort?.postMessage('error');
  }
  parentPort?.close();
}

parentPort?.on('message', (data) => {
  createZodSchema(data);
});
