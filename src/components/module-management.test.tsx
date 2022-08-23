import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { openmrsFetch } from "@openmrs/esm-framework";
import { renderWithSwr, waitForLoadingToFinish } from "../test-helpers";
import ModuleManagement from "./module-management.component";

// Learn more about testing by reading https://kentcdodds.com/blog/common-mistakes-with-react-testing-library.

// Use the `openmrsFetch` function from the stubbed out `openmrs/esm-framework` package. we'll then use the `mockedOpenmrsFetch` variable to override the return value of the function so we can have fine-grained control over what we want it to return.
const mockedOpenmrsFetch = openmrsFetch as jest.Mock;
// Use this variable to reference the stubbed out version of the `useRouteMatch` function from the `react-router-dom` package.

jest.mock("react-router-dom", () => {
  // Store a reference to the original module
  const originalModule = jest.requireActual("@openmrs/esm-framework");

  return {
    // Use the original module, except for the `useRouteMatch` function which gets replaced with the stub below
    ...originalModule,
    // Stub out the implementation of the `useRouteMatch` function to return an object whose `path` property is set to the string `/module-management`
    useRouteMatch: jest.fn().mockReturnValue({ path: "/module-management" }),
  };
});

it("renders an empty state view if data is unavailable", async () => {
  // This data property corresponds to the the `data` property returned from calling the `useSWR` hook
  mockedOpenmrsFetch.mockReturnValueOnce({ data: { results: [] } });

  renderModuleManagement();

  // Wait for the loading state to disappear from the screen
  await waitForLoadingToFinish();

  expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  expect(screen.queryByRole("table")).not.toBeInTheDocument();
  expect(
    screen.getByText(/there are no modules to display/i)
  ).toBeInTheDocument();
});

it("renders an error state view if there was a problem fetching module data", async () => {
  const error = {
    message: "Internal Server Error",
    response: {
      status: 500,
      statusText: "Internal Server Error",
    },
  };

  // Syntactic sugar for `mockedOpenmrsFetch.mockReturnValue(Promise.resolve(error))`
  mockedOpenmrsFetch.mockRejectedValueOnce(error);

  renderModuleManagement();

  // Wait for the loading state to disappear from the screen
  await waitForLoadingToFinish();

  expect(
    screen.getByText(/sorry, there was a problem fetching modules/i)
  ).toBeInTheDocument();
});

it("renders detailed information about the module", async () => {
  const testModules = [
    {
      uuid: "initializer",
      display: "Initializer",
      name: "Initializer",
      description:
        "The OpenMRS Initializer module is an API-only module that processes the content of the configuration folder when it is found inside OpenMRS' application data directory.",
      packageName: "org.openmrs.module.initializer",
      author: "Mekom Solutions",
      version: "2.3.0",
      started: true,
      startupErrorMessage: null,
      requireOpenmrsVersion: "2.1.1",
      awareOfModules: [
        "org.openmrs.module.metadatamapping",
        "org.bahmni.module.bahmni.ie.apps",
        "org.openmrs.module.datafilter",
        "org.openmrs.module.htmlformentry",
        "org.bahmni.module.appointments",
        "org.openmrs.module.metadatasharing",
        "org.openmrs.module.openconceptlab",
        "org.bahmni.module.bahmnicore",
        "org.openmrs.module.idgen",
        "org.openmrs.module.legacyui",
      ],
      requiredModules: [],
      resourceVersion: "1.8",
    },
    {
      uuid: "serialization.xstream",
      display: "Serialization Xstream",
      name: "Serialization Xstream",
      description:
        "Core (de)serialize API and services supported by xstream library",
      packageName: "org.openmrs.module.serialization.xstream",
      author: "luzhuangwei",
      version: "0.2.15",
      started: true,
      startupErrorMessage: null,
      requireOpenmrsVersion: "1.9.9",
      awareOfModules: [],
      requiredModules: [],
      resourceVersion: "1.8",
    },
  ];

  // Return the `testModules` object defined above in the API response. The nested `data` property below corresponds to the the `data` property returned from calling the `useSWR` hook
  mockedOpenmrsFetch.mockReturnValueOnce({
    data: { results: testModules },
  });

  renderModuleManagement();

  // Wait for the loading state to disappear from the screen
  await waitForLoadingToFinish();

  expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /add \/ upgrade modules/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /search from addons/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /check for updates/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /start all/i })
  ).toBeInTheDocument();
  expect(screen.getByRole("table")).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /manage modules/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("searchbox", { name: /filter table/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /clear search input/i })
  ).toBeInTheDocument();

  const modules = testModules.map((module) => module);

  modules.forEach((module) => {
    expect(screen.getByText(module.name)).toBeInTheDocument();
    expect(screen.getByText(module.description)).toBeInTheDocument();
  });

  const expectedColumnHeaders = [
    /status/,
    /name/,
    /author/,
    /version/,
    /description/,
  ];

  expectedColumnHeaders.forEach((row) => {
    expect(
      screen.getByRole("columnheader", { name: new RegExp(row, "i") })
    ).toBeInTheDocument();
  });

  const searchbox = screen.getByRole("searchbox", { name: /filter table/i });

  // search for the Serializer module
  await userEvent.type(searchbox, "Seri");

  expect(screen.getByText(/Serialization Xstream/i)).toBeInTheDocument();
  expect(screen.queryByText(/Initializer/i)).not.toBeInTheDocument();

  await userEvent.clear(searchbox);

  // search for something that doesn't exist in the module list
  await userEvent.type(searchbox, "super-duper-unreleased-module");

  expect(screen.queryByText(/Serialization Xstream/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Initializer/i)).not.toBeInTheDocument();
  expect(screen.getByText(/no matching modules found/i)).toBeInTheDocument();
});

function renderModuleManagement() {
  // Renders the `ModuleManagement` component within an SWR context
  renderWithSwr(<ModuleManagement />);
}
