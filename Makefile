.PHONY: dev-up dev-down dev-logs e2e-up e2e-down e2e-logs e2e-test e2e-test-headed

# ── Dev infra (postgres + mailcatcher) ──────────────────────────────────────

dev-up:
	docker compose --env-file apps/api/.env -f docker-compose.dev.yml up -d

dev-down:
	docker compose --env-file apps/api/.env -f docker-compose.dev.yml down

dev-logs:
	docker compose --env-file apps/api/.env -f docker-compose.dev.yml logs -f

# ── E2E infra (full stack) ───────────────────────────────────────────────────

e2e-up:
	docker compose --env-file .env.e2e -f docker-compose.e2e.yml up -d --wait

e2e-down:
	docker compose --env-file .env.e2e -f docker-compose.e2e.yml down

e2e-logs:
	docker compose --env-file .env.e2e -f docker-compose.e2e.yml logs -f

# ── E2E tests ────────────────────────────────────────────────────────────────

e2e-test: e2e-up
	pnpm --filter e2e-tests test:headless
	$(MAKE) e2e-down

e2e-test-headed: e2e-up
	pnpm --filter e2e-tests test:headed
	$(MAKE) e2e-down
