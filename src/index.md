---
title: Homepage
layout: base.html
---

Hello, World!


<h3>Posts</h3>
{%- for post in collections.posts -%}
  <p><a href="{{ post.url | url }}">{{ post.data.title }}</a></p>
{%- endfor -%}