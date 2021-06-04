## Develop on the constellation (a.k.a. the graph)

```shell
cd ~/src/data-visualization-project-2021-datavizards/docs
python3 -m http.server 8888
```

You can then go to http://localhost:8888/index.dev.html to open the graph.

## Where is the code?

* JS: `docs/js/constellation*.js` (there are several files)
* CSS: `docs/_sass/constellation.scss`
* HTML: `docs/index.dev.html` (do not change anything in there -> Changes here won't be reflected in the main website)

## Develop on the site

```shell
cd ~/src/data-visualization-project-2021-datavizards/docs

# Requires ruby
#
# I would highly recommend installing a new ruby version via rbenv
#   -> https://github.com/rbenv/rbenv#installation
bundle

bundle exec jekyll serve

# Go to localhost:4000
```
