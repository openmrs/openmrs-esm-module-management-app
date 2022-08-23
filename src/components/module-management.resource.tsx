import { openmrsFetch } from "@openmrs/esm-framework";
import useSwr from "swr";

/**
 * Represents a Module object returned from the REST API Module resource.
 */
interface RestModule {
  author: string;
  awareOfModules: Array<string>;
  description: string;
  display: string;
  name: string;
  packageName: string;
  requiredModules: Array<string>;
  requireOpenmrsVersion: string;
  resourceVersion: string;
  started: boolean;
  uuid: string;
  version: string;
}

/**
 * Returns all module entries from the `Module` resource, an error object, and two status booleans: `isLoading` and `isValidating`.
 */
export function useModules() {
  const url = `/ws/rest/v1/module/?v=full`;

  // The `useSwr` hook accepts a key (the API url in this case) and an asynchronous fetcher function
  const { data, error, isValidating } = useSwr<
    { data: { results: Array<RestModule> } },
    Error
  >(url, openmrsFetch);

  // Map through the returned response and sort the module entries alphabetically
  const modules = data?.data?.results
    ?.map((moduleDefinitions) => moduleDefinitions)
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  return {
    modules: modules,
    isError: error,
    isLoading: !data && !error,
    isValidating: isValidating,
  };
}
