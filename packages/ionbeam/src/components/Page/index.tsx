import { JSX } from "react";
import { useAssets } from "../../utils/assets-context.js";

interface Props {
  title: string;
  children: React.ReactNode;
}

export const Page = ({ children, title }: Props): JSX.Element => {
  const { styleSheet, clientScript } = useAssets();

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.8/dist/htmx.min.js"></script>

        {styleSheet && <link rel="stylesheet" href={`/${styleSheet}`} />}
        {clientScript && <script src={`/${clientScript}`} defer />}
      </head>

      <body>
        {children}
      </body>
    </html>
  );
};
