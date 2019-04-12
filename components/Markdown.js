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
        img: Img
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
  return <Text fs={18} lh={1.4} m={{ top: 32 }}>{children}</Text>;
}

const Img = styled('img')`
  margin: 14px 0px;
  width: 100%;
  max-width: 100%;
`;
