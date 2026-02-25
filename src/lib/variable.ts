import type { ColTypeDef } from "ag-grid-community";
import { currency, formatDate, formatNumber } from "./formatters";

export const columnWidth = {
  shortColumn1: 100,
  shortColumn2: 150,
  shortColumn3: 200,
  longColumn1: 300,
  longColumn2: 500,
  dateColumn: 150,
  numericColumn: 150,
  timestampColumn: 180,
  fileColumn: 120,
};

export const gridColumnTypes: { [key: string]: ColTypeDef } = {
  currency: {
    valueFormatter: (params) => {
      return currency(params.value) ?? "-";
    },
  },
  formatDateTime: {
    valueFormatter: (params) => {
      return formatDate(params.value, "DD/MM/YYYY HH:mm:ss") ?? "-";
    },
  },
  formatDate: {
    valueFormatter: (params) => {
      return formatDate(params.value, "DD/MM/YYYY") ?? "-";
    },
  },
  nullable: {
    valueFormatter: (params) => {
      return params.value ?? "-";
    },
  },
  upperCase: {
    valueFormatter: (params) => {
      return params.value?.toUpperCase() ?? "-";
    },
  },
  numeric: {
    valueFormatter: (params) => {
      return formatNumber(params.value) ?? "-";
    },
  },
  centerAligned: {
    headerClass: "text-center",
    cellClass: "text-center",
  },
  endAligned: {
    headerClass: "text-end",
    cellClass: "text-end",
  },
};

export const yesAndNoOption = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

export const activeStatus = [
  { label: "AKTIF", value: "ACTIVE", color: "#40C057" },
  { label: "TIDAK AKTIF", value: "NOT_ACTIVE", color: "#FA5252" },
];
