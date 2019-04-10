import App, { Container } from "next/app";
import { Global, css } from "@emotion/core";
// Components
import { Layout } from "../components/Layout";
import Header from '../components/Header';

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
  }

  render() {
    const { Component, pageProps, router } = this.props;
    return (
      <Container>
        <Layout>
          <Header />
          <Component {...pageProps} />
        </Layout>
        <Global
        styles={css`
          * {
            font-family: Silka, sans-serif;
            font-weight: 300;
            letter-spacing: .25px;
          }

          body {
            background-color: black;
          }

          #__next {
            height: 100%;
          }
        `}
      />
      </Container>
    );
  }
};
