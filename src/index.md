---
title: Homepage
layout: base.njk
---

Hello, World!


<h3>Posts</h3>
{%- for post in collections.posts -%}
  <p><a href="{{ post.url | url }}">{{ post.data.title }}</a></p>
{%- endfor -%}