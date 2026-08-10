# shyyhs.github.io

Personal academic homepage of Haiyue Song — <https://shyyhs.github.io>

Built with [Jekyll](https://jekyllrb.com/) and the [al-folio](https://github.com/alshedivat/al-folio) theme (v0.16.3).

## Structure

- `_pages/about.md` — the single-page bio (news, education, experience, service, hobbies)
- `_bibliography/papers.bib` — all publications; each entry carries a `category` field
  (`preprint` / `journal` / `conference` / `domestic` / `grant` / `presentation`) that drives
  the sections on `_pages/publications.md`
- `_news/` — news items shown on the homepage
- `files/` — papers, slides, and BibTeX files (URLs kept stable across the theme migration)

## Local development

```bash
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"  # Homebrew Ruby 3.3 (keg-only)
bundle config set --local path vendor/bundle
bundle install
bundle exec jekyll serve  # http://127.0.0.1:4000
```

## Deployment

Pushing to `master` triggers `.github/workflows/deploy.yml`, which builds the site and
publishes it to the `gh-pages` branch (GitHub Settings → Pages → deploy from `gh-pages`).
