# Eleventy Playground

This is a play project to test and evaluate [Eleventy](https://www.11ty.dev/).

- Using GitHub Actions for deploying it to [GitHub pages](https://gamue.github.io/playground-eleventy/)
    - Using a `pathprefix` at the build as it's getting deployed in a subfolder
- Using [TailwindCSS](https://tailwindcss.com/) for styling
  - Including [TailwindCSS/Typography](https://tailwindcss.com/docs/typography-plugin)
- Using [eleventy-syntax-highlighting](https://www.11ty.dev/docs/plugins/syntaxhighlight/) plugin with [PrismJS Okaidia](https://prismjs.com/) theme
- Using [markdown-it-attrs](https://github.com/arve0/markdown-it-attrs) to be able to define css-classes in markdown, like in Kramdown at Jekyll

## How to run it locally
1) Install node
2) Install yarn
3) Run `yarn start`