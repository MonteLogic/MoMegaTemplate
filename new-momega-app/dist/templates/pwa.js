"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePWAFiles = generatePWAFiles;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
async function generatePWAFiles(config) {
    if (!config.features.pwa)
        return;
    const { projectPath } = config;
    // Generate PWA manifest
    const manifestContent = {
        name: config.projectName,
        short_name: config.projectName,
        description: 'A modern, opinionated Next.js application',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#000000',
        icons: [
            {
                src: '/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
    await fs_extra_1.default.writeJson(path_1.default.join(projectPath, 'public', 'manifest.json'), manifestContent, { spaces: 2 });
    // Generate service worker
    const serviceWorkerContent = `// This is the service worker with the Cache-first network

const CACHE = "cache-first-v1";

const offlineFallbackPage = "offline.html";

// Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener("install", function (event) {
  console.log("[PWA Builder] Install Event processing");

  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log("[PWA Builder] Cached offline page during install");

      if (offlineFallbackPage === "offline.html") {
        return cache.add(new Request("offline.html", { cache: "reload" }));
      }
    })
  );
});

// If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        console.log("[PWA Builder] add page to offline cache: " + response.url);

        // If request was successful, add or update it in the cache
        event.waitUntil(updateCache(event.request, response.clone()));

        return response;
      })
      .catch(function (error) {
        console.log("[PWA Builder] Network request Failed. Serving content from cache: " + error);
        return fromCache(event.request);
      })
  );
});

function fromCache(request) {
  // Check to see if you have it in the cache
  // Return response
  // If not in the cache, then return the offline page
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (!matching || matching.status === 404) {
        // The following validates that the request was for a navigation to a new document
        if (request.destination === "document") {
          return cache.match(offlineFallbackPage);
        }

        return Promise.reject("no-match");
      }

      return matching;
    });
  });
}

function updateCache(request, response) {
  return caches.open(CACHE).then(function (cache) {
    return cache.put(request, response);
  });
}`;
    await fs_extra_1.default.writeFile(path_1.default.join(projectPath, 'public', 'sw.js'), serviceWorkerContent);
    // Generate offline page
    const offlinePageContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Offline - ${config.projectName}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            text-align: center;
            padding: 2rem;
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>You're offline</h1>
        <p>Please check your internet connection and try again.</p>
    </div>
</body>
</html>`;
    await fs_extra_1.default.writeFile(path_1.default.join(projectPath, 'public', 'offline.html'), offlinePageContent);
    // Generate PWA component
    const pwaComponentContent = `'use client';

import { useEffect } from 'react';

export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);

  return <>{children}</>;
}`;
    await fs_extra_1.default.ensureDir(path_1.default.join(projectPath, 'components'));
    await fs_extra_1.default.writeFile(path_1.default.join(projectPath, 'components', 'pwa-provider.tsx'), pwaComponentContent);
}
//# sourceMappingURL=pwa.js.map