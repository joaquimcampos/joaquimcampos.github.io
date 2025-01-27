.PHONY: all help compile soft-compile view clean all

help: ## Show this help
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-21s\033[0m %s\n", $$1, $$2}'

all: build

DOC_NAME=cv_Joaquim
NONTECH_DOC_NAME = $(DOC_NAME)_nontech
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

cv_Joaquim_nontech.pdf: $(DOC_NAME).tex $(BIBFILE)
	echo "\def\Techcv{}" > variable.tex
	xelatex -jobname=$(NONTECH_DOC_NAME) $(DOC_NAME).tex
	bibtex bu1
	bibtex bu2
	bibtex bu3
	xelatex -jobname=$(NONTECH_DOC_NAME) $(DOC_NAME).tex
	xelatex -jobname=$(NONTECH_DOC_NAME) $(DOC_NAME).tex
	echo "\def\Techcv{true}" > variable.tex

rm-pdf:
	- rm -v *.pdf

build: cv_Joaquim_nontech.pdf cv_Joaquim.pdf ## Build .pdf

force-build: rm-pdf cv_Joaquim_nontech.pdf cv_Joaquim.pdf ## Force build .pdf

view: cv_Joaquim_nontech.pdf cv_Joaquim.pdf ## View all CVs
	okular $(DOC_NAME).pdf &>/dev/null
	okular $(NONTECH_DOC_NAME).pdf &>/dev/null

view-main: cv_Joaquim.pdf ## View main CV
	okular $(DOC_NAME).pdf &>/dev/null

clean: ## Clean CV build artifacts
	- rm -v -f *.out *.blg *.bbl *.aux *.log *.fdb_latexmk *.fls *.xdv
