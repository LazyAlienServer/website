import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import { Home } from "./home/Home.tsx";

// Components use `m.*` with the `domAnimation` feature set; `strict` throws
// if a full `motion.*` component slips in and pulls the whole bundle back.
export default function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <Home />
      </MotionConfig>
    </LazyMotion>
  );
}
