import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ModuleManagement from "./components/module-management.component";
import ModuleInfo from "./components/module-info.component";

const Root = () => {
  // This routing configuration tells React Router to render the `ModuleManagement` component when the route is `openmrsSpaBase()` + `\module-management`. Whereas, if the route is `openmrsSpaBase()` + `\module-management\:moduleUuid`, the `ModuleInfo` component gets rendered instead.
  return (
    <main>
      <BrowserRouter basename={window.spaBase}>
        <Routes>
          <Route path="/module-management">
            <Route path="" element={<ModuleManagement />} />
            <Route path=":moduleUuid" element={<ModuleInfo />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </main>
  );
};

export default Root;
