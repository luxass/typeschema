import type {
  HookParameters,
  PluginHook,
  PluginHooks,
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
    call: async <Hook extends keyof PluginHooks>(
      hook: Hook,
      params: HookParameters<Hook>
    ) => {
      for (const plugin of pluginMap.values()) {
        if (plugin.hooks[hook]) {
          // TODO: Fix this any cast
          await plugin.hooks["config"]!(params as any);
        }
      }
    }
  };
}
