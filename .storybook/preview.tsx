import React from "react";
import type { Preview } from "@storybook/react";
import { HashRouter as Router } from "react-router-dom";
import { MainErrorBoundary } from "../src/Generic/components/ErrorBoundaries";
import ViewLoading from "../src/Generic/components/ViewLoading";
import { ContextProviders } from "../src/App/bootstrap/context";
import "../src/App/i18n";

const preview: Preview = {
  decorators: [
    (Story) => (
      <MainErrorBoundary>
        <React.Suspense fallback={<ViewLoading />}>
           <Router>
             <ContextProviders>
               <Story />
             </ContextProviders>
           </Router>
        </React.Suspense>
      </MainErrorBoundary>
    ),
  ],
};

export default preview;
