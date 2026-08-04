<template>
  <section
    ref="container"
    class="under-footer-container"
    :style="{ height: footerHeight }"
    aria-label="LAZY ALIEN SERVER"
  >
    <div
      class="under-footer"
      :class="{ 'under-footer--visible': isVisible }"
      :style="{ clipPath, height: panelHeight, top: panelTop }"
    >
      <svg
        class="under-footer-title"
        :viewBox="titleViewBox"
        preserveAspectRatio="xMidYMax meet"
        role="img"
        aria-label="LAZY ALIEN SERVER"
      >
        <text ref="titleText" x="0" y="0">LAZY ALIEN SERVER</text>
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef, useTemplateRef } from "vue";

const container = useTemplateRef<HTMLElement>("container");
const titleText = useTemplateRef<SVGTextElement>("titleText");
const clipPath = shallowRef("inset(100% 0 0 0)");
const panelHeight = shallowRef("0px");
const panelTop = shallowRef("100vh");
const isVisible = shallowRef(false);
const titleViewBox = shallowRef("0 -220 1000 230");
const footerHeight = shallowRef("calc(7.95vw + 44.2px)");
const titleAspect = shallowRef(0.0795);
const getTitleMargin = () => (window.innerWidth <= 640 ? 8 : 24);
let frameId = 0;

const updateClip = () => {
  if (!container.value) return;

  const rect = container.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const visibleTop = Math.max(0, rect.top);
  const visibleBottom = Math.min(viewportHeight, rect.bottom);

  isVisible.value = rect.top < viewportHeight && rect.bottom > 0;

  if (!isVisible.value) {
    panelTop.value = "100vh";
    panelHeight.value = "0px";
    clipPath.value = "inset(100% 0 0 0)";
    return;
  }

  panelTop.value = `${visibleTop}px`;
  panelHeight.value = `${Math.max(0, viewportHeight - visibleTop)}px`;
  clipPath.value = `inset(0 0 ${Math.max(0, viewportHeight - visibleBottom)}px 0)`;
};

const updateTitleBounds = () => {
  if (!titleText.value) return;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return;

  context.font = '900 220px "Noto Sans SC"';
  const metrics = context.measureText("LAZY ALIEN SERVER");
  const left = -metrics.actualBoundingBoxLeft;
  const top = -metrics.actualBoundingBoxAscent;
  const width = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
  const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

  titleViewBox.value = `${left} ${top} ${width} ${height}`;
  titleAspect.value = height / width;
  const titleMargin = getTitleMargin();
  footerHeight.value = `${(window.innerWidth - titleMargin * 2) * titleAspect.value + titleMargin * 2}px`;
};

const onViewportChange = () => {
  cancelAnimationFrame(frameId);
  frameId = requestAnimationFrame(updateClip);
};

const onResize = () => {
  const titleMargin = getTitleMargin();
  footerHeight.value = `${(window.innerWidth - titleMargin * 2) * titleAspect.value + titleMargin * 2}px`;
  onViewportChange();
};

onMounted(() => {
  updateClip();
  void document.fonts.load('900 220px "Noto Sans SC"').then(() => {
    updateTitleBounds();
    onViewportChange();
  });
  window.addEventListener("scroll", onViewportChange, { passive: true });
  window.addEventListener("resize", onResize);
});

onUnmounted(() => {
  cancelAnimationFrame(frameId);
  window.removeEventListener("scroll", onViewportChange);
  window.removeEventListener("resize", onResize);
});
</script>

<style scoped lang="scss">
.under-footer {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 0;
  overflow: hidden;
  background: $color-primary-blue;
  opacity: 0;
  pointer-events: none;
  visibility: hidden;

  &--visible {
    opacity: 1;
    visibility: visible;
  }
}

.under-footer-container {
  position: relative;
  height: 14.52vw;
}

.under-footer-title {
  --title-margin: 24px;

  position: absolute;
  right: var(--title-margin);
  bottom: var(--title-margin);
  left: var(--title-margin);
  display: block;
  width: calc(100vw - var(--title-margin) * 2);
  height: auto;
  fill: $color-white;
}

@include mobile {
  .under-footer-title {
    --title-margin: 8px;
  }
}

.under-footer-title text {
  font-family: "Noto Sans SC", sans-serif;
  font-size: 220px;
  font-weight: 900;
  dominant-baseline: alphabetic;
}
</style>
