.PHONY: help install build uninstall clean
.PHONY: bash version

IMAGE := tamakiii-playground/chatgpt-apple-music-playlist
TAG := latest

help:
	@cat $(firstword $(MAKEFILE_LIST))

install: \
	node_modules

build: Dockerfile
	docker build -t $(IMAGE):$(TAG) .

bash:
	docker run --rm -it -v $(PWD):/work -w /work $(IMAGE):$(TAG) $@

version:
	docker run --rm $(IMAGE):$(TAG) --version

unisntall:
	rm -rf node_modules

clean:
	docker image rm $(IMAGE):$(TAG)

node_modules:
	npm install
