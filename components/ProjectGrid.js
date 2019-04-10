import React from "react";
import { Link } from "../routes";
// Components
import {
  Grid,
  GridItem,
  GridItemTitle,
  GridItemSubtitle,
  GridItemDivider,
  GridItemSpacer
} from "../components/Grid";
import Text from "../components/Text";
import { Arrow, ArrowContainer } from "../components/Arrow";
// Variables
import data from "../static/data.json";

export default function ProjectGrid() {
  return (
    <Grid>
      {data.projects.slice(0, 5).map(project => {
        if (project.linkTo) {
          return (
            <Link route={project.linkTo} prefetch>
              <GridItem>
                <GridItemSpacer>
                  <GridItemTitle>{project.title}</GridItemTitle>
                  <GridItemDivider />
                  <GridItemSubtitle>{project.description}</GridItemSubtitle>
                </GridItemSpacer>
              </GridItem>
            </Link>
          );
        }
        return (
          <GridItem url={project.url}>
            <GridItemSpacer>
              <GridItemTitle>{project.title}</GridItemTitle>
              <GridItemDivider />
              <GridItemSubtitle>{project.description}</GridItemSubtitle>
            </GridItemSpacer>
          </GridItem>
        );
      })}

      <GridItem href="/projects" white>
        <GridItemSpacer single>
          <ArrowContainer>
            <Text
              fs={15}
              m={{
                top: 0,
                right: 16,
                bottom: 0,
                left: 0
              }}
              nowrap
              black
            >
              view all projects
            </Text>
            <Arrow />
          </ArrowContainer>
        </GridItemSpacer>
      </GridItem>
    </Grid>
  );
}
