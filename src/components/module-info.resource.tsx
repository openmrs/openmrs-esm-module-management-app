import useSwr from "swr";
import { openmrsFetch } from "@openmrs/esm-framework";

/**
 * Represents a Module object returned from the REST API Module resource.
 */
export interface RestModule {
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
 * Returns an object with the module data corresponding to the provided `moduleUuid`, an error object, and two status booleans: `isLoading` and `isValidating`.
 * @param moduleUuid The UUID of a specific module.
 */
export function useModule(moduleUuid: string) {
  const url = `/ws/rest/v1/module/${moduleUuid}/?v=full`;

  // The `useSwr` hook accepts a key (the API url in this case) and an asynchronous fetcher function
  const { data, error, isValidating } = useSwr<{ data: RestModule }, Error>(
    // Only fetch data when we have a `moduleUuid`
    moduleUuid ? url : null,
    openmrsFetch
  );

  return {
    // Grab the nested data object from the API response
    module: data?.data,
    isError: error,
    isLoading: !data && !error,
    // Used to indicate that SWR is revalidating data
    isValidating: isValidating,
  };
}
