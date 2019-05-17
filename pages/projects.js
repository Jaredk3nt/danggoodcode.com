import React from "react";
import styled from "@emotion/styled";
import { useTrail, animated } from "react-spring";
import { Link } from "../routes";
// Components
import Text from "../components/Text";
// Variables
import data from "../static/data.json";
const config = { mass: 5, tension: 2000, friction: 200 };

export default function Projects() {
  const trail = useTrail(data.projects.length, {
    config,
    opacity: 1,
    x: 0,
    from: {
      opacity: 0,
      x: 16
    }
  });
  return trail.map(({ x, ...style }, index) => {
    return (
      <animated.div
        style={{
          ...style,
          transform: x.interpolate(x => `translate3d(0, ${x}px, 0)`)
        }}
      >
        <Project project={data.projects[index]} />
      </animated.div>
    );
  });
}

const AnimatedProject = animated(Project);

function Project({ project: { title, description, url, linkTo } }, style) {
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
