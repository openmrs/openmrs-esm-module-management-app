import React, { useMemo } from "react";
import {
  Button,
  DataTable,
  DataTableHeader,
  DataTableSkeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Tile,
} from "@carbon/react";
import {
  Add,
  CheckmarkFilled,
  CloseFilled,
  Play,
  Renew,
  Search,
} from "@carbon/react/icons";
import { ConfigurableLink, UserHasAccess } from "@openmrs/esm-framework";
import { useModules } from "./module-management.resource";
import styles from "./module-management.scss";

interface FilterProps {
  rowIds: Array<string>;
  headers: Array<DataTableHeader>;
  cellsById: any;
  inputValue: string;
  getCellId: (row, key) => string;
}

function ModuleManagement() {
  const { modules, isError, isLoading } = useModules();

  const headerData = [
    {
      key: "status",
      header: "Status",
    },
    {
      key: "name",
      header: "Name",
    },
    {
      key: "author",
      header: "Author",
    },
    {
      key: "version",
      header: "Version",
    },
    {
      key: "description",
      header: "Description",
    },
  ];

  const rowData = useMemo(
    () =>
      modules?.map((module) => ({
        ...module,
        id: module.uuid,
        name: {
          // The `content` property allows you to override the content that gets rendered in a table cell.
          content: <ModuleInfoLink module={module} />,
        },
        status: module.started ? (
          <CheckmarkFilled size={16} className={styles.runningIcon} />
        ) : (
          <CloseFilled size={16} className={styles.stoppedIcon} />
        ),
      })),
    [modules]
  );

  /**
   * @param {object} config
   * @param {Array<string>} config.rowIds array of all the row ids in the table
   * @param {Array<object>} config.headers
   * @param {object} config.cellsById object containing a map of cell id to cell
   * @param {string} config.inputValue the current input value in the Table Search
   * @param {Function} config.getCellId
   * @returns {Array<string>} rowIds
   */
  function handleFilter({
    rowIds,
    headers,
    cellsById,
    inputValue,
    getCellId,
  }: FilterProps) {
    return rowIds.filter((rowId) =>
      headers.some(({ key }) => {
        const cellId = getCellId(rowId, key);
        const filterableValue = cellsById[cellId].value;
        const filterTerm = inputValue.toLowerCase().trim();

        if (filterableValue.hasOwnProperty("content")) {
          return ("" + filterableValue.content.props.children)
            .toLowerCase()
            .includes(filterTerm);
        }

        return ("" + filterableValue).toLowerCase().includes(filterTerm);
      })
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.emptyState}>
        <DataTableSkeleton role="progressbar" />
      </div>
    );
  }

  // Empty state
  if (modules?.length === 0) {
    return (
      <div className={styles.container}>
        <Tile className={styles.customTile}>
          <p className={styles.content}>There are no modules to display.</p>
        </Tile>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className={styles.container}>
        <Tile className={styles.customTile}>
          <p className={styles.content}>
            Sorry, there was a problem fetching modules.
          </p>
        </Tile>
      </div>
    );
  }

  // Rendered when we have data
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manage Modules</h1>
      <div className={styles.section}>
        <UserHasAccess privilege="Manage Modules">
          <ActionButtons />
        </UserHasAccess>
      </div>
      <DataTable
        // The `filterRows` hook manually controls filtering of the `TableToolbarSearch` component. Any input entered through TableToolbarSearch will be used when the filterRows prop is applied. See: https://react.carbondesignsystem.com/?path=/docs/components-datatable-filtering--default#filtering.
        filterRows={handleFilter}
        headers={headerData}
        rows={rowData}
        size="xl"
        useZebraStyles
      >
        {({ rows, headers, getHeaderProps, getTableProps, onInputChange }) => (
          <TableContainer className={styles.tableContainer}>
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch
                  className={styles.search}
                  expanded
                  onChange={onInputChange}
                  placeholder="Search Modules"
                  size="lg"
                />
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>
                        {cell.value?.content ?? cell.value}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* This empty state tile gets rendered when the search does not yield any matching modules */}
            {rows.length === 0 ? (
              <div className={styles.tileContainer}>
                <Tile className={styles.customTile}>
                  <div className={styles.tileContent}>
                    <p className={styles.content}>No matching modules found.</p>
                  </div>
                </Tile>
              </div>
            ) : null}
          </TableContainer>
        )}
      </DataTable>
    </div>
  );
}

/** Renders action buttons on the page if the user viewing the page has sufficient privileges */
function ActionButtons() {
  return (
    <div className={styles.buttonContainer}>
      <div>
        <Button
          className={styles.actionButton}
          renderIcon={(props) => <Add size={16} {...props} />}
          kind="tertiary"
        >
          <span>Add / Upgrade Modules</span>
        </Button>
        <Button
          className={styles.actionButton}
          renderIcon={(props) => <Search size={16} {...props} />}
          kind="tertiary"
        >
          <span>Search from Addons</span>
        </Button>
        <Button
          className={styles.actionButton}
          renderIcon={(props) => <Renew size={16} {...props} />}
          kind="tertiary"
        >
          <span>Check for Updates</span>
        </Button>
      </div>
      <Button
        className={styles.actionButton}
        renderIcon={(props) => <Play size={16} {...props} />}
        kind="primary"
      >
        <span>Start All</span>
      </Button>
    </div>
  );
}

/**
 * Return a link to the module information page of the module with the corresponding UUID
 * @param module A module object
 */
function ModuleInfoLink({ module }) {
  return (
    <ConfigurableLink
      to={`\${openmrsSpaBase}/module-management/${module.uuid}`}
    >
      <span>{module.name}</span>
    </ConfigurableLink>
  );
}

export default ModuleManagement;
