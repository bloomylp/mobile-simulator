---
name: headroom
description: Context compression using headroom MCP. Use whenever large content would bloat the context window.
triggers:
  - large file reads (>100 lines)
  - search results with many matches
  - test output / build logs
  - any tool result you'll reason over but don't need fully in-context
---

# Headroom — Context Compression

## When to compress

Compress BEFORE reasoning over any large content:

| Content type | Threshold |
|---|---|
| File reads | >100 lines |
| Grep / Glob results | >20 matches |
| Test output | any failure dump |
| Build / lint logs | always |
| Git diff | >50 lines |

## How to use

**Compress:**
```
mcp__headroom__headroom_compress({ content: "<large text>" })
→ returns compressed text + hash
```

**Retrieve when needed:**
```
mcp__headroom__headroom_retrieve({ hash: "<hash>", query: "optional filter" })
```

**Check savings:**
```
mcp__headroom__headroom_stats()
```

## Rules

1. Compress the raw output, reason over the compressed version.
2. Only retrieve full content if compressed version lacks needed detail.
3. Never skip compression to "save a step" — context bloat costs more.
4. One compress call per large block, not per line.
