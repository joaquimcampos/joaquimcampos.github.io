.PHONY: all help compile soft-compile view clean all

help: ## Show this help
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-21s\033[0m %s\n", $$1, $$2}'

all: build

DOCNAME=cv_Joaquim
BIBFILE=../pubs/bibfile.bib

# https://tex.stackexchange.com/questions/204291
# https://tex.stackexchange.com/questions/223769
# https://stackoverflow.com/questions/7815400
# Pol delete commit: f16f136
cv_Joaquim.pdf: $(DOCNAME).tex $(BIBFILE)
	echo "\def\showTergar{}" > variable.tex
	xelatex -jobname=$(DOCNAME) $(DOCNAME).tex
	bibtex bu1
	bibtex bu2
	bibtex bu3
	xelatex -jobname=$(DOCNAME) $(DOCNAME).tex
	xelatex -jobname=$(DOCNAME) $(DOCNAME).tex

cv_Joaquim_tergar.pdf: $(DOCNAME).tex $(BIBFILE)
	echo "\def\showTergar{true}" > variable.tex
	xelatex -jobname=$(DOCNAME)_tergar $(DOCNAME).tex
	bibtex bu1
	bibtex bu2
	bibtex bu3
	xelatex -jobname=$(DOCNAME)_tergar $(DOCNAME).tex
	xelatex -jobname=$(DOCNAME)_tergar $(DOCNAME).tex

cv_Joaquim.html: $(DOCNAME).pdf
	make cv_Joaquim.pdf
	pdf2htmlEX --zoom 2 $(DOCNAME).pdf $(DOCNAME).html

compile: cv_Joaquim.pdf cv_Joaquim_tergar.pdf  ## Compile .pdf
build: cv_Joaquim.html cv_Joaquim_tergar.pdf ## Build .html

view: cv_Joaquim.pdf cv_Joaquim_tergar.pdf ## View CV
	okular $(DOCNAME).pdf &>/dev/null
	okular $(DOCNAME)_tergar.pdf &>/dev/null

clean: ## Clean CV build artifacts
	rm -f *.out *.blg *.bbl *.aux *.log *.fdb_latexmk *.fls
