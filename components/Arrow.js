import styled from "@emotion/styled";

export const ArrowContainer = styled("div")`
  width: ${p => p.width ? p.width : 'auto'};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Arrow = styled("div")`
  width: 100%;
  height: 1px;
  background-color: ${p => p.white ? 'white' : 'black'};
  position: relative;

  &:after {
    content: '';
    width: 0;
    height: 0;
    position: absolute;
    top: -4.5px;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;

    ${p => {
      if (p.dir === 'left') {
        return `
          left: -1px;
          border-right: 9px solid ${p.white ? 'white' : 'black'};
        `;
      }
      return `
        right: -1px;
        border-left: 9px solid ${p.white ? 'white' : 'black'};
      `;
    }}
  }
`;
