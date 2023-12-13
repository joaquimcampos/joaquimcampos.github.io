.PHONY: all help soft-compile view clean all

help: ## Show this help
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-21s\033[0m %s\n", $$1, $$2}'

CVDIR=assets/cv

all: build

sass:
	sass assets/sass/main.scss assets/css/main.css

build: sass ## Build CV and site
	bundle exec jekyll build

serve: sass ## Serve site
	bundle exec jekyll serve  --livereload

clean: ## clean-cv + remove built site
	rm -rf _site
