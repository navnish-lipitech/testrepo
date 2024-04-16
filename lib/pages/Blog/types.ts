export interface IListProps {
  onAdd: any;
  onEdit: (id: string) => void;
  fetchBlogPage: any;
  onUpdate: any;
  language: any;
  fetchCategories: any;
  fetchSections: any;
}

export interface ICreateProps {
  onCreate: any;
  onUpdate: any;
  onCancel: any;
  getBlog: any;
  fetchSection: any;
  fetchCategory: any;
  uploadFile: any;
  id?: any;
  onAddEditSuccess: any;
  assetUrl: any;
  fetchUser:any;
  domainUrl:any;
  deleteFile:any;
}
export type Filters = {
  search: string;
  from: string;
  to: string;
  category: string;
  section: string;
};
