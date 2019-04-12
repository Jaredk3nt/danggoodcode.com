import React, { Component } from "react";
import { Link } from "../routes";
import styled from '@emotion/styled';
// Components
import Markdown from "../components/Markdown";
import Text from "../components/Text";
import { Arrow, ArrowContainer } from "../components/Arrow";

export default class Project extends Component {
  static getInitialProps = async context => {
    const { project } = context.query;
    try {
      const projectData = await require(`../static/projects/dist/${project}.json`);
      return { statusCode: 200, projectData };
    } catch (err) {
      return { statusCode: 404 };
    }
  };

  render() {
    const {
      projectData: { title, date, content }
    } = this.props;
    return (
      <Container>
        <div>
          <Link route="/projects" prefetch>
            <ArrowContainer width="225px">
              <Arrow white dir="left" />
              <Text as="a" m={{ left: 10 }} hoverable nowrap>
                back to all projects
              </Text>
            </ArrowContainer>
          </Link>
        </div>

        <Text
          as="a"
          fs={36}
          role="heading"
          aria-level="1"
          m={{ top: 36 }}
          hoverable
        >
          {title}
        </Text>
        <Text fs={14}>{date}</Text>
        <Markdown content={content} />
      </Container>
    );
  }
}


const Container = styled('main')`
  padding-bottom: 3em;
`;