import { JSX } from "react";
import { IonCoreRequest } from '../../types.js';

export interface PageProps {
  request: IonCoreRequest;
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const Page = ({ children, title = "IonCore", description, request }: PageProps): JSX.Element => {
  const clientScript = request.ioncore.clientScript;
  const styleSheet = request.ioncore.styleSheet;

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {description && <meta name="description" content={description} />}
        <title>{title}</title>
        {styleSheet && <link rel="stylesheet" href={`/${styleSheet}`} />}
        {clientScript && <script src={`/${clientScript}`} defer />}
      </head>

      <body>
        {children}
      </body>
    </html>
  );
};
