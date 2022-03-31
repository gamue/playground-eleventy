const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRespimg = require( "eleventy-plugin-respimg" );

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);

  let markdownIt = require("markdown-it");
  var markdownItAttrs = require('markdown-it-attrs');
  let options = {
    html: true,
    breaks: false,
    linkify: true
  };
  let markdownLib = markdownIt(options).use(markdownItAttrs);
  eleventyConfig.setLibrary("md", markdownLib);

  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.cloudinaryCloudName = 'gamue';
  eleventyConfig.srcsetWidths = [ 320, 640, 960, 1280];
  eleventyConfig.fallbackWidth = 800;
  eleventyConfig.addPlugin( pluginRespimg );

  return {
    dir: {
      input: 'src',
      output: '_site'
    },
  };
};