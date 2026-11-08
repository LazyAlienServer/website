<template>
  <footer class="footer-section">
    <div class="footer-inner">
      <div class="footer-main">
        <div class="footer-brand">
          <router-link to="/" class="footer-logo" aria-label="Lazy Alien Server 首页">
            <span class="footer-logo-mark" :style="{ '--logo': `url('${logoUrl}')` }"></span>
            <span class="footer-logo-name">LAZY ALIEN SERVER</span>
          </router-link>
          <p class="footer-about">
            以学生群体为主的技术交流向 Minecraft 服务器。<br />
            我们充分鼓励技术探索与交流，并欢迎有能力的玩家加入。
          </p>
        </div>

        <nav
          v-for="column in columns"
          :key="column.title"
          class="footer-column"
          :aria-label="column.title"
        >
          <p class="footer-column-title">{{ column.title }}</p>
          <ul>
            <li v-for="link in column.links" :key="link.href">
              <a
                class="footer-link"
                :href="link.href"
                v-bind="link.href.startsWith('mailto:') ? {} : external"
              >
                <span>{{ link.text }}</span>
                <span class="footer-link-detail">{{ link.detail }}</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div class="footer-bar">
        <dl class="footer-credits">
          <div v-for="credit in credits" :key="credit.key">
            <dt>{{ credit.key }}</dt>
            <dd>{{ credit.value }}</dd>
          </div>
        </dl>
        <p class="footer-meta">
          <span>© 2022-{{ year }} Lazy Alien Server</span>
          <span>All Rights Reserved.</span>
          <span>v2.0</span>
        </p>
      </div>
    </div>

    <div class="footer-wordmark">
      <div class="footer-wordmark-panel">
        <svg viewBox="0 0 1500 150" role="img" aria-label="LAZY ALIEN SERVER">
          <text x="0" y="125" textLength="1500" lengthAdjust="spacingAndGlyphs">
            LAZY ALIEN SERVER
          </text>
        </svg>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import logoUrl from "@/assets/logo.svg";

interface FooterLink {
  text: string;
  detail: string;
  href: string;
}

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "联系我们",
    links: [
      { text: "GitHub", detail: "LazyAlienServer", href: "https://github.com/LazyAlienServer" },
      { text: "BiliBili", detail: "tanh丶桁", href: "https://space.bilibili.com/454721668" },
      { text: "QQ 群", detail: "835047145", href: "https://qm.qq.com/q/32DhVd36iI" },
      { text: "Email", detail: "contact@lzalien.org", href: "mailto:contact@lzalien.org" },
    ],
  },
  {
    title: "友情链接",
    links: [
      { text: "GTMC", detail: "techmc.wiki", href: "https://techmc.wiki" },
      { text: "TUT", detail: "tutserver.top", href: "https://tutserver.top" },
    ],
  },
];

const credits = [
  { key: "官网设计", value: "tanh_Heng" },
  { key: "技术支持", value: "LAS Dev Team" },
];

const external = { target: "_blank", rel: "noopener noreferrer" };
const year = new Date().getFullYear();
</script>

<style scoped lang="scss">
// Closing block on the shell's 12-column grid, dark in both themes (in light
// it closes the page like the Endfield footer, brand ink in yellow). The main
// row is a set of cells: the brand on columns 1–6, then two link columns (3
// each) opened by split lines that run the row's full height. A hairline
// closes the row; under it the bar carries the credits and the legal line.
.footer-section {
  @include dark-surface;
  background: $color-bg;
  border-top: 1px solid $color-line;
  position: relative;

  // short accent at the top edge, matching the rules chapters' dividers
  &::before {
    content: "";
    position: absolute;
    top: -1px;
    left: 0;
    width: 160px;
    height: 4px;
    background: $color-accent-ink-deep;
  }
}

.footer-inner {
  max-width: $content-max-width;
  margin: 0 auto;
  padding: 0 $spacing-md;
}

// ---------- Main row: ruled cells ----------
// No row padding: each cell pads itself, so the column rules reach from the
// footer's top edge to the closing hairline.
.footer-main {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: $spacing-md;
  border-bottom: 1px solid $color-line;
}

.footer-brand,
.footer-column {
  min-width: 0;
  padding-block: $spacing-lg;
}

.footer-brand {
  grid-column: 1 / 7;
  padding-right: $spacing-lg;
}

.footer-logo {
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;

  &:focus-visible {
    outline: 2px solid $color-accent-ink;
    outline-offset: 4px;
  }
}

// The logo file is white-filled, so it is used as a mask over brand ink
// (blue in dark, yellow on this dark surface in light).
.footer-logo-mark {
  flex: none;
  width: 48px;
  aspect-ratio: 97 / 73;
  background: $color-accent-ink;
  mask: var(--logo) center / contain no-repeat;
}

