import remark from "remark";
import reactRenderer from "remark-react";
import frontmatter from 'remark-frontmatter';
import styled from '@emotion/styled';
// Components
import Text from "./Text";

export default function Markdown({ content }) {
  return remark()
    .use(frontmatter, ['yaml'])
    .use(reactRenderer, {
      remarkReactComponents: {
        h2: H2,
        h3: H3,
        p: P,
        img: Img,
        pre: Pre,
        blockquote: BlockQuote
      }
    })
    .processSync(content).contents;
}

function H2({ children }) {
  return (
    <Text as="h2" fs={28} m={{ top: 28, bottom: 16 }} bold>
      {children}
    </Text>
  );
}

function H3({ children }) {
  return (
    <Text as="h3" fs={24} m={{ top: 22, bottom: 12 }} bold>
      {children}
    </Text>
  );
}

function P({ children }) {
  return <Text fs={18} lh={1.6} m={{ top: 32 }}>{children}</Text>;
}

const Img = styled('img')`
  margin: 14px 0px;
  width: 100%;
  max-width: 100%;
`;

const Pre = styled('pre')`
  color: white;
  width: 100%;
  border: 1px solid white;
  padding: 16px;
  box-sizing: border-box;
  font-size: 1.1rem;
  font-family: monospace !important;
  font-weight: 300;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const BlockQuote = styled('blockquote')`
  border-left: 5px solid white;
  margin: 32px 40px 8px 10px;
  padding: 16px 0px 16px 30px;
  p {
    margin: 0px;
  }
`;
