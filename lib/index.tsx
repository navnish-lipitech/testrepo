import "./index.scss";
import {
  APIContextProvider,
  PermissionProvider,
} from "@lipihipi/rtc-ui-components";
import {
  AddEditBlogCopy,
  BlogListCopy,
} from "./pages/Blog";


const BlogList = ({ state, appData, ...props }: any) => {
  return (
      <APIContextProvider apiHandlers={props} state={state} appData={appData}>
        <PermissionProvider
          permissions={state.user.modelPermissions || {}}
          isSuperAdmin={state?.user?.isSuperAdmin}
        >
          <BlogListCopy {...props} />
        </PermissionProvider>
      </APIContextProvider>
  );
};
const AddEditBlog = ({ state, appData, ...props }: any) => {
  return (
      <APIContextProvider apiHandlers={props} state={state} appData={appData}>
        <PermissionProvider
          permissions={state.user.modelPermissions || {}}
          isSuperAdmin={state?.user?.isSuperAdmin}
        >
          <AddEditBlogCopy {...props} />
        </PermissionProvider>
      </APIContextProvider>
  );
};

export { BlogList, AddEditBlog };
