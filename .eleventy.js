module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("./src/styles/");
    eleventyConfig.addWatchTarget("./src/styles/");

  return {
    dir: {
      input: 'src',
      output: '_site'
    },
  };
};