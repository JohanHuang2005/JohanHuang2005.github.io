# JH.github.io 个人主页

基于 Jekyll + Not Pure Poole 主题的个人主页项目。

## 技术栈

- **Jekyll** 静态站点生成器
- **Not Pure Poole** 主题（基于 Poole + Pure CSS）
- **Sass/SCSS** 样式
- **GitHub Pages** 部署

---

## 根目录结构

| 文件/目录 | 说明 |
|-----------|------|
| `_config.yml` | 站点配置（标题、描述、插件、作者等） |
| `index.html` | 首页（About Me 页面） |
| `404.html` | 404 错误页 |
| `Gemfile` / `Gemfile.lock` | Ruby 依赖 |
| `README.md` | 项目说明 |
| `LICENSE.md` | 许可证 |

---

## 核心目录

### `_layouts/` — 页面布局

- `default.html` — 默认布局（左中右三栏，含动态背景）
- `home.html` — 首页布局
- `home-about.html` — 首页 About 区域
- `page.html` — 普通页面
- `post.html` — 博客文章
- `archive-dates.html` — 按日期归档
- `archive-taxonomies.html` — 按分类/标签归档

### `_includes/` — 可复用片段

- `head.html` — 页面头部
- `sidebar-left.html` — 左侧栏（头像、导航等）
- `sidebar-right.html` — 右侧栏
- `content.html` — 主内容区
- `home-header.html` — 首页头部
- `toc.html` — 目录
- `scroll.html` — 滚动相关脚本
- `mathjax.html` — 数学公式
- `disqus.html` — 评论
- `google-analytics.html` — 统计
- `custom-head.html` — 自定义头部
- `post-tags.html` — 文章标签

### `_sass/` — 样式

- `_variables.scss` — 变量
- `_base.scss` — 基础样式
- `_type.scss` — 排版
- `_layout.scss` — 布局
- `_sidebar.scss` — 侧边栏
- `_posts.scss` — 文章
- `_archive.scss` — 归档
- `_home-header.scss` — 首页头部
- `_toc.scss` — 目录
- `_code.scss` — 代码高亮
- `_pagination.scss` — 分页
- `_message.scss` — 消息提示
- `_alignment.scss` — 对齐
- `_syntax-light.scss` / `_syntax-dark.scss` — 亮/暗色代码主题

### `_data/` — 数据配置

- `navigation.yml` — 导航（About、Blog）
- `social.yml` — 社交链接
- `archive.yml` — 归档配置
- `backgrounds.yml` — 背景配置

### `_posts/` — 博客文章

存放 Markdown 格式的博客文章。

### `assets/` — 静态资源

- `styles.scss` — 主样式入口，引入各 `_sass` 模块

---

## 其他页面

- `tags.md` — 标签页
- `categories.md` — 分类页
- `dates.md` — 日期归档页

---

## 脚本

- `scripts/serve` — 本地预览
- `scripts/publish` — 发布
- `scripts/draft` — 草稿

---

## 布局示意

```
┌─────────────────────────────────────────────────────────┐
│  default.html 布局                                       │
├──────────────┬────────────────────┬─────────────────────┤
│ sidebar-left │     content        │   sidebar-right     │
│ (头像/导航)   │   (主内容区)        │   (TOC 等)          │
│ 动态背景     │                    │                     │
└──────────────┴────────────────────┴─────────────────────┘
```

---

## 个人定制

- **标题**：Youhan's Homepage
- **作者**：Youhan Huang
- **研究方向**：3D 计算机视觉、点云理解、AI 应用
- **左侧栏**：20 张背景图轮播（`bg/1.jpg` ~ `bg/20.jpg`）
- **导航**：About（首页）、Blog

---

## 本地开发

```bash
bundle install
bundle exec jekyll serve
```

访问 `http://localhost:4000` 预览。
