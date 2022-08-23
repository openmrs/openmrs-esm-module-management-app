import React from "react";
import { screen } from "@testing-library/react";
import { openmrsFetch } from "@openmrs/esm-framework";
import { renderWithSwr, waitForLoadingToFinish } from "../test-helpers";
import ModuleInfo from "./module-info.component";

// Learn more about testing by reading https://kentcdodds.com/blog/common-mistakes-with-react-testing-library.

// Use the `openmrsFetch` function from the stubbed out `openmrs/esm-framework` package. we'll then use the `mockedOpenmrsFetch` variable to override the return value of the function so we can have fine-grained control over what we want it to return.
const mockedOpenmrsFetch = openmrsFetch as jest.Mock;

jest.mock("react-router-dom", () => {
  // Store a reference to the original module
  const originalModule = jest.requireActual("@openmrs/esm-framework");

  return {
    // Use the original module, except for the `useRouteMatch` function which gets replaced with the stub below
    ...originalModule,
    // Stub out the implementation of the `useParams` function to return an object whose `moduleUuid` property is set to the string `addresshierarchy`
    useParams: jest.fn().mockReturnValue({ moduleUuid: "addresshierarchy" }),
  };
});

it("renders an empty state view if data is unavailable", async () => {
  // This data property corresponds to the the `data` property returned from calling the `useSWR` hook
  mockedOpenmrsFetch.mockReturnValueOnce({ data: {} });

  renderModuleInfo();

  // Wait for the loading state to disappear from the screen
  await waitForLoadingToFinish();

  expect(
    screen.getByText(/there is no data to display about this module/i)
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

  mockedOpenmrsFetch.mockRejectedValueOnce(error);

  renderModuleInfo();

  // Wait for the loading state to disappear from the screen
  await waitForLoadingToFinish();

  expect(
    screen.getByText(
      /sorry, there was a problem fetching information about this module/i
    )
  ).toBeInTheDocument();
});

it("renders detailed information about the module", async () => {
  const testModule = {
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
    ],
    requiredModules: ["org.openmrs.module.metadatamapping"],
    resourceVersion: "1.8",
  };

  // Return the `testModule` object defined above the API response. The nested `data` property below corresponds to the the `data` property returned from calling the `useSWR` hook
  mockedOpenmrsFetch.mockReturnValueOnce({
    data: testModule,
  });

  renderModuleInfo();

  // Wait for the loading state to disappear from the screen
  await waitForLoadingToFinish();

  expect(
    screen.getByRole("link", { name: /back to module list/i })
  ).toBeInTheDocument();

  expect(screen.getByRole("button", { name: /stop/i })).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /check for updates/i })
  ).toBeInTheDocument();

  const expectedHeadings = [
    /module information/,
    /^required modules$/,
    /aware of modules \(optionally required modules\)/,
  ];

  expectedHeadings.forEach((heading) => {
    expect(
      screen.getByRole("heading", { name: new RegExp(heading, "i") })
    ).toBeInTheDocument();
  });

  const expectedColumnHeaders = [
    /^name$/,
    /display name/,
    /description/,
    /author name/,
    /module version/,
    /current status/,
    /required openmrs version/,
  ];

  expectedColumnHeaders.forEach((row) => {
    expect(
      screen.getByRole("columnheader", { name: new RegExp(row, "i") })
    ).toBeInTheDocument();
  });

  expect(screen.getByText(testModule.description)).toBeInTheDocument();
});

function renderModuleInfo() {
  // Renders the `ModuleInfo` component within an SWR context
  renderWithSwr(<ModuleInfo />);
}
