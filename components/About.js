import React, { useState } from "react";
import styled from "@emotion/styled";
import { animated, useSpring } from "react-spring";
// Components
import Tabs from "./Tabs";
import Text from "./Text";
// Variables
import data from "../public/data.json";
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
        Howdy, my name is Jared Jones. I am a software developer currently working a PayPal, based in Seattle, WA. I spent my weekdays building the platform that powers promotions and incentives across the different PayPal brands, and my weekends running and climbing all around the mountains of the cascades.
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
        I have been building for the web for over a decade now, and still love it as a pure an outlet for creativity.
      </AnimatedText>
      <AnimatedText
        style={{
          ...textAnim,
          transform: textAnim.x.interpolate(x => `translate3d(0, ${x}px, 0)`)
        }}
        m={{ top: 28 }}
        fs={22}
        lh={1.4}
      >
        You can find many of my various personal projects here, and my writing and photography over at <a href="https://where-is-jared.com" referrerPolicy="_blank">Where is Jared?</a>
      </AnimatedText>
      <Divider />
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
