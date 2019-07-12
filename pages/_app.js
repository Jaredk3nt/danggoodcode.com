import App, { Container } from 'next/app';
import Head from 'next/head';
import { Global, css } from '@emotion/core';
// Components
import { Layout } from '../components/Layout';
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
        <span>
          <Head>
            <title>danggoodcode;</title>
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
          </Head>
          <Layout>
            <Header />
            <Component {...pageProps} />
          </Layout>
          <Global
            styles={css`

              body {
                background-color: black;
              }

              body,
              p,
              h1,
              h2,
              h3,
              h4,
              h5,
              h6 {
                font-family: Silka, sans-serif;
                font-weight: 300;
                letter-spacing: 0.25px;
              }

              #__next {
                height: 100%;
              }
            `}
          />
        </span>
      </Container>
    );
  }
}
