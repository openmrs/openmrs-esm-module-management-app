import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import ModuleManagement from "./components/module-management.component";
import ModuleInfo from "./components/module-info.component";

const Root = () => {
  // This routing configuration tells React Router to render the `ModuleManagement` component when the route is `openmrsSpaBase()` + `\module-management`. Whereas, if the route is `openmrsSpaBase()` + `\module-management\:moduleUuid`, the `ModuleInfo` component gets rendered instead.
  return (
    <main>
      <BrowserRouter basename={window.spaBase}>
        <Switch>
          <Route exact path="/module-management">
            <ModuleManagement />
          </Route>
          <Route exact path="/module-management/:moduleUuid">
            <ModuleInfo />
          </Route>
        </Switch>
      </BrowserRouter>
    </main>
  );
};

export default Root;
