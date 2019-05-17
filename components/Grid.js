import styled from "@emotion/styled";
import Link from "next/link";
import { animated, useTrail, useSpring } from "react-spring";
// Variables
import { NUM_GRID_ITEMS, GRID_ITEM_WIDTH } from "./config";
const PADDING = "36px";
const DIVIDER_PADDING = "16px";
const TEXT_SIZE = "15px";
const anim = {
  opacity: 1,
  x: 0,
  from: { opacity: 0, x: 16 }
};

export const Grid = styled("ul")`
  width: 100%;
  height: 100%;
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
  grid-template-columns: repeat(${NUM_GRID_ITEMS}, 1fr);

  @media only screen and (max-width: ${NUM_GRID_ITEMS * GRID_ITEM_WIDTH +
      24}px) {
    grid-template-columns: repeat(${NUM_GRID_ITEMS - 1}, 1fr);
  }

  @media only screen and (max-width: ${(NUM_GRID_ITEMS - 1) * GRID_ITEM_WIDTH +
      24}px) {
    grid-template-columns: repeat(${NUM_GRID_ITEMS - 2}, 1fr);
  }
`;

const GridItemStyled = styled("a")`
  width: 100%;
  height: 100%;
  min-width: ${GRID_ITEM_WIDTH}px;
  min-height: ${GRID_ITEM_WIDTH}px;
  border: 1px solid white;
  text-decoration: none;
  align-items: center;
  justify-content: center;
  padding: ${PADDING};
  box-sizing: border-box;
  position: relative;

  color: ${p => (p.white ? "black" : "white")};
  background-color: ${p => (p.white ? "white" : "black")};

  &:hover {
    cursor: pointer;
    border: 5px solid white;
    padding: 32px;
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

export const GridItemSpacer = styled("div")`
  position: relative;
  width: 100%;
  height: 100%;
  top: ${p =>
    p.single
      ? `calc(50% - ${TEXT_SIZE})`
      : `calc(50% - ${PADDING} - ${TEXT_SIZE} + ${DIVIDER_PADDING})`};
`;

export const GridItemTitle = styled("h2")`
  font-size: ${TEXT_SIZE};
  width: 100%;
  margin: 0;
  font-weight: 500;
`;

export const GridItemSubtitle = styled("h3")`
  font-size: ${TEXT_SIZE};
  width: 100%;
  margin: 0;
`;

export const GridItemDivider = styled("hr")`
  width: 100%;
`;

const AnimatedGridItem = animated(GridItemStyled);

export function GridItem({ url, href, children, delay, ...props }) {
  const textAnim = useSpring({ delay: delay ? delay : 0, ...anim });
  if (url) {
    return (
      <AnimatedGridItem
        style={{
          ...textAnim,
          transform: textAnim.x.interpolate(x => `translate3d(0, ${x}px, 0)`)
        }}
        href={url}
        target="_blank"
        {...props}
      >
        {children}
      </AnimatedGridItem>
    );
  }
  return (
    <Link href={href}>
      <AnimatedGridItem
        style={{
          ...textAnim,
          transform: textAnim.x.interpolate(x => `translate3d(0, ${x}px, 0)`)
        }}
        {...props}
      >
        {children}
      </AnimatedGridItem>
    </Link>
  );
}
