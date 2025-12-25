import { JSX } from "react";
import { Page } from "ionbeam";
import { Container } from "../../components/Container/index.js";
import './styles.css';

export const HomePage = (): JSX.Element => {
  return (
    <Page title="Home Page">
      <Container>
        <h1>Home Page</h1>
        <p>Built with IonBeam - A flexible React SSR framework</p>
      </Container>
    </Page>
  );
};
