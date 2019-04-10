import styled from "@emotion/styled";

export const ArrowContainer = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Arrow = styled("div")`
  width: 100%;
  height: 1px;
  background-color: black;
  position: relative;

  &:after {
    content: '';
    width: 0;
    height: 0;
    position: absolute;
    right: -1px;
    top: -4.5px;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;

    border-left: 9px solid black;
  }
`;
