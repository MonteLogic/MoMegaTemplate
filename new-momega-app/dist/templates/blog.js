"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBlogFiles = generateBlogFiles;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
async function generateBlogFiles(config) {
    if (!config.features.blog)
        return;
    const { projectPath } = config;
    // Create blog content directory
    await fs_extra_1.default.ensureDir(path_1.default.join(projectPath, 'content', 'posts'));
    await fs_extra_1.default.ensureDir(path_1.default.join(projectPath, 'app', 'blog'));
    // Generate blog post example
    const examplePost = `---
title: "Welcome to ${config.projectName}"
date: "2024-01-01"
description: "Your first blog post"
tags: ["welcome", "getting-started"]
author: "Admin"
status: "public"
---

# Welcome to ${config.projectName}!

This is your first blog post. You can edit this file in the \`content/posts\` directory.

## Features

- **Markdown Support**: Write your posts in Markdown
- **Frontmatter**: Add metadata to your posts
- **Tags**: Organize your content with tags
- **Categories**: Group related posts together

## Getting Started

1. Create a new markdown file in \`content/posts\`
2. Add frontmatter with metadata
3. Write your content in Markdown
4. Your post will automatically appear on your blog!

Happy writing! 🎉`;
    await fs_extra_1.default.writeFile(path_1.default.join(projectPath, 'content', 'posts', 'welcome.md'), examplePost);
    // Generate blog utility functions
    const blogUtilsContent = `import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  author: string;
  status: 'public' | 'private';
  content: string;
}

export function getAllPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((name) => name.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title,
        date: data.date,
        description: data.description,
        tags: data.tags || [],
        author: data.author,
        status: data.status || 'public',
        content,
      };
    })
    .filter((post) => post.status === 'public')
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return allPostsData;
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, \`\${slug}.md\`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      date: data.date,
      description: data.description,
      tags: data.tags || [],
      author: data.author,
      status: data.status || 'public',
      content,
    };
  } catch (error) {
    return null;
  }
}`;
    await fs_extra_1.default.ensureDir(path_1.default.join(projectPath, 'lib'));
    await fs_extra_1.default.writeFile(path_1.default.join(projectPath, 'lib', 'blog.ts'), blogUtilsContent);
    // Generate blog listing page
    const blogPageContent = `import { getAllPosts } from '@/lib/blog';
import Link from 'next/link';

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post.slug} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">
              <Link href={\`/blog/\${post.slug}\`} className="hover:text-blue-600">
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{post.description}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{post.date}</span>
              <span>By {post.author}</span>
            </div>
            {post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}`;
    await fs_extra_1.default.writeFile(path_1.default.join(projectPath, 'app', 'blog', 'page.tsx'), blogPageContent);
    // Generate blog post page
    const blogPostPageContent = `import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center justify-between text-gray-600 dark:text-gray-300 mb-4">
            <span>By {post.author}</span>
            <span>{post.date}</span>
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>
        <div className="prose dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>
    </div>
  );
}`;
    await fs_extra_1.default.ensureDir(path_1.default.join(projectPath, 'app', 'blog', '[slug]'));
    await fs_extra_1.default.writeFile(path_1.default.join(projectPath, 'app', 'blog', '[slug]', 'page.tsx'), blogPostPageContent);
}
//# sourceMappingURL=blog.js.map