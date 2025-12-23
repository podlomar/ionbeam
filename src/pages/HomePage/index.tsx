import { JSX } from "react";
import { Layout } from "../../components/Layout/index.js";
import { Container } from "../../components/Container/index.js";

interface Props {
  clientScript?: string;
}

export const HomePage = ({ clientScript }: Props): JSX.Element => {
  return (
    <Layout title="Home Page" clientScript={clientScript}>
      <Container>
        <h1>Home Page</h1>
      </Container>
    </Layout>
  );
};
