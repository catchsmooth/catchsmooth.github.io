# smo*oth · AI 工具与开发资源精选

用 Astro、TypeScript 与原生 CSS 构建的中文静态资源导航。按开发任务整理 24 项 AI 资源、六个分类与三个学习专题，提供官方文档和开源仓库入口。内容在构建前整理为本地数据，无数据库或运行时接口依赖。

## 本地开发

使用 Node.js 24 与 npm。

```sh
npm ci
npm run dev
```

默认地址 http://127.0.0.1:4321。

```sh
npm run check
npm run build
npm run preview
```

输出在 `dist/`，支持目录 index.html 的静态服务器均可托管。

## 页面与内容维护

主导航为首页、工具、专题、关于。旧作品及其详情、记录与生活页保留原地址，从关于页或页脚进入。

- `src/data/resources.json`：资源数据。每项具有唯一 `id`、名称、简介、用途、一个主分类、标签、官网和资料核查日期；可选 `docs`、`repository` 与正整数 `featuredOrder`。精选按此顺序展示。分类标识为 `coding`、`agents`、`build`、`models`、`research`、`creative`；对应文案在 `src/data/categories.ts`。
- `src/content/guides/*.md`：专题正文与元数据。文件名决定详情 URL；`order` 决定顺序，`resources` 引用资源 ID，`checkedAt` 为资料核查日期。构建会校验重复资源 ID、字段格式及不存在的专题引用。
- `src/data/profile.ts`：个人资料与联系方式。旧作品和阅读摘要继续维护在 `src/content/projects/`、`src/content/notes/`；画廊在 `src/pages/life.astro`，全站设计规则在 `src/styles/global.css`。

新增资源时直接阅读官网、官方文档或官方仓库，核对名称、用途及入口后填写 `checkedAt`（`YYYY-MM-DD`）。文案说明适用任务和学习起点，不将编辑整理写成亲测体验，不提供未经核实的价格、排名或性能结论。内容随本地编辑和构建更新，不自动抓取。

工具页支持名称、简介、用途和标签的本地搜索，搜索与单选分类共同生效。`q` 与 `category` URL 参数保存状态，可分享、刷新并使用浏览器前进后退。无 JavaScript 时完整目录和分类锚点仍可浏览，增强筛选控件隐藏。首页搜索提交至工具页。

旧个人介绍与作品内容来自 https://codeai.host/en/about 、https://codeai.host/en/projects 和文章原文；AI 资源以各项标注的官方入口为来源。本站访问时不请求原站接口。

## 旧资源保留

旧图片、音乐原件保留在根目录 `img`、`media` 与 `logo.ico`，`public` 中保留同内容副本，发布后仍可通过 `/img/...`、`/media/...` 与 `/logo.ico` 访问。修改原件时同步 `public` 副本。`name.png` 与 `password.png` 为旧界面素材，保留但不展示。旧 `css`、`js` 为历史来源，新站不加载它们。

展示图片位于 `public/images`，使用 WebP。运行 `node scripts/optimize-images.mjs` 重新生成，脚本使用开发依赖 sharp，不更改原件。Manrope 随构建自托管，中文使用系统字体。生活页音乐须主动播放，切页即停止；无 JavaScript 时原图链接仍可使用。

## 本地验证

```sh
npx playwright install chromium
npm run check
npm run build
npm test
```

所有测试和回归检查均在本地执行。浏览器验证覆盖新旧静态页面、375／768／1024／1440px 布局、搜索与组合筛选、URL 状态与历史记录、无 JavaScript、减少动态效果，以及旧画廊、音乐和导航。截图输出到忽略的 `.local/screens/`，需同时打开检查实际排版、滚动与交互；构建或自动化测试不能代替界面检查。

## 发布准备

默认地址 https://catchsmooth.github.io 。更换域名需同步 astro.config.mjs 的 site 与 public/robots.txt 的 sitemap 地址。

仓库 Settings → Pages → Source 选择 GitHub Actions，然后在 Actions 中手动运行 `Deploy static site` 工作流，构建并发布 `dist`，不运行测试。源码推送不会自动发布网站；首次发布前需确认 Pages 权限与默认分支。
