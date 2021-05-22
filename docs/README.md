## Develop on the graph

```shell
cd ~/src/data-visualization-project-2021-datavizards/docs
python3 -m http.server 8888
```

You can then go to http://localhost:8888/index.dev.html to open the graph.

## Where is the code?

* JS: `docs/js/constellation.js`
* CSS: `docs/css/` (`constellation.css`/`main.scss`/...)
* HTML: `docs/_includes_/*.html`


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

## Where is the code?

* JS: `docs/js/constellation.js`
* CSS: `docs/css/` (`constellation.css`/`main.scss`/...)
* HTML: `docs/_includes_/*.html`
