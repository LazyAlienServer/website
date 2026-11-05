import { readonly, shallowRef } from "vue";

export type Theme = "dark" | "light";

// The bootstrap script in `index.html` applies the theme before first paint
// with the same key and rules; keep the two in step.
const STORAGE_KEY = "las-theme";
const systemLight = window.matchMedia("(prefers-color-scheme: light)");

const stored = (): Theme | null => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
};

const current = shallowRef<Theme>(
  document.documentElement.dataset.theme === "light" ? "light" : "dark",
);

const apply = (value: Theme): void => {
  current.value = value;
  document.documentElement.dataset.theme = value;
};

// Follow the system until the user picks a theme; the pick then sticks.
systemLight.addEventListener("change", (event) => {
  if (stored() === null) apply(event.matches ? "light" : "dark");
});

export const theme = readonly(current);

export const toggleTheme = (): void => {
  const next: Theme = current.value === "light" ? "dark" : "light";
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // storage unavailable: the choice lasts until the page is reloaded
  }
  apply(next);
};
