"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDatabaseFiles = generateDatabaseFiles;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
async function generateDatabaseFiles(config) {
    if (!config.features.database)
        return;
    const { projectPath } = config;
    // Create database directory
    await fs_extra_1.default.ensureDir(path_1.default.join(projectPath, 'db'));
    await fs_extra_1.default.ensureDir(path_1.default.join(projectPath, 'db', 'migrations'));
    // Generate database schema
    const schemaContent = `import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  published: integer('published', { mode: 'boolean' }).notNull().default(false),
  authorId: text('author_id').notNull().references(() => users.id),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP'),
});`;
    await fs_extra_1.default.writeFile(path_1.default.join(projectPath, 'db', 'schema.ts'), schemaContent);
    // Generate database index
    const dbIndexContent = `import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

const sqlite = new Database('dev.db');
export const db = drizzle(sqlite, { schema });`;
    await fs_extra_1.default.writeFile(path_1.default.join(projectPath, 'db', 'index.ts'), dbIndexContent);
    // Generate drizzle config
    const drizzleConfig = `import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  driver: 'better-sqlite',
  dbCredentials: {
    url: './dev.db',
  },
} satisfies Config;`;
    await fs_extra_1.default.writeFile(path_1.default.join(projectPath, 'drizzle.config.ts'), drizzleConfig);
    // Generate API route for database operations
    const apiRouteContent = `import { db } from '@/db';
import { users, posts } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const allUsers = await db.select().from(users);
    return NextResponse.json({ users: allUsers });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    const newUser = await db.insert(users).values({
      id: crypto.randomUUID(),
      email,
      name,
    }).returning();

    return NextResponse.json({ user: newUser[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}`;
    await fs_extra_1.default.ensureDir(path_1.default.join(projectPath, 'app', 'api', 'users'));
    await fs_extra_1.default.writeFile(path_1.default.join(projectPath, 'app', 'api', 'users', 'route.ts'), apiRouteContent);
}
//# sourceMappingURL=database.js.map