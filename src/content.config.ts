import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// /root content collection — the curriculum.
//
// Uses the glob loader (Astro 5+ / 7 canonical API — replaces legacy type: 'content').
// Schema is permissive passthrough: title required, common fields optional,
// extra fields tolerated (frontmatter varies across phase docs, ADRs, patterns,
// project plans, etc.).
//
// Last verified: 2026-07 against Astro 7.x

const docs = defineCollection({
  loader: glob({
    // The PR template is a raw GitHub artifact (shipped to .github/pull_request_template.md);
    // it intentionally has no frontmatter, so exclude it from the collection.
    pattern: ['**/*.md', '!meta/git-templates/pull-request-template.md'],
    base: './src/content/docs',
  }),
  schema: z
    .object({
      title: z.string(),
      description: z.string().optional(),
      tags: z.array(z.string()).optional(),
      status: z.string().optional(),

      // Phase docs
      arc: z.union([z.number(), z.string()]).optional(),
      phase: z.union([z.number(), z.string()]).optional(),

      // Pattern entries
      category: z.string().optional(),
      deep_since: z.string().optional(),
      operating_evidence: z.array(z.string()).optional(),

      // Project plans
      project: z.string().optional(),
    })
    .passthrough(),
});

export const collections = {
  docs,
};
