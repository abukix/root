// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// /root — The build guide for basecamp
// Site: https://root.abukix.dev
// Last verified: 2026-07 against Astro 7.x, Tailwind 4.x
//
// Stack:
//   - Pure Astro (no Starlight); custom docs system
//   - Tailwind 4 via @tailwindcss/vite plugin (config-in-CSS at src/styles/base.css)
//   - Deploy: Cloudflare Pages

/**
 * rehypeRootBrand — wraps every "/root" occurrence in prose with
 * <span class="root-brand"> so the curriculum name reads as a brand mark.
 *
 * Skips content inside <code>, <pre>, <a>, <script>, <style> so URL paths,
 * code identifiers, and link text aren't affected. Regex rejects "/root"
 * followed by word char, hyphen, or slash — so "/root/foo", "/root-abc",
 * and "/roots" stay untouched.
 */
function rehypeRootBrand() {
  const SKIP_TAGS = new Set(['code', 'pre', 'a', 'script', 'style']);
  const PATTERN = /\/root(?![\w/-])/g;

  return (tree) => {
    function walk(node, inSkip) {
      if (!node || !Array.isArray(node.children)) return;
      const skip =
        inSkip || (node.type === 'element' && SKIP_TAGS.has(node.tagName));

      const newChildren = [];
      for (const child of node.children) {
        if (
          child.type === 'text' &&
          !skip &&
          child.value.includes('/root')
        ) {
          const value = child.value;
          const re = new RegExp(PATTERN.source, 'g');
          let lastIndex = 0;
          let match;
          let emitted = false;
          while ((match = re.exec(value)) !== null) {
            emitted = true;
            if (match.index > lastIndex) {
              newChildren.push({
                type: 'text',
                value: value.slice(lastIndex, match.index),
              });
            }
            newChildren.push({
              type: 'element',
              tagName: 'span',
              properties: { className: ['root-brand'] },
              children: [{ type: 'text', value: '/root' }],
            });
            lastIndex = re.lastIndex;
          }
          if (emitted) {
            if (lastIndex < value.length) {
              newChildren.push({
                type: 'text',
                value: value.slice(lastIndex),
              });
            }
          } else {
            newChildren.push(child);
          }
        } else {
          walk(child, skip);
          newChildren.push(child);
        }
      }
      node.children = newChildren;
    }
    walk(tree, false);
  };
}

export default defineConfig({
  site: 'https://root.abukix.dev',
  trailingSlash: 'always',

  vite: {
    plugins: [tailwindcss()],
  },

  build: {
    format: 'directory',
  },

  markdown: {
    rehypePlugins: [rehypeRootBrand],
  },

  // Content collections defined in src/content.config.ts
});
