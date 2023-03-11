import type {
  HookParameters,
  PluginHook,
  TypeSchemaPlugin
} from "./@types/typeschema";

export function createHooks(plugins?: readonly TypeSchemaPlugin[]): PluginHook {
  const pluginMap = new Map<string, TypeSchemaPlugin>();

  for (const plugin of plugins || []) {
    if (pluginMap.has(plugin.name)) {
      throw new TypeError(`Duplicate plugin name: ${plugin.name}`);
    }
    pluginMap.set(plugin.name, plugin);
  }

  return {
    call: async <Hook extends keyof TypeSchemaPlugin["hooks"]>(
      hook: Hook,
      params: HookParameters<Hook>
    ) => {
      for (const plugin of pluginMap.values()) {
        if (plugin.hooks[hook]) {
          console.log(`Calling ${hook} on ${plugin.name}`);
        }
      }
    }
  };
}
