import { AppConfig } from '../types';
export declare function generatePackageJson(config: AppConfig): {
    name: string;
    version: string;
    private: boolean;
    scripts: Record<string, string>;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    packageManager: string;
};
//# sourceMappingURL=packageJson.d.ts.map