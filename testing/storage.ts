import type { ExtensionManifest } from './manifest';

export interface ZoteraStorage {
  init(): Promise<void>;
  search(): Promise<any>;

  addPackage(identifier: string): Promise<void>;

  getPackages(search?: string): Promise<ExtensionManifest[]>;
  getPackage(identifier: string, version?: string): Promise<ExtensionManifest | undefined>;
  getPackageVersions(identifier: string): Promise<string[]>;
}
