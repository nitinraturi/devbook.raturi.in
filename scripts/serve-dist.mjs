#!/usr/bin/env node
// Minimal static server for dist/ that applies public/_headers rules the way
// Cloudflare Pages does (so e2e tests and Lighthouse run under the real CSP),
// adds trailing-slash redirects, gzips text like Cloudflare does, and serves
// 404.html. Local testing only.
import { createReadStream, existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { createGzip } from 'node:zlib';
import { extname, join, normalize } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const port = Number(process.env.PORT ?? 4324);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.pagefind': 'application/octet-stream',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

/** Parse _headers into [{ pattern: RegExp, headers: [name, value][] }]. */
function parseHeaders(src) {
  const rules = [];
  let cur = null;
  for (const line of src.split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (!/^\s/.test(line)) {
      const re = new RegExp(
        `^${line
          .trim()
          .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
          .replace(/\*/g, '.*')}$`,
      );
      cur = { pattern: re, headers: [] };
      rules.push(cur);
    } else if (cur) {
      const i = line.indexOf(':');
      cur.headers.push([line.slice(0, i).trim(), line.slice(i + 1).trim()]);
    }
  }
  return rules;
}

const rules = parseHeaders(await readFile(join(dist, '_headers'), 'utf8'));

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  let path = decodeURIComponent(url.pathname);
  for (const r of rules)
    if (r.pattern.test(path)) for (const [k, v] of r.headers) res.setHeader(k, v);

  let file = normalize(join(dist, path));
  if (!file.startsWith(dist)) {
    res.writeHead(400).end();
    return;
  }
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!path.endsWith('/')) {
      res.writeHead(308, { Location: `${path}/${url.search}` }).end();
      return;
    }
    file = join(file, 'index.html');
  }
  if (!existsSync(file)) {
    res.writeHead(404, { 'Content-Type': TYPES['.html'] });
    createReadStream(join(dist, '404.html')).pipe(res);
    return;
  }
  const type = TYPES[extname(file)] ?? 'application/octet-stream';
  const compressible = /^(text\/|application\/(json|xml)|image\/svg)/.test(type);
  if (compressible && /\bgzip\b/.test(String(req.headers['accept-encoding'] ?? ''))) {
    res.writeHead(200, {
      'Content-Type': type,
      'Content-Encoding': 'gzip',
      Vary: 'Accept-Encoding',
    });
    createReadStream(file)
      .pipe(createGzip({ level: 9 }))
      .pipe(res);
    return;
  }
  res.writeHead(200, { 'Content-Type': type });
  createReadStream(file).pipe(res);
}).listen(port, '127.0.0.1', () =>
  console.log(`Serving dist/ with _headers on http://127.0.0.1:${port}`),
);
