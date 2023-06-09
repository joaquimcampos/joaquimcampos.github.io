.PHONY: all help compile soft-compile view clean all

help: ## Show this help
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-21s\033[0m %s\n", $$1, $$2}'

all: build

DOCNAME=cv_Joaquim
BIBFILE=../pubs/bibfile.bib

# TODO: Workflows for compiling, install fixFONTproblem.sh
# https://tex.stackexchange.com/questions/204291
# https://tex.stackexchange.com/questions/223769
# https://stackoverflow.com/questions/7815400
# Pol delete commit: f16f136
cv_Joaquim.pdf: $(DOCNAME).tex $(BIBFILE)
	xelatex $(DOCNAME).tex
	bibtex bu1
	bibtex bu2
	bibtex bu3
	xelatex $(DOCNAME).tex
	xelatex $(DOCNAME).tex

cv_Joaquim.html: $(DOCNAME).pdf
	make cv_Joaquim.pdf
	pdf2htmlEX --zoom 2 $(DOCNAME).pdf $(DOCNAME).html

compile: cv_Joaquim.pdf  ## Compile .pdf
build: cv_Joaquim.html  ## Build .html

view: cv_Joaquim.pdf ## View CV
	open $(DOCNAME).pdf

clean: ## Clean CV build artifacts
	rm -f *.out *.blg *.bbl *.aux *.log
