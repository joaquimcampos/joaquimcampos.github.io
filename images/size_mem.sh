#!/bin/bash
du -h --max-depth=1 $(ls *.jpg *.png 2> /dev/null) | sort -hr | while read size file; do
  if [[ -f "$file" ]]; then
    echo "$file $size $(file $file | grep -oE '[0-9]+ x [0-9]+')"
  fi
done
