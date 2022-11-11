import React from "react";
import { useParams } from "react-router-dom";
import { Button, DataTableSkeleton, Tile } from "@carbon/react";
import { ArrowLeft, Play, Renew, StopFilled } from "@carbon/react/icons";
import { ConfigurableLink, UserHasAccess } from "@openmrs/esm-framework";
import { RestModule, useModule } from "./module-info.resource";
import styles from "./module-info.scss";

interface UrlParams {
  moduleUuid: string;
}

interface ModuleListProps {
  modules: Array<string>;
}

function ModuleInfo() {
  // Grab the `moduleUuid` URL parameter from the URL
  const { moduleUuid } = useParams();
  const { module, isError, isLoading } = useModule(moduleUuid);

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.emptyState}>
        <DataTableSkeleton role="progressbar" />
      </div>
    );
  }

  // Empty state
  if (!isLoading && module && !Object.keys(module).length) {
    return (
      <div className={styles.container}>
        <Tile className={styles.tile}>
          <p className={styles.content}>
            There is no data to display about this module.
          </p>
        </Tile>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className={styles.container}>
        <Tile className={styles.tile}>
          <p className={styles.content}>
            Sorry, there was a problem fetching information about this module.
          </p>
        </Tile>
      </div>
    );
  }

  // Rendered when we have module data
  return (
    <>
      <div className={styles.backButton}>
        <ConfigurableLink to={`${window.spaBase}/module-management`}>
          <Button
            kind="ghost"
            renderIcon={(props) => <ArrowLeft size={24} {...props} />}
            iconDescription="Return to Module List"
            size="sm"
          >
            <span>Back to Module List</span>
          </Button>
        </ConfigurableLink>
      </div>
      <div className={styles.container}>
        <h1 className={styles.title}>Module Information</h1>
        <div className={styles.section}>
          <h1 className={styles.subTitle}>{module?.name} Module</h1>
          <UserHasAccess privilege="Manage Modules">
            <ActionButtons module={module} />
          </UserHasAccess>
          <ModuleDetailsTable module={module} />
        </div>
        <div className={styles.section}>
          <h1 className={styles.subTitle}>Required Modules</h1>
          {module.requiredModules?.length ? (
            <ModuleList modules={module.requiredModules} />
          ) : (
            <Tile className={styles.coloredTile}>
              <p className={styles.content}>There are no required modules.</p>
            </Tile>
          )}
        </div>
        <div className={styles.section}>
          <h1 className={styles.subTitle}>
            Aware of Modules (Optionally Required Modules)
          </h1>
          {module.awareOfModules?.length ? (
            <ModuleList modules={module.awareOfModules} />
          ) : (
            <Tile className={styles.coloredTile}>
              <p className={styles.content}>
                This module is not aware of any other modules.
              </p>
            </Tile>
          )}
        </div>
      </div>
    </>
  );
}

/** Renders action buttons on the page if the user viewing the page has sufficient privileges */
function ActionButtons({ module }: { module: RestModule }) {
  return (
    <div className={styles.buttonContainer}>
      {module.started ? (
        <Button
          className={styles.actionButton}
          renderIcon={(props) => <StopFilled size={16} {...props} />}
          kind="danger--ghost"
        >
          <span>Stop</span>
        </Button>
      ) : (
        <Button
          className={styles.actionButton}
          renderIcon={(props) => <Play size={16} {...props} />}
          kind="primary"
        >
          <span>Start</span>
        </Button>
      )}

      <Button
        className={styles.actionButton}
        renderIcon={(props) => <Renew size={16} {...props} />}
        kind="tertiary"
      >
        <span>Check for Updates</span>
      </Button>
    </div>
  );
}

/** Renders a simple table containing module metadata */
function ModuleList({ modules }: ModuleListProps) {
  return (
    <table className={styles.table}>
      <tbody>
        {modules.map((module, index) => (
          <tr key={`module-${index}`}>
            <td>{module}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Renders a detailed table containing module metadata */
function ModuleDetailsTable({ module }: { module: RestModule }) {
  return (
    <table className={styles.tableStriped}>
      <tbody>
        <tr>
          <th>Name</th>
          <td>{module.name}</td>
        </tr>
        <tr>
          <th>Display Name</th>
          <td>{module.display}</td>
        </tr>
        <tr>
          <th>Description</th>
          <td>{module.description}</td>
        </tr>
        <tr>
          <th>Author Name</th>
          <td>{module.author}</td>
        </tr>
        <tr>
          <th>Module Version</th>
          <td>{module.version}</td>
        </tr>
        <tr>
          <th>Current Status</th>
          <td>{module.started ? "Running" : "Stopped"}</td>
        </tr>
        <tr>
          <th>Required OpenMRS Version</th>
          <td>{module.requireOpenmrsVersion}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default ModuleInfo;
