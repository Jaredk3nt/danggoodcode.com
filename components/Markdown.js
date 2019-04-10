import remark from "remark";
import reactRenderer from "remark-react";
import frontmatter from 'remark-frontmatter'
// Components
import Text from "./Text";

export default function Markdown({ content }) {
  return remark()
    .use(frontmatter, ['yaml'])
    .use(reactRenderer, {
      remarkReactComponents: {
        h2: H2,
        h3: H3,
        p: P
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
  return <Text>{children}</Text>;
}
