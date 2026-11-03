---
layout: about
title: About
permalink: /

profile:
  align: right
  image: prof_pic.jpg
  image_circular: false # crops the image to make it circular
  social_icons: true # social icons right under the photo (see _layouts/about.liquid)

selected_papers: false # rendered manually in the page body below to keep the section order
social: false

announcements:
  enabled: false # rendered manually in the page body below to keep the section order
  scrollable: true
  limit:

latest_posts:
  enabled: false # blog is disabled
---

<style>
  .post article h4 {
    font-size: 1.15rem;
  }
</style>

Greetings! I am currently an LLM engineer at Preferred Networks. 
Previously, I worked at the National Institute of Information and Communications Technology with [Masao Utiyama](https://att-astrec.nict.go.jp/member/mutiyama/index.html).<br>
I received my Ph.D. in Informatics from Kyoto University in 2024, advised by Prof. [Sadao Kurohashi](https://www.nii.ac.jp/faculty/director/) and Prof. [Chenhui Chu](https://scholar.google.com/citations?user=6ef0qbgAAAAJ&hl=en).
I completed my Bachelor's degree in Computer Science and Technology at Shanghai Jiao Tong University in 2018, with a minor in Japanese.

My research interests are in large language models and natural language processing.
I primarily work on pre-, mid-, post-training methods for LLMs, including data crawling for low-resource languages, model merging, and reinforcement learning.
I persistently work on multilingual, multicultural, and multimodal aspects of natural language processing.
I periodically work on machine translation, tokenization, and language resources.

{% comment %} Old icon row under the intro text, hidden now that the icons sit under the photo (profile.social_icons above). Remove this line and the endcomment line to show it again.
<div class="about-links-row">
  {% comment %} [Publications] link is hidden (Google Scholar icon and top nav cover it); remove this comment wrapper to show it again.
  <a class="publications-link" href="/publications/"><b>[Publications]</b></a>
  {% endcomment %}
  <div class="social">
    <div class="contact-icons">{% social_links %}</div>
  </div>
</div>
{% endcomment %}

<div class="about-card" markdown="1">

## News

{% include news.liquid %}

</div>

{% comment %} Education is hidden for now; remove this line and the matching endcomment line to show it again.
<div class="about-card" markdown="1">

## Education

#### Kyoto University

Supervised by Prof. [Sadao Kurohashi](https://www.nii.ac.jp/faculty/director/) and Prof. [Chenhui Chu](https://scholar.google.com/citations?user=6ef0qbgAAAAJ&hl=en).

- Ph.D. in Informatics, _October 2020 - March 2024_
- Master in Intelligence Science and Technology, _October 2018 - September 2020_

#### Nagoya University

- Exchange student in NUPACE program, _October 2017 - February 2018_

#### Shanghai Jiao Tong University

Supervised by Prof. [Li Jiang](https://scholar.google.com/citations?user=wCxFd8YAAAAJ&hl=en).

- Bachelor of Computer Science and Technology, _September 2014 - July 2018_
- Minor in Japanese, School of Foreign Languages, _February 2015 - July 2018_

</div>

{% endcomment %}

{% comment %} Work Experience is hidden for now; remove this line and the matching endcomment line to show it again.
<div class="about-card" markdown="1">

## Work Experience

#### Preferred Networks

- Engineer, _April 2026 - present_
  - Post-train [PLaMo](https://plamo.preferredai.jp/), our Japanese LLM built from scratch.

#### National Institute of Information and Communications Technology (NICT)

- Technical researcher, _July 2023 - March 2026_
- Research internship, _October 2019 - June 2023_

#### JSPS

- Research Fellowship for Young Scientists (DC1), _April 2021 - June 2023_

#### Kyoto University

- Research assistant, _November 2020 - March 2021_

#### LINE

- Internship, machine learning team, _February 2019 - March 2019_ <!-- ([summary report](https://engineering.linecorp.com/ja/blog/line-sticker-deep-learning/)) -->

</div>

{% endcomment %}

<div class="about-card" markdown="1">

## Selected Publications

{% include selected_papers.liquid %}

</div>

<div class="about-card" markdown="1">

## Academic Service

- Website Chair: The design of the [EMNLP 2025 Website](https://2025.emnlp.org/organization/).
- Area Chair: ARR 2025, ARR 2026 March, ARR 2026 October.
- Workshop Co-organizer of WAT 2024, 2025, 2026. The English-Indic Language Document Translation Task at WAT 2025.
- Mentor: AACL 2020 Student Research Workshop.
- Award Selection Committee: ANLP (in Japan) 2026.
- Candidate for KAKENHI Review Committee Member 2026.
- Reviewer: JNLP 2026, EAMT 2026, TALLIP 2026, TASLP 2026, IEICE 2026, ARR 2026 August, ARR 2026 May, ARR 2026 January, LREC 2026, IJCNLP-AACL 2025, WAT 2025, EMNLP 2025, ACL 2025, COLING 2025, NLPCC 2024, TASLP 2024, AMTA 2024, LREC-COLING 2024, four rounds of ARR 2024, TALLIP 2024, TASLP 2023, TALLIP 2023, ARR 2023, APSIPA ASC 2023, EMNLP 2023, ACL 2023, EMNLP 2022, EMNLP 2021, EMNLP 2020, IJCNLP 2020, WAT 2020, etc.

</div>

<div class="about-card" markdown="1">

## Grants

<div class="publications no-previews">
{% bibliography --group_by none --query @*[category=grant] %}
</div>

Accepted application forms with notes in Japanese: [科研費（若手研究・学振）申請書の公開](/kakenhi/).

</div>

<div class="about-card" markdown="1">

## Tutorials

<div class="publications no-previews">
{% bibliography --group_by none --query @*[tutorial=true]* %}
</div>

</div>

{% comment %} Miscellaneous (talks) is hidden for now; remove this comment wrapper to show it again.
<div class="about-card" markdown="1">

## Miscellaneous

<div class="publications no-previews">
{% bibliography --group_by none --query @*[category=presentation] %}
</div>

</div>
{% endcomment %}

<div class="about-card" data-nosnippet markdown="1">

## My Hobbies

#### Sports

- Ski. Ski Association of Japan [Badge Test](https://snowjapanlicence.com/5-1test/) Level-2. The 26-27 season my home ski resort is [Takasu Mountains](https://www.takasumountains.com/).
- Marathon. Full course finisher of the [Kyoto Marathon 2023](https://2023.kyoto-marathon.com/en/index.html) and the [Biwako Marathon 2024](https://biwako-marathon.com/).
- Mountain climbing. <!-- Mt. Shirouma, Mt. Kita, Mt. Yake, Mt. Fuji, etc. -->

#### Japanese

- The Japanese Language Proficiency Test N1, the highest level, 2017.

#### Competitive Programming

- Silver medal at NOI 2013, the National Olympiad in Informatics, Chengdu, China.
- Bronze medal at APIO 2013, the Asia-Pacific Informatics Olympiad, Online.
- [AtCoder profile](https://atcoder.jp/users/shyyhs).

</div>
