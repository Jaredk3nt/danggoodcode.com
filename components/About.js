import React, { useState } from "react";
import styled from "@emotion/styled";
import { animated, useSpring } from "react-spring";
// Components
import Tabs from "./Tabs";
import Text from "./Text";
// Variables
import data from "../static/data.json";
const TABS = ["skills", "values"];
const display = {
  [TABS[0]]: Skills,
  [TABS[1]]: Values
};
const anim = {
  opacity: 1,
  x: 0,
  from: { opacity: 0, x: 16 }
};

export default function About() {
  const [tab, updateTab] = useState(TABS[0]);
  const CurrentDisplay = display[tab];

  const textAnim = useSpring(anim);
  const text2Anim = useSpring({
    delay: 100,
    ...anim
  });
  const tabsAnim = useSpring({
    delay: 150,
    ...anim
  });

  return (
    <>
      <Divider />
      <AnimatedText
        style={{
          ...textAnim,
          transform: textAnim.x.interpolate(x => `translate3d(0, ${x}px, 0)`)
        }}
        m={{ top: 28 }}
        fs={22}
        lh={1.4}
      >
        Howdy, my name is jared jones. I am a software developer currently based
        in Austin, TX working on a team called Fortellis at CDK Global. I spend
        my days building a customer driven e-commerce platform for the
        automotive industry and my nights testing my skills and building all
        sorts of fun web projects.
      </AnimatedText>
      <AnimatedText
        style={{
          ...text2Anim,
          transform: text2Anim.x.interpolate(x => `translate3d(0, ${x}px, 0)`)
        }}
        m={{ bottom: 28 }}
        fs={22}
        lh={1.4}
      >
        I love building for the web because it is an outlet for near-pure
        creativity and problem solving. a good website does more than just look
        good and feel good, it empowers people to do the things they love doing.
      </AnimatedText>
      <animated.div
        style={{
          ...tabsAnim,
          transform: tabsAnim.x.interpolate(x => `translate3d(0, ${x}px, 0)`)
        }}
      >
        <Tabs
          tabs={TABS}
          active={tab}
          onChange={updateTab}
          width={160}
          fontSize={22}
          underlined
        />
        <CurrentDisplay />
      </animated.div>
    </>
  );
}

const AnimatedText = animated(Text);

const Divider = styled("hr")`
  color: white;
  border: none;
  border-bottom: 1px solid white;
`;

function Skills() {
  return data.skills.map((skill, index) => (
    <>
      <Text m={{ top: 24, bottom: 8 }} fs={18} bold>
        {skill.title}
      </Text>
      <Text m={{ top: 0 }} fs={18}>
        {skill.description}
      </Text>
    </>
  ));
}

function Values() {
  return data.values.map((value, index) => (
    <>
      <Text m={{ top: 24, bottom: 8 }} fs={18} bold>
        {value.title}
      </Text>
      <Text m={0} fs={18}>
        {value.description}
      </Text>
    </>
  ));
}
