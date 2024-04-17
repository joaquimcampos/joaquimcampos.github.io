.PHONY: all help compile soft-compile view clean all

help: ## Show this help
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-21s\033[0m %s\n", $$1, $$2}'

all: build

DOC_NAME=cv_Joaquim
TERGAR_DOC_NAME = $(DOC_NAME)_tergar
BIBFILE=../pubs/bibfile.bib

# https://tex.stackexchange.com/questions/204291
# https://tex.stackexchange.com/questions/223769
# https://stackoverflow.com/questions/7815400
# Pol delete commit: f16f136
cv_Joaquim.pdf: $(DOC_NAME).tex $(BIBFILE)
	echo "\def\Techcv{true}" > variable.tex
	xelatex -jobname=$(DOC_NAME) $(DOC_NAME).tex
	bibtex bu1
	bibtex bu2
	bibtex bu3
	xelatex -jobname=$(DOC_NAME) $(DOC_NAME).tex
	xelatex -jobname=$(DOC_NAME) $(DOC_NAME).tex

cv_Joaquim.html: $(DOC_NAME).pdf
	make $(DOC_NAME).pdf
	pdf2htmlEX --zoom 2 $(DOC_NAME).pdf $(DOC_NAME).html

cv_Joaquim_tergar.pdf: $(DOC_NAME).tex $(BIBFILE)
	echo "\def\Techcv{}" > variable.tex
	xelatex -jobname=$(TERGAR_DOC_NAME) $(DOC_NAME).tex
	bibtex bu1
	bibtex bu2
	bibtex bu3
	xelatex -jobname=$(TERGAR_DOC_NAME) $(DOC_NAME).tex
	xelatex -jobname=$(TERGAR_DOC_NAME) $(DOC_NAME).tex

cv_Joaquim_tergar.html: $(TERGAR_DOC_NAME).pdf
	make $(TERGAR_DOC_NAME).pdf
	pdf2htmlEX --zoom 2 $(TERGAR_DOC_NAME).pdf $(TERGAR_DOC_NAME).html

compile: cv_Joaquim.pdf cv_Joaquim_tergar.pdf  ## Compile .pdf
build: cv_Joaquim.html cv_Joaquim_tergar.html ## Build .html

view: cv_Joaquim.pdf cv_Joaquim_tergar.pdf ## View all CVs
	okular $(DOC_NAME).pdf &>/dev/null
	okular $(TERGAR_DOC_NAME).pdf &>/dev/null

view-main: cv_Joaquim.pdf ## View main CV
	okular $(DOC_NAME).pdf &>/dev/null

clean: ## Clean CV build artifacts
	rm -f *.out *.blg *.bbl *.aux *.log *.fdb_latexmk *.fls
