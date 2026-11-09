# anparasanesan.github.io

Personal portfolio of **Anparasanesan Tharmarajah**, Senior Full-Stack Developer (Laravel, Vue.js, React, Python) based in Dudley, UK.

Live at **https://anparasanesan.github.io**

## What's inside

```
index.html                      the whole page (all content lives here)
404.html                        "page not found" page
assets/css/style.css            styles, light + dark theme
assets/js/main.js               dot network, theme toggle, typing effect, shell, blog filter
assets/img/favicon.svg          browser tab icon
assets/Anparasanesan_Tharmarajah_CV.pdf
```

Plain HTML, CSS and JavaScript: no framework and no build step. GitHub Pages serves the files as they are.

## Editing

| To change… | Edit… |
|---|---|
| Skill percentages | `index.html`, the `.bar` rows: change both `--v: 95%` and the `<b>95%</b>` |
| Radar chart | the `<polygon class="r-val">` points in `index.html` (ask Claude to regenerate) |
| Tools list | the `<ul class="chips">` lists under "The full stack" |
| Jobs, projects, research | the matching `<section>` in `index.html` |
| Colours | the variables at the top of `assets/css/style.css` |
| Shell commands | the `commands` object in `assets/js/main.js` |
| CV | replace `assets/Anparasanesan_Tharmarajah_CV.pdf` (keep the same file name) |

## Publishing a change

```
git add .
git commit -m "Describe the change"
git push
```

GitHub Pages republishes within a minute or two.
