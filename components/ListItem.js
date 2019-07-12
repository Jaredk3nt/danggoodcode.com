import React from 'react';
import styled from "@emotion/styled";
import { Link } from "../routes";
// Components
import Text from "../components/Text";

export default function ListItem({ item: { title, description, url, linkTo } }) {
  if (linkTo) {
    return (
      <Link route={linkTo} prefetch>
        <ListItemContainer>
          <Text fs={15} bold>
            {title}
          </Text>
          <Text fs={15}>{description}</Text>
        </ListItemContainer>
      </Link>
    );
  }
  return (
    <ListItemContainer href={url} target="_blank">
      <Text fs={15} bold>
        {title}
      </Text>
      <Text fs={15}>{description}</Text>
    </ListItemContainer>
  );
}

const ListItemContainer = styled("a")`
  display: block;
  text-decoration: none;
  border: 1px solid white;
  padding: 12px 24px;
  margin: 1.5em 0em;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    cursor: pointer;
    border: 5px solid white;
    padding: 8px 20px;
  }
`;

