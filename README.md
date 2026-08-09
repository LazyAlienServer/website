# LASweb-v2

中文 | [English](README_en.md)

Lazy Alien Server（LAS）官方网站，LAS 是以学生群体为主的 Minecraft 技术交流社区。

## 网站内容

- LAS 社区介绍与技术交流方向
- 服务器成立时间与实时运行计时
- 物理机、内存、存储和网络基础设施展示
- LazyAlienServer GitHub 组织的开源项目
- 管理团队与成员信息
- 加入 LAS 的审核制、邀请制流程
- 独立的《LazyAlienServer 规章制度》页面

## 页面

- 首页：`/`
- 规章制度：`/rules`

在线访问：[beta-2.lzalien.org](https://beta-2.lzalien.org/)

## 技术栈

- Vue 3 Composition API
- TypeScript
- SCSS
- Vite+（Vite、Rolldown、Oxlint、Oxfmt、Vite Task 等统一工具链）
- Vue Router

## 本地开发

项目使用 Vite+ CLI 和锁定版本的 pnpm。

```bash
vp install
vp dev
```

生产构建、格式检查和 lint：

```bash
vp run build
vp fmt --check src/components/GithubProjects.vue
vp lint --deny-warnings
```

`vp run build` 会先执行 TypeScript 检查，再生成生产构建文件。开发服务器默认使用 Vite+ 的开发流程。

## 设计方向

网站采用蓝色、黑色和白色为核心的 neo-industrial / technological 视觉语言，使用网格、状态指示器、硬边面板、工业斜线、裁切角和克制动效。页面保留中文内容，并适配桌面、tablet 和 mobile 布局，同时尊重 `prefers-reduced-motion`。

## 相关链接

- [Lazy Alien Server 原官网](https://lzalien.org/)
- [LAS 规章制度原站](https://lzalien.org/rules/)
