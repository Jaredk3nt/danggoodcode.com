import React from "react";
import styled from "@emotion/styled";

export default function Tabs({
  tabs,
  active,
  onChange,
  width,
  underlined,
  fontSize
}) {
  return (
    <TabContainer width={width} underlined={underlined}>
      {tabs.map(t => (
        <Tab
          active={active === t}
          onClick={() => onChange(t)}
          fontSize={fontSize}
        >
          {t}
        </Tab>
      ))}
    </TabContainer>
  );
}

const TabContainer = styled("nav")`
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  width: ${p => (p.width ? p.width + "px" : "auto")};
  ${p => p.underlined && "border-bottom: 1px solid white;"}
`;

const Tab = styled(`button`)`
  background-color: transparent;
  border: none;
  color: white;
  padding: 0;
  text-align: left;
  margin-bottom: 20px;

  font-size: ${p => p.fontSize ? p.fontSize : 16}px;
  ${p => p.active && "font-weight: 500;"}

  &:hover {
    cursor: pointer;
  }
`;
