import { JSX } from "react";
import './layout.css';

interface Props {
  children: React.ReactNode;
  title?: string;
  clientScript?: string;
}

export const Layout = ({ children, title = "IonCore", clientScript }: Props): JSX.Element => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="IonCore - Pure SSR React Application Template" />
        <title>{title}</title>
        <link rel="stylesheet" href="/server.css" />
        {clientScript && <script src={`/${clientScript}`} defer />}
      </head>

      <body>
        {children}
      </body>
    </html>
  );
};
