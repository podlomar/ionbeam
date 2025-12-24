import { JSX } from "react";
import { Page, IonCoreRequest } from "ioncore";
import { Container } from "../../components/Container/index.js";

interface Props {
  request: IonCoreRequest;
}

export const HomePage = ({ request }: Props): JSX.Element => {
  return (
    <Page title="Home Page" description="Welcome to IonCore" request={request}>
      <Container>
        <h1>Home Page</h1>
        <p>Built with IonCore - A flexible React SSR framework</p>
      </Container>
    </Page>
  );
};
