import React from "react";
import styled from "@emotion/styled";
import { Link } from "../routes";
// Components
import Text from "../components/Text";
// Variables
import data from "../static/data.json";

export default function Projects() {
  return data.projects.map(project => <Project project={project} />);
}

function Project({ project: { title, description, url, linkTo } }) {
  if (linkTo) {
    return (
      <Link route={linkTo} prefetch>
        <ProjectContainer>
          <Text fs={15} bold>
            {title}
          </Text>
          <Text fs={15}>{description}</Text>
        </ProjectContainer>
      </Link>
    );
  }
  return (
    <ProjectContainer href={url} target="_blank">
      <Text fs={15} bold>
        {title}
      </Text>
      <Text fs={15}>{description}</Text>
    </ProjectContainer>
  );
}

const ProjectContainer = styled("a")`
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
