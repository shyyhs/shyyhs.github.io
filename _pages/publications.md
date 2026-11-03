---
layout: page
permalink: /publications/
title: Publications
nav: true
nav_order: 2
---

[Google Scholar](https://scholar.google.co.jp/citations?user=IP5UyqcAAAAJ&hl=en&sortby=pubdate) \| [ACL Anthology](https://www.aclweb.org/anthology/people/h/haiyue-song/) \| [DBLP](https://dblp.org/pers/s/Song:Haiyue.html) \| [ResearchGate](https://www.researchgate.net/profile/Haiyue_Song)

<!-- Bibsearch Feature -->

{% include bib_search.liquid %}

<div class="publications no-previews">

  <h2 class="bibliography-section">Journal Articles</h2>

  {% bibliography --group_by none --query @*[category=journal] %}

  <h2 class="bibliography-section">International Conferences</h2>

  {% bibliography --group_by none --query @*[category=conference] %}

  <h2 class="bibliography-section">Domestic Conferences (non peer-reviewed)</h2>

  {% bibliography --group_by none --query @*[category=domestic] %}

  <h2 class="bibliography-section">Preprints</h2>

  {% bibliography --group_by none --query @*[category=preprint] %}

</div>
