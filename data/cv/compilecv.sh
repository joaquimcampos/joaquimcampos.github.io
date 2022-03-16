#!/bin/bash

xelatex cv_Joaquim.tex
bibtex bu1
bibtex bu2
xelatex cv_Joaquim.tex
xelatex cv_Joaquim.tex
pdf2htmlEX --zoom 2 cv_Joaquim.pdf
