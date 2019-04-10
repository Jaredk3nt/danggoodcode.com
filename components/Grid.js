import styled from "@emotion/styled";
import Link from "next/link";
// Variables
import { NUM_GRID_ITEMS, GRID_ITEM_WIDTH } from './config';
const PADDING = "36px";
const DIVIDER_PADDING = "16px";
const TEXT_SIZE = "15px";

export const Grid = styled("ul")`
  width: 100%;
  height: 100%;
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
  grid-template-columns: repeat(${NUM_GRID_ITEMS}, 1fr);

  @media only screen and (max-width: ${NUM_GRID_ITEMS * GRID_ITEM_WIDTH + 24}px) {
    grid-template-columns: repeat(${NUM_GRID_ITEMS - 1}, 1fr);
  }

  @media only screen and (max-width: ${(NUM_GRID_ITEMS - 1) * GRID_ITEM_WIDTH + 24}px) {
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
    background-color: rgba(255,255,255,.2);
  }
`;

export const GridItemSpacer = styled('div')`
  position: relative;
  width: 100%;
  height: 100%;
  top: ${p => p.single ? `calc(50% - ${TEXT_SIZE})` : `calc(50% - ${PADDING} - ${TEXT_SIZE} + ${DIVIDER_PADDING})`};
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

export function GridItem({ url, href, children, ...props }) {
  if (url) {
    return (
      <GridItemStyled href={url} target="_blank" {...props}>
        {children}
      </GridItemStyled>
    );
  }
  return (
    <Link href={href}>
      <GridItemStyled {...props}> {children} </GridItemStyled>
    </Link>
  );
}
