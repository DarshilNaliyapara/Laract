import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css"; // Base styles
import "ag-grid-community/styles/ag-theme-alpine.css"; // Alpine theme

// Import required modules
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";

// Register required modules
ModuleRegistry.registerModules([ClientSideRowModelModule]);

type AgGridTableProps = {
  rowData: any[];
  columnDefs: ColDef[];
};

const AgGridTable: React.FC<AgGridTableProps> = ({ rowData, columnDefs }) => {
  return (
    <div className="ag-theme-alpine dark-mode" style={{ height: 400, width: "100%" }}>
      <AgGridReact rowData={rowData} columnDefs={columnDefs} pagination />
    </div>
  );
};

export default AgGridTable;
