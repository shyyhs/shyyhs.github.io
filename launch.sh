docker run --rm -it \
  --platform linux/amd64 \
  -p 4001:4000 \
  --volume=$(pwd):/srv/jekyll \
  jekyll/jekyll \
  jekyll serve --livereload
