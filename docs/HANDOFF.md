# shyyhs.github.io 维护手册（Handoff）

> 面向未来的自己：这份文档描述主页现在的架构、每个部件在哪、以及"我想改 X 该动哪个文件"。
> 最后核对日期：2026-08-11。当前 `_config.yml`、`papers.bib` 里的数字若与本文不符，以仓库为准。

---

## 0. 三十秒速览

- **线上**：<https://shyyhs.github.io>（GitHub Pages）
- **技术栈**：Jekyll + [al-folio](https://github.com/alshedivat/al-folio) 主题 **v0.16.3**（Bootstrap 系，刻意未升 v1.x 的 Tailwind 重写版）
- **两个页面**：`/`（About 单页大而全）和 `/publications/`（六节论文列表）
- **部署**：`git push origin master` → GitHub Actions 自动构建 → 发布到 `gh-pages` 分支 → 上线（约 2 分钟）
- **访客统计**：GoatCounter 隐私友好计数（不在页面公开展示）
- **本地预览**：见第 6 节，三行命令

---

## 1. 架构总图

```
你 push 到 master
   │
   ▼
.github/workflows/deploy.yml  (Ruby 3.3.5, jekyll build, PurgeCSS)
   │
   ▼
gh-pages 分支 (构建产物)  ──►  GitHub Pages 发布  ──►  https://shyyhs.github.io
                                                          │
访客浏览器 ◄──────────────────────────────────────────────┘
   │  加载 gc.zgo.at/count.js（GoatCounter 计数脚本）
   ▼
GoatCounter (shyyhs.goatcounter.com) 记录访问数据
```

两个分支各司其职，**只有 master 需要你动**：

| 分支 | 谁写 | 内容 |
|---|---|---|
| `master` | 你 | 源码 |
| `gh-pages` | deploy 工作流 | 构建产物，别手动碰 |

---

## 2. 目录地图（只列你会碰的）

```
_config.yml                 站点总配置（姓名、主题开关、GoatCounter、scholar 设置）
_pages/about.md             首页全部正文（bio、News、Education、Work、Selected、Service、Hobbies）
_pages/publications.md      论文页：六个 {% bibliography --query %} 区块
_pages/news.md              /news/ 归档页（stock，一般不动）
_bibliography/papers.bib    ★ 全部论文（60 条），每条带 category 字段
_news/announcement_N.md     首页 News 条目（7 条），文件名无所谓，按 date 排序
_data/socials.yml           首屏五个社交图标（顺序 = 显示顺序）
_data/coauthors.yml         合作者主页链接（35 人），论文页作者名可点
_layouts/about.liquid       首页布局（改过：标题右侧小字 CJK 名、subtitle 条件化、.about-profile）
_layouts/bib.liquid         单条论文的渲染模板（stock，改字段展示逻辑才动）
_includes/scripts.liquid    改过：加了 GoatCounter 计数脚本
_sass/_themes.scss          ★ 明暗两套主题色变量
_sass/_base.scss            改过一处：作者链接虚线颜色
assets/css/main.scss        ★ 所有自定义样式（字体、卡片、图标色…）都追加在这里
assets/js/theme.js          改过：明暗切换只留两档
assets/img/prof_pic.jpg     头像（800px）
assets/img/favicon.ico      网站图标
assets/img/publication_preview/  Selected 论文的预览图（10 张 PNG）
files/                      ★ 旧站遗留的 PDF/slides/bib.txt，URL 对外稳定，勿移动勿改名
.github/workflows/deploy.yml         部署
docs/HANDOFF.md             本文
```

`_site/`、`vendor/`、`.jekyll-cache/` 是构建产物/依赖，已 gitignore。

---

## 3. 论文系统（改动最频繁的地方）

### 3.1 数据模型

单一 `_bibliography/papers.bib`，**按时间倒序**（新论文加在文件顶部）。每条在标准 BibTeX 字段之外可带 al-folio 扩展字段：

| 字段 | 作用 | 备注 |
|---|---|---|
| `category={...}` | **必填**，决定进论文页哪一节 | `preprint` / `conference` / `journal` / `domestic` / `grant` / `presentation` |
| `abbr={NeurIPS}` | 左侧 venue 徽章文字 | 用会议官方简称，2025 的 AACL 写 `IJCNLP-AACL` |
| `selected={true}` | 上首页 Selected Publications | 显示顺序 = 文件顺序 |
| `preview={xxx.png}` | 首页 Selected 的配图 | 图放 `assets/img/publication_preview/`；论文页统一不显示图 |
| `bibtex_show={true}` | 显示 Bib 按钮 | 弹窗里自动隐藏 category 等内部字段 |
| `html={URL}` | HTML 按钮 | 一般填 ACL Anthology 页 |
| `doi`, `arxiv={2603.28858}` | DOI / arXiv 按钮 | arxiv 只填 ID |
| `pdf`, `slides`, `poster`, `supp` | 各自按钮 | 本地文件用 `../../files/X.pdf` 形式（见 3.3） |
| `code={URL}`, `website={URL}` | Code / Website 按钮 | 原样输出 |
| `award={...}`, `award_name={Oral}` | 奖项徽章 + 悬停说明 | award 支持 markdown 链接 |
| `additional_info={, acceptance rate 19%}` | 追加在 venue 行末尾 | 记得前面带逗号空格 |
| `accepted={true}` | venue 行显示 "Accepted to {booktitle}" 而非 "In {booktitle}" | 用于已录用未出 proceedings 的论文，此时 booktitle 写短名（如 `EMNLP 2026 Main`）；正式出版后删掉此字段并换官方 bib |
| `annotation={...}` | 作者行末尾的 ⓘ 图标 | 用于"作者按字母序"这类说明 |

**六个分节**由 `_pages/publications.md` 里六个 `{% bibliography --query @*[category=xxx] %}` 驱动，节内再按年份分组。想加第七类：bib 里用新 category 值 + publications.md 加一个区块 + `_config.yml` 的 `filtered_bibtex_keywords` 里已含 `category` 不用动。

### 3.2 加一篇新论文（标准流程）

1. 去 ACL Anthology / arXiv / DBLP 复制**官方 BibTeX**（作者名、页码以官方为准，不要手打）
2. 粘到 `papers.bib` **顶部**（对应年份注释块下）
3. 加 `category`、`abbr`、`bibtex_show={true}`，按需加 `html`/`arxiv`/`code`
4. 若上首页：加 `selected={true}` + 做一张预览图（3.4）
5. 本地预览确认 → push

### 3.3 三个 BibTeX 坑（都踩过）

- **URL 里的 `~` 必须写成 `%7E`**：BibTeX 把 `~` 当不换行空格，链接会变成 `%C2%A0` 而 404
- **本地 PDF 路径写 `../../files/X.pdf`**：al-folio 会给非 URL 值加 `/assets/pdf/` 前缀，`../../` 抵消后浏览器归一化回 `/files/X.pdf`，不用复制文件
- **中日文作者名用花括号整体包住**：`author={{宋 海越} and {田中 英輝}}`，否则 BibTeX 会按"姓, 名"拆分乱序。已知代价：CJK 名不触发自己名字的斜体高亮（接受）

### 3.4 做预览图（Selected 论文配图）

之前的做法：下载论文 PDF → `pdftoppm -r 300` 渲染目标页 → 按 Figure 1 边界裁剪 → 宽度缩到 ≤1400px PNG（50-350KB）。工具：`brew install poppler`。图名随意，bib 里 `preview={图名.png}` 对上即可。

### 3.5 合作者链接

`_data/coauthors.yml`：key 是**小写姓**，`firstname` 列表要能匹配 bib 里的写法，`url` 优先个人主页、其次 Google Scholar。同姓不同人（如 Mao）在同一 key 下列多个条目。样式：正文色 + 灰色虚线，悬停变主题色（故意不用主题色，避免满屏绿）。

注意 `_config.yml` 的 `max_author_limit: 8`：超过 8 位作者的论文会折叠成"and N more authors"，被折叠的作者不显示链接（CVQA 76 人那种就这样，正常）。

---

## 4. 首页（about.md）

- **结构**：bio 两段 → `[Publications]` 链接 + 五个社交图标同排 → 六张 `.about-card` 卡片（News / Education / Work Experience / Selected Publications / Academic Service / Hobbies）
- **News**：一条一个文件放 `_news/`，front matter 只要 `date`（决定顺序，新的在上）和 `inline: true`，正文一句话，支持 markdown 链接和 `**加粗**`
- **Selected Publications** 是 `{% include selected_papers.liquid %}` 自动生成的，不要手写
- **社交图标**：`_data/socials.yml`，key 名见 [jekyll-socials 文档](https://github.com/george-gca/jekyll-socials)；图标品牌色在 `main.scss` 的 `.contact-icons` 块
- **标题右侧的 宋海越**：`_config.yml` 的 `cjk_name`，样式 `.post-title-cjk`
- 卡片标题字号、卡片阴影等在 `main.scss` 的 `.about-card` 块

---

## 5. 主题与样式

| 想改 | 动哪里 |
|---|---|
| 白天主题色（现橄榄绿 `#689f38`） | `_sass/_themes.scss` 第 13 行附近 `--global-theme-color` 和 `--global-hover-color` |
| 夜间主题色（现天蓝 `#95daf3`） | 同文件 `html[data-theme="dark"]` 块里同名变量 |
| 字体（现 Spectral 衬线） | `_config.yml` → `third_party_libraries.google_fonts.url.fonts` 换字体族；`main.scss` 顶部 `font-family` 一处 |
| 明暗切换行为 | `assets/js/theme.js`（已改成只有 light/dark 两档，首访跟随系统） |
| 任何新样式 | 追加到 `assets/css/main.scss` 末尾，别改 `_sass/` 里的主题文件（升级主题时好合并） |

`main.scss` 现有块速查：字体 → 论文页隐藏预览图 → 图标品牌色 → 头像宽度 → CJK 标题 → 链接行 → 徽章阴影 → 作者链接 → 卡片。

---

## 6. 本地预览与部署

### 6.1 本地（一次性准备）

```bash
brew install ruby@3.3
cd /Users/song/git/shyyhs.github.io
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"
export BUNDLE_USER_HOME=/Users/song/.bundle-user   # ~/.bundle 被 root 占用，绕开
bundle config set --local path vendor/bundle
bundle install
```

### 6.2 本地（每次）

```bash
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH" BUNDLE_USER_HOME=/Users/song/.bundle-user LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8
bundle exec jekyll serve          # http://127.0.0.1:4000
```

- **UTF-8 环境变量必须有**：否则 papers.bib 里的日文会让 bibtex-ruby 报 `invalid byte sequence in US-ASCII`
- 想看生产构建：`JEKYLL_ENV=production bundle exec jekyll build`
- 本地 GoatCounter 不计数（脚本自动跳过 localhost）

### 6.3 部署

```bash
git add -A && git commit -m "..." && git push origin master
```

然后 `gh run watch` 看进度（约 2 分钟）。**不需要再动任何 GitHub 设置**（Actions 写权限、Pages 源 = gh-pages 都已配好）。

排错：Actions 页红叉 → 点进去看 `Install and Build` 步骤的日志，九成是 bib 语法错（少个逗号/花括号）或 Liquid 语法错。本地先 `bundle exec jekyll build` 能复现。

---

## 7. 访客统计

GoatCounter 计数脚本位于 `_includes/scripts.liquid`，由 `_config.yml` 的
`goatcounter_code: shyyhs` 开关。统计结果不会在主页公开展示，可登录
<https://shyyhs.goatcounter.com> 查看。清空 `goatcounter_code` 即可关闭统计。

中国大陆和启用广告拦截器的访客可能无法加载 GoatCounter 脚本，因此后台数字仅供参考。

---

## 8. 常见改动速查

| 我想… | 做法 |
|---|---|
| 加论文 | 3.2 |
| 加/改 News | `_news/` 加文件（复制一个现有的改 date 和正文） |
| 改 bio / 经历 / 服务 / 爱好 | 直接编辑 `_pages/about.md` 对应卡片 |
| 换头像 | 覆盖 `assets/img/prof_pic.jpg`（建议 800px 宽，`sips -Z 800 in.jpg --out prof_pic.jpg`） |
| 改邮箱 / 加社交图标 | `_data/socials.yml` |
| 加合作者链接 | `_data/coauthors.yml` |
| 换主题色 / 字体 | 第 5 节 |
| 加一个新页面（如 CV） | `_pages/xxx.md` 加 `nav: true` + `nav_order`，自动进导航栏 |
| 改论文页分节名/顺序 | `_pages/publications.md` 的六个 `<h2>` + query 顺序 |
| 论文页也显示预览图 | 删掉 `main.scss` 里 `.publications.no-previews .abbr figure { display: none }` |
| 恢复"跟随系统"的第三种主题模式 | 回滚 `assets/js/theme.js` 到 al-folio 原版 |
| 升级 al-folio | 别直接升 v1.x（架构不同）；v0.16.x 小版本用 `git diff` 对比上游后手动合并 `_sass`/`_layouts`/`_includes`，自定义都在 `main.scss` 和 about.md 里，冲突面小 |

---

## 9. 历史与备份

- 2026-08-09 从 academicpages 主题原地迁移到 al-folio，git 历史保留；迁移前整仓备份在 `/Users/song/shyyhs.github.io.backup-20260809`（稳定后可删）
- 旧站的 `/files/*` 深链接和 `/about/`、`/about.html` 均保持可访问（后两者是静态跳转页 `_pages/redirect-about-*.html`）
- 论文数据经 ACL Anthology 官方 bib / DBLP / arXiv API 逐条核对过（2026-08-09），以后新增请沿用"复制官方 bib"的习惯
