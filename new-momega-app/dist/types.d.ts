export interface AppConfig {
    projectName: string;
    projectPath: string;
    features: {
        clerk: boolean;
        database: boolean;
        pwa: boolean;
        stripe: boolean;
        blog: boolean;
        testing: boolean;
    };
    styling: {
        tailwind: boolean;
        shadcn: boolean;
    };
    database: {
        type: 'sqlite' | 'postgresql' | 'mysql' | null;
        orm: 'drizzle' | null;
    };
    deployment: {
        platform: 'vercel' | 'netlify' | 'other';
    };
}
export interface CreateAppOptions {
    projectName?: string;
    skipPrompts?: boolean;
    skipInstall?: boolean;
    skipGit?: boolean;
}
//# sourceMappingURL=types.d.ts.map