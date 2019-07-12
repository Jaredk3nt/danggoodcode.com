import React, { useState } from "react";
// Components
import Tabs from "../components/Tabs";
import About from "../components/About";
import ProjectGrid from "../components/ProjectGrid";
import AnimatedList from "../components/AnimatedList";
// Variables
import data from "../static/data.json";
const TABS = ["projects", "blog", "about"];
const display = {
  [TABS[0]]: ProjectGrid,
  [TABS[1]]: PostDisplay,
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

function PostDisplay() {
  return <AnimatedList list={data.posts.slice(0, 10)} />;
}
