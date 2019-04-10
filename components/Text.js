import styled from "@emotion/styled";
import PropTypes from "prop-types";

function cond(val, def) {
  return val !== undefined ? val : def;
}

const Text = styled("p")`
  color: ${p => p.black || 'white'};
  font-size: ${p => (p.fs ? p.fs : 16)}px;
  line-height: ${p => (p.lh ? p.lh : 1)};
  margin: ${p => {
    const m = p.m;
    if (m === undefined) return '12px 0px';
    if (typeof m === 'number') return m + 'px';
    return `${cond(m.top, 16)}px ${cond(m.right, 0)}px ${cond(m.bottom, 16)}px ${cond(m.left, 0)}px`}
  };
  ${p => p.bold && "font-weight: 500;"}
  ${p => p.nowrap && 'white-space: nowrap;'}
`;

Text.propTypes = {
  bold: PropTypes.bool, // isBold flag
  fs: PropTypes.number, // Fontsize in px
  lh: PropTypes.number, // Lineheight
  m: PropTypes.oneOfType([
    // margin can be given as object of values or single number
    PropTypes.shape({
      top: PropTypes.number,
      right: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number
    }),
    PropTypes.number
  ])
};

export default Text;
