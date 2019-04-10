import React, { useState } from "react";
// Components
import Tabs from "../components/Tabs";
import Text from '../components/Text';
import About from "../components/About";
import ProjectGrid from '../components/ProjectGrid';
// Variables
const TABS = ["projects", "blog", "about"];
const display = {
  [TABS[0]]: ProjectGrid,
  [TABS[1]]: Blog,
  [TABS[2]]: About
};

export default function Index() {
  const [tab, updateTab] = useState(TABS[0]);
  const CurrentDisplay = display[tab];

  return (
    <>
      <Tabs tabs={TABS} active={tab} onChange={updateTab} width={280} />
      <CurrentDisplay />
    </>
  );
}

function Blog() {
  return <Text>Coming shortly!</Text>
}


