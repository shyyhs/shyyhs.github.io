---
layout: about
title: About
permalink: /

profile:
  align: right
  image: prof_pic.jpg
  image_circular: false # crops the image to make it circular

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

Haiyue Song is an LLM engineer at [Preferred Networks](https://www.preferred.jp/en/), working on
post-training. Previously, he worked at the
[National Institute of Information and Communications Technology](https://www.nict.go.jp/en/).
He received his Ph.D. in Informatics from Kyoto University in 2024 under the supervision of
Prof. [Sadao Kurohashi](https://www.nii.ac.jp/faculty/director/).

His current research focuses on large language models, including agent harness, long-context,
reinforcement learning, and continual pre-training. Previously, he worked on machine
translation, especially in low-resource, multilingual, and multimodal scenarios.

<div class="about-links-row">
  <a class="publications-link" href="/publications/"><b>[Publications]</b></a>
  <div class="social">
    <div class="contact-icons">{% social_links %}</div>
  </div>
</div>

<div class="about-card" markdown="1">

## News

{% include news.liquid %}

</div>

<div class="about-card" markdown="1">

## Education

#### Kyoto University

Supervised by Prof. [Sadao Kurohashi](https://www.nii.ac.jp/faculty/director/) and Prof. [Chenhui Chu](https://researchmap.jp/chu/?lang=english).

- Ph.D. in Intelligence Science and Technology, _October 2020 - March 2024_
- Master in Intelligence Science and Technology, _October 2018 - September 2020_

#### Shanghai Jiao Tong University

Supervised by Prof. [Li Jiang](https://scholar.google.com/citations?user=wCxFd8YAAAAJ&hl=en).

- Bachelor of Computer Science and Technology, _September 2014 - July 2018_
- Minor in Japanese, School of Foreign Languages, _February 2015 - July 2018_

#### Nagoya University

- Exchange student, _October 2017 - February 2018_

</div>

<div class="about-card" markdown="1">

## Work Experience

#### Preferred Networks

- Engineer, _April 2026 - present_

#### National Institute of Information and Communications Technology (NICT)

- Technical researcher, _July 2023 - March 2026_
- Research internship, _October 2019 - June 2023_

#### JSPS

- [Research Fellowship for Young Scientists](https://www.jsps.go.jp/english/e-pd/) (DC1), _April 2021 - June 2023_

#### Kyoto University

- Research assistant, _November 2020 - March 2021_

#### LINE

- Internship, machine learning team, _February 2019 - March 2019_ <!-- ([summary report](https://engineering.linecorp.com/ja/blog/line-sticker-deep-learning/)) -->

</div>

<div class="about-card" markdown="1">

## Selected Publications

{% include selected_papers.liquid %}

**[Full publication list](/publications/)**

</div>

<div class="about-card" markdown="1">

## Academic Service

- Area Chair: ARR 2025, ARR 2026 March.
- Website Chair: [EMNLP 2025](https://2025.emnlp.org/).
- Candidate for KAKENHI Review Committee Member 2026.
- Co-organizer: [WAT 2024](https://lotus.kuee.kyoto-u.ac.jp/WAT), and the [English-Indic Language Document Translation Task](https://sites.google.com/view/indic-doc/) at [WAT 2025](http://orchid.kuee.kyoto-u.ac.jp/WAT/WAT2025/index.html).
- Mentor: AACL 2020 Student Research Workshop.
- Award Selection Committee: ANLP (in Japan) 2026.
- Reviewer: JNLP 2026, EAMT 2026, TALLIP 2026, TASLP 2026, IEICE 2026, ARR 2026 May, ARR 2026 January, LREC 2026, IJCNLP-AACL 2025, WAT 2025, EMNLP 2025, ACL 2025, COLING 2025, NLPCC 2024, TASLP 2024, AMTA 2024, LREC-COLING 2024, four rounds of ARR 2024, TALLIP 2024, TASLP 2023, TALLIP 2023, ARR 2023, APSIPA ASC 2023, EMNLP 2023, ACL 2023, EMNLP 2022, EMNLP 2021, EMNLP 2020, IJCNLP 2020, WAT 2020, etc.
- One patent application in progress.

</div>

<div class="about-card" data-nosnippet markdown="1">

## Hobbies

#### Competitive Programming

- Silver medal at the National Olympiad in Informatics (NOI) 2013, Chengdu, China.
- Bronze medal at the Asia-Pacific Informatics Olympiad (APIO) 2013.
- AtCoder [profile](https://atcoder.jp/users/shyyhs).

#### Japanese

- Passed the Japanese Language Proficiency Test N1 (the highest level) in 2017.

#### Sports

- Ski (current focus). Ski Association of Japan (SAJ) [Badge Test](https://snowjapanlicence.com/5-1test/) Level-2. This winter (26-27) my home ski resort will be [Takasu Mountains](https://www.takasumountains.com/).
- Marathon. Finisher of the full course of the [Kyoto Marathon 2023](https://2023.kyoto-marathon.com/en/index.html) and the [Biwako Marathon 2024](https://biwako-marathon.com/).
- Mountain climbing. [Mt. Shirouma](https://en.wikipedia.org/wiki/Mount_Shirouma), [Mt. Kita](https://en.wikipedia.org/wiki/Mount_Kita), [Mt. Yake](https://en.wikipedia.org/wiki/Mount_Yake), Mt. Fuji, etc.

</div>

{% if site.visitor_map.enabled %}
  {% include visitor_map.liquid %}
{% endif %}
