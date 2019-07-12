import React from "react";
import { Link } from "../routes";
// Components
import AnimatedList from "../components/AnimatedList";
import Text from "../components/Text";
import { Arrow, ArrowContainer } from "../components/Arrow";
// Variables
import data from "../static/data.json";

export default function Posts() {
  return (
    <>
      <div>
        <Link route="/" prefetch>
          <ArrowContainer width="225px">
            <Arrow white dir="left" />
            <Text as="a" m={{ left: 10 }} hoverable nowrap>
              back to home
            </Text>
          </ArrowContainer>
        </Link>
      </div>
      <AnimatedList list={data.posts} />
    </>
  );
}
