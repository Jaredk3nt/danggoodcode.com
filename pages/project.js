import React, { Component } from "react";
import { Link } from "../routes";
// Components
import Markdown from "../components/Markdown";
import Text from "../components/Text";

export default class Project extends Component {
  static getInitialProps = async context => {
    const { project } = context.query;
    try {
      const projectData = await require(`../static/projects/built/${project}.json`);
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
      <>
        <Link route="/projects" prefetch>
          <Text as="a">back to all projects</Text>
        </Link>
        <Text as="h1" fs={36}>
          {title}
        </Text>
        <Text fs={14}>{date}</Text>
        <Markdown content={content} />
      </>
    );
  }
}
