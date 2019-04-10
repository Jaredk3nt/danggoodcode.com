import React from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { withRouter } from "next/router";
import { NUM_GRID_ITEMS, GRID_ITEM_WIDTH } from '../components/config';

export default withRouter(function Header({ router }) {
  console.log(router.pathname);
  const path = router.pathname.split("/");
  const show = path.length === 2 && router.pathname.length > 1;
  return (
    <HeaderContainer>
      <div>
        <Link href="/">
          <HeaderLink>
            danggoodcode
            {show && " / "}
          </HeaderLink>
        </Link>
        {show && <SiteSection>{path[1]}</SiteSection>}
      </div>
      <HeaderLinks>
        <HeaderLink
          href="https://twitter.com/messages/compose?recipient_id=243024277"
          target="_blank"
        >
          contact
        </HeaderLink>
        <HeaderLink href="https://twitter.com/danggoodcode" target="_blank">
          twitter
        </HeaderLink>
        <HeaderLink href="https://github.com/Jaredk3nt" target="_blank">
          github
        </HeaderLink>
      </HeaderLinks>
    </HeaderContainer>
  );
});

const HeaderContainer = styled("header")`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 40px 0px 30px 0px;
  padding: 0px 0px 16px 0px;
  border-bottom: 1px solid white;

  @media only screen and (max-width: ${(NUM_GRID_ITEMS - 1) * GRID_ITEM_WIDTH + 24}px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const HeaderLinks = styled("nav")`
  display: flex;
  justify-content: space-between;
  width: 260px;

  @media only screen and (max-width: ${(NUM_GRID_ITEMS - 1) * GRID_ITEM_WIDTH + 24}px) {
    width: 100%;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid white;
  }
`;

const SiteSection = styled("p")`
  font-size: 16px;
  color: white;
  display: inline;
  margin: 0;
  font-weight: 500;
`;

const HeaderLink = styled("a")`
  font-size: 16px;
  color: white;
  text-decoration: none;

  &:hover {
    cursor: pointer;
  }
`;
