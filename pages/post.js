import React, { Component } from "react";
import { Link } from "../routes";
import styled from '@emotion/styled';
// Components
import Markdown from "../components/Markdown";
import Text from "../components/Text";
import { Arrow, ArrowContainer } from "../components/Arrow";

export default class Project extends Component {
  static getInitialProps = async context => {
    const { post } = context.query;
    try {
      const postData = await require(`../static/posts/dist/${post}.json`);
      return { statusCode: 200, postData };
    } catch (err) {
      return { statusCode: 404 };
    }
  };

  render() {
    const {
      postData: { title, date, content, url }
    } = this.props;

    return (
      <Container>
        <div>
          <Link route="/posts" prefetch>
            <ArrowContainer width="225px">
              <Arrow white dir="left" />
              <Text as="a" m={{ left: 10 }} hoverable nowrap>
                back to all posts
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
          href={url}
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