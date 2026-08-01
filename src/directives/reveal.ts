import type { Directive } from 'vue'

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed')
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.1 }
)

/**
 * v-reveal — adds .reveal and fades the element in on first intersection.
 * Respects prefers-reduced-motion via global.scss.
 */
export const vReveal: Directive<HTMLElement> = {
  mounted(el) {
    el.classList.add('reveal')
    observer.observe(el)
  },
  unmounted(el) {
    observer.unobserve(el)
  }
}
