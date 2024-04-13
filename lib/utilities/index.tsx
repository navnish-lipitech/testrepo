import { handleToast } from "@lipihipi/rtc-ui-components";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import * as yup from "yup";

export const categoryTypeArr = [
  { label: "Lawyer", value: "lawyer" },
  { label: "Knowledgebank", value: "knowledge_bank" },
  { label: "Document Template", value: "document_template" },
  { label: "Article", value: "article" },
  { label: "Feedback", value: "feedback" },
];

export interface HeadCell {
  disablePadding: boolean;
  id: any;
  label: string;
  numeric?: boolean;
  aling: "center" | "inherit" | "left" | "right" | "justify" | undefined;
}

export const BlogHeadCells: HeadCell[] = [
  {
    id: "Section",
    numeric: true,
    disablePadding: false,
    label: "Section",
    aling: "left",
  },
  {
    id: "Category",
    numeric: true,
    disablePadding: false,
    label: "Category",
    aling: "left",
  },
  {
    id: "Title",
    numeric: true,
    disablePadding: false,
    label: "Title",
    aling: "left",
  },
  {
    id: "Status",
    numeric: true,
    disablePadding: false,
    label: "Status",
    aling: "center",
  },
  {
    id: "Action",
    numeric: true,
    disablePadding: false,
    label: "Action",
    aling: "center",
  },
];


export interface IData {
  createdAt: any;
  updatedAt: String;
  _id: string;
  active: boolean;
  name: string;
  section: string;
  category: string;
  description: string;
  canonicalUrl: string;
  schema: string;
  permalink: string;
}

export const createData = (
  createdAt: any,
  updatedAt: any,
  id: string,
  active: boolean,
  name: string,
  section: string,
  category: string,
  description: string,
  canonicalUrl: string,
  schema: string,
  permalink: string
): IData => {
  return {
    createdAt,
    updatedAt,
    _id: id,
    active,
    name,
    section,
    category,
    description,
    canonicalUrl,
    schema,
    permalink,
  };
};

export const formatDate = (
  inputDate: any,
  separateBy = "-",
  format = "YYYY-MM-DD HH:mm"
): string => {
  try {
    const date = new Date(inputDate);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const formattedDate = format
      .replace("YYYY", year.toString())
      .replace("MM", month)
      .replace("DD", day)
      .replace("HH", hours)
      .replace("mm", minutes);
    return formattedDate.replace(/-/g, separateBy);
  } catch (error) {
    return "";
  }
};
