import { JSX } from "react";
import { Layout } from "../../components/Layout/index.js";
import { Container } from "../../components/Container/index.js";

interface Props {
  clientScript?: string;
  styleSheet?: string;
}

export const HomePage = ({ clientScript, styleSheet }: Props): JSX.Element => {
  return (
    <Layout
      title="Home Page"
      clientScript={clientScript}
      styleSheet={styleSheet}
    >
      <Container>
        <h1>Home Page</h1>
      </Container>
    </Layout>
  );
};
