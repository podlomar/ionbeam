import { JSX } from "react";
import { Container } from "../../components/Container/index.js";
import './styles.css';

export const HomePage = (): JSX.Element => {
  return (
    <Container>
      <h1>Home Page</h1>
      <p>Built with IonBeam - A flexible React SSR framework</p>
    </Container>
  );
};
