const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const lodash = require("lodash");

module.exports = function(eleventyConfig) {

  console.log("env: '" + process.env.NODE_ENV + "'");
  if(process.env.NODE_ENV?.trim() === 'production'){
    console.log("prod-build");
  }else{
    console.log("dev-build");
  }

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
  eleventyConfig.addShortcode('respimg', (path, alt, sizes, className) => {
    const isProd = process.env.NODE_ENV === 'production';
    if(!isProd){
        return `<img loading="lazy" src="${path}" class="${className ? className : ''}" sizes="${sizes ? sizes : '100vw'}" alt="${alt ? alt : ''}">`;
    }
    const fetchBase = `https://res.cloudinary.com/${eleventyConfig.cloudinaryCloudName}/image/fetch/`;
    const src = `${fetchBase}q_auto,f_auto,w_${eleventyConfig.fallbackWidth}/https://gamue.github.io/playground-eleventy${path}`;
    const srcset = eleventyConfig.srcsetWidths.map(w => {
        return `${fetchBase}q_auto:eco,f_auto,w_${w}/${path} ${w}w`;
    }).join(', ');

    return `<img loading="lazy" src="${src}" srcset="${srcset}" class="${className ? className : ''}" sizes="${sizes ? sizes : '100vw'}" alt="${alt ? alt : ''}">`;
  });

    function getAllKeyValues(collectionArray, key) {
      // get all values from collection
      let allValues = collectionArray.map((item) => {
        let values = item.data[key] ? item.data[key] : [];
        return values;
      });

      // flatten values array
      allValues = lodash.flattenDeep(allValues);
      // to lowercase
      allValues = allValues.map((item) => item.toLowerCase());
      // remove duplicates
      allValues = [...new Set(allValues)];
      // order alphabetically
      allValues = allValues.sort(function (a, b) {
        return a.localeCompare(b, "en", { sensitivity: "base" });
      });
      // return
      return allValues;
    }

    function strToSlug(str) {
      return str.toLowerCase();
    }

  // create flattened paginated blogposts per categories collection
  // based on Zach Leatherman's solution - https://github.com/11ty/eleventy/issues/332
  eleventyConfig.addCollection("blogpostsByCategories", function (collection) {
    const itemsPerPage = 2;
    let blogpostsByCategories = [];
    let allBlogposts = collection
      .getFilteredByGlob("./src/posts/*.md")
      .reverse();
    let blogpostsCategories = getAllKeyValues(allBlogposts, "categories");

    // walk over each unique category
    blogpostsCategories.forEach((category) => {
      let sanitizedCategory = lodash.deburr(category).toLowerCase();
      // create array of posts in that category
      let postsInCategory = allBlogposts.filter((post) => {
        let postCategories = post.data.categories ? post.data.categories : [];
        let sanitizedPostCategories = postCategories.map((item) =>
          lodash.deburr(item).toLowerCase()
        );
        return sanitizedPostCategories.includes(sanitizedCategory);
      });

      // chunck the array of posts
      let chunkedPostsInCategory = lodash.chunk(postsInCategory, itemsPerPage);

      // create array of page slugs
      let pagesSlugs = [];
      for (let i = 0; i < chunkedPostsInCategory.length; i++) {
        let categorySlug = strToSlug(category);
        let pageSlug = i > 0 ? `${categorySlug}/${i + 1}` : `${categorySlug}`;
        pagesSlugs.push(pageSlug);
      }

      // create array of objects
      chunkedPostsInCategory.forEach((posts, index) => {
        blogpostsByCategories.push({
          title: category,
          slug: pagesSlugs[index],
          pageNumber: index,
          totalPages: pagesSlugs.length,
          pageSlugs: {
            all: pagesSlugs,
            next: pagesSlugs[index + 1] || null,
            previous: pagesSlugs[index - 1] || null,
            first: pagesSlugs[0] || null,
            last: pagesSlugs[pagesSlugs.length - 1] || null,
          },
          items: posts,
        });
      });
    });

    return blogpostsByCategories;
  });

  return {
    htmlTemplateEngine: "njk",
    dir: {
      input: 'src',
      output: '_site'
    },
  };
};