.footer-logo-name {
  font-family: $font-display;
  font-size: $font-size-h4;
  font-weight: $font-weight-bold;
  line-height: 1;
  white-space: nowrap;
  color: $color-fg;
}

.footer-about {
  max-width: 28em;
  margin-top: $spacing-lg;
  font-size: $font-size-small;
  line-height: 1.8;
  color: $color-fg-muted;
}

.footer-column {
  grid-column: span 3;
  padding-left: $spacing-md;
  border-left: 1px solid $color-line;

  // Two tracks shared by every row: names, then values. The name track is as
  // wide as the longest name, so all values start on one line.
  ul {
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
    gap: 12px $spacing-sm;
    list-style: none;
  }

  li {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
  }
}

// small accent square before the title, the sheet's index mark
.footer-column-title {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  margin-bottom: $spacing-md;
  font-size: $font-size-small;
  color: $color-fg-subtle;

  &::before {
    content: "";
    flex: none;
    width: 6px;
    height: 6px;
    background: $color-accent-ink;
  }
}

// one row per link, laid on the list's tracks: name, then value
.footer-link {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  align-items: baseline;
  font-size: $font-size-small;
  font-weight: $font-weight-medium;
  color: $color-fg;
  transition: color $transition-fast;

  &:hover {
    color: $color-accent-ink;

    .footer-link-detail {
      color: inherit;
    }
  }

  &:focus-visible {
    outline: 2px solid $color-accent-ink;
    outline-offset: 2px;
  }
}

.footer-link-detail {
  min-width: 0;
  font-size: $font-size-label;
  font-weight: $font-weight-regular;
  color: $color-fg-subtle;
  overflow-wrap: anywhere;
  transition: color $transition-fast;
}

// ---------- Bar: credits at the left, legal line at the right ----------
.footer-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: $spacing-lg;
  row-gap: $spacing-sm;
  padding-block: $spacing-lg;
  font-size: $font-size-label;
  color: $color-fg-subtle;
}

.footer-credits {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs $spacing-md;

  div {
    display: flex;
    gap: 6px;
  }

  dd {
    color: $color-fg-muted;
  }
}

.footer-meta {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs $spacing-md;
  margin-left: auto;
  font-variant-numeric: tabular-nums;
}

// ---------- Closing wordmark ----------
.footer-wordmark {
  --wordmark-inline: 24px;
  --wordmark-block: 16px;

  // Reserve the SVG's 10:1 aspect ratio plus padding. The clip reveals only
  // the portion of the fixed panel intersecting this normal-flow slot.
  height: calc((100vw - 2 * var(--wordmark-inline)) / 10 + 2 * var(--wordmark-block));
  clip-path: inset(0);

  svg {
    display: block;
    width: 100%;
    height: auto;
    fill: $color-on-accent;
  }

  text {
    font-family: "Noto Sans SC", sans-serif;
    font-size: 150px;
    font-weight: $font-weight-black;
  }
}

.footer-wordmark-panel {
  position: fixed;
  inset: auto 0 0;
  padding: var(--wordmark-block) var(--wordmark-inline);
  background: $color-accent;
  pointer-events: none;
}

// ---------- Responsive ----------
// tablet: the brand takes the full row; the link columns split the row under
// it, ruled across the top, the first one without a left rule
@include tablet {
  .footer-brand {
    grid-column: 1 / -1;
    padding-right: 0;
  }

  .footer-column {
    grid-column: span 6;
    padding-block: $spacing-md $spacing-lg;
    border-top: 1px solid $color-line;

    &:first-of-type {
      padding-left: 0;
      border-left: 0;
    }
  }
}

@include mobile {
  .footer-inner {
    padding-inline: $spacing-sm;
  }

  // the brand keeps the logo and name only
  .footer-about {
    display: none;
  }

  .footer-column {
    grid-column: 1 / -1;
    padding-left: 0;
    border-left: 0;

    // two links per row, each its name over its value, to save height
    ul {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: $spacing-sm $spacing-md;
    }

    li {
      display: block;
      grid-column: auto;
    }
  }

  .footer-link {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  // Fixed two-line legal block instead of free wrapping, which left the
  // version alone on a third line: copyright over the rights notice at the
  // left, the version pinned to the top right.
  .footer-meta {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 4px $spacing-md;
    width: 100%;
    margin-left: 0;

    span:last-child {
      grid-column: 2;
      grid-row: 1;
    }
  }

  .footer-wordmark {
    --wordmark-inline: 8px;
    --wordmark-block: 8px;
  }
}
</style>
