.PHONY: all help soft-compile view clean all

help: ## Show this help
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-21s\033[0m %s\n", $$1, $$2}'

CVDIR=assets/cv

all: build

build: ## Build CV and site
	cd $(CVDIR) && $(MAKE) build
	bundle exec jekyll build

serve:  ## Serve site
	cd $(CVDIR) && $(MAKE) build
	bundle exec jekyll serve  --livereload

view-cv: ## View CV
	cd $(CVDIR) && $(MAKE) view

clean-cv: ## Clean CV build artifacts
	cd $(CVDIR) && $(MAKE) clean

clean: clean-cv ## clean-cv + remove built site
	rm -rf _site
