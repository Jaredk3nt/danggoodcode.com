import React, { useState } from "react";
import styled from "@emotion/styled";
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

export default function About() {
  const [tab, updateTab] = useState(TABS[0]);
  const CurrentDisplay = display[tab];

  return (
    <>
      <Divider />
      <Text m={{ top: 28 }} fs={22} lh={1.4}>
        howdy, my name is jared jones. I am a software developer currently based
        in austin, tx working on a team called fortellis at cdk global. I spend
        my days building a customer driven e-commerce platform for the
        automotive industry and my nights testing my skills and building all
        sorts of fun web projects.
      </Text>
      <Text m={{ bottom: 28 }} fs={22} lh={1.4}>
        I love building for the web because it is an outlet for near-pure
        creativity and problem solving. a good website does more than just look
        good and feel good, it empowers people to do the things they love doing.
      </Text>
      <Tabs
        tabs={TABS}
        active={tab}
        onChange={updateTab}
        width={160}
        fontSize={22}
        underlined
      />
      <CurrentDisplay />
    </>
  );
}

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
