# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run

```bash
# Build
go build -v .

# Run (dev server on port 3000)
go run main.go

# Test all packages
go test -v ./...

# Build for current platform
go build -v -o cloud-torrent .
```

## Project Architecture

**Entry point**: `main.go` — uses `jpillora/opts` for CLI flag parsing, creates and runs a `server.Server`.

**Three packages**:

- **`engine/`** — Torrent engine wrapping `anacrolix/torrent`. Core types: `Engine` (manages torrent client lifecycle), `Torrent`/`File` (data models with progress tracking). Config via `engine.Config` struct (download dir, port, upload/seeding toggles).

- **`server/`** — HTTP server with routing, middleware, and API handlers. Uses `jpillora/velox` for real-time state sync (pushes torrent/download state to browser clients). Middleware chain: gzip → optional basic auth (`jpillora/cookieauth`) → optional request logging. Routes: `/sync` (realtime), `/search` (scraper), `/api/` (REST), else static files.

- **`static/`** — Frontend assets (AngularJS + Semantic UI) embedded into the Go binary via `//go:embed`. HTML templates in `static/files/template/`, JS controllers in `static/files/js/`.

**Key patterns**:
- State polling loop pushes torrent/download state to connected clients every 1s via `velox.Push()`
- Config persisted to JSON file (`cloud-torrent.json`)
- Search uses `jpillora/scraper` with predefined search provider config
- Frontend is a single-page AngularJS app with controllers: `omni` (add torrent), `torrents` (list), `downloads` (files), `config` (settings)
