import type { vReveal } from "../directives/reveal";

declare module "vue" {
  interface GlobalDirectives {
    vReveal: typeof vReveal;
  }

  interface HTMLAttributes {
    "data-slot"?: string | number;
  }

  interface ComponentCustomProps {
    id?: string;
  }
}
