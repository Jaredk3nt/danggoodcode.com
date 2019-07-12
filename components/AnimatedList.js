import React from "react";
import { useTrail, animated } from "react-spring";
// Components
import ListItem from './ListItem';
// Variables
const config = { mass: 5, tension: 2000, friction: 200 };

export default function AnimatedList({ list }) {
  const trail = useTrail(list.length, {
    config,
    opacity: 1,
    x: 0,
    from: {
      opacity: 0,
      x: 16
    }
  });
  return trail.map(({ x, ...style }, index) => {
    return (
      <animated.div
        style={{
          ...style,
          transform: x.interpolate(x => `translate3d(0, ${x}px, 0)`)
        }}
      >
        <ListItem item={list[index]} />
      </animated.div>
    );
  });
}
