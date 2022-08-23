import React from "react";
import { ConfigurableLink } from "@openmrs/esm-framework";

export default function ModuleManagementAppMenuLink() {
  return (
    <ConfigurableLink to="${openmrsSpaBase}/module-management">
      Module Management
    </ConfigurableLink>
  );
}
