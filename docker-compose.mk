.PHONY: help setup install build teardown uninstall clean
.PHONY: bash

SERVICE := app

help:
	@cat $(firstword $(MAKEFILE_LIST))

setup: \
	.env

install: \
	node_modules

build: docker-compose.yaml
	docker compose build

bash:
	docker compose run --rm -it -v $(PWD):/app $(SERVICE) $@

teardown:
	rm -rf .env

unisntall:
	rm -rf node_modules

clean:
	docker image rm $(IMAGE):$(TAG)

.env:
	echo 'APPLE_MUSIC_USERNAME=$(USERNAME)' > $@
	echo 'APPLE_MUSIC_PASSWORD=$(PASSWORD)' >> $@

node_modules:
	npm install
