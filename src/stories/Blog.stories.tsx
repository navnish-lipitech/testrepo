import React, { useState } from "react";
import RtcAPI from "@lipihipi/rtc-client-sdk";
import { ToastContainer } from "@lipihipi/rtc-ui-components";
import { BlogList, AddEditBlog } from "@lib";
/** Template to render the component with auth */
const Template = ({ Component, ...args }: any) => {
  /** Use this code when implementing authentication */
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<Record<string, any> | null>(null);

  React.useEffect(() => {
    RtcAPI.auth
      .login({
        email: "admin@restthecase.com",
        // email: "nisha@gmail.com",
        password: "password",
      })
      .then((data: any) => {
        console.log(data);
        RtcAPI.user.me().then((res) => {
          setUser(res.data.data);
          setLoggedIn(true);
        });
      });
  }, []);

  return loggedIn ? (
    <>
      <ToastContainer />
      <Component {...args} state={{ user }} />
    </>
  ) : (
    <></>
  );
};

export const Listing = () => {
  return (
    <Template
      Component={BlogList}
      onAdd={console.log("Add")}
      onEdit={(id: string) => {
        console.log("onAdd", id);
      }}
      fetchBlogPage={RtcAPI.knowledgebank.list}
      onUpdate={RtcAPI.knowledgebank.update}
      language="English"
      fetchCategories={RtcAPI.category.list}
      fetchSections={RtcAPI.section.list}
    />
  );
};

export const Add = () => {
  return (
    <Template
      Component={AddEditBlog}
      onCreate={RtcAPI.knowledgebank.create}
      onUpdate={RtcAPI.knowledgebank.update}
      getBlog={RtcAPI.knowledgebank.get}
      fetchSection={RtcAPI.section.list}
      fetchCategory={RtcAPI.category.list}
      onCancel={console.log("hello")}
      onAddEditSuccess={() => {
        console.log("onAddEditSuccuss");
      }}
      uploadFile={RtcAPI.asset.create}
      fetchUser={RtcAPI.user.getLawyerList}
      assetUrl={"https://rtc-dev.s3.ap-south-1.amazonaws.com"}
      deleteFile={RtcAPI.asset.remove}
      domainUrl={"https://stage.restthecase.com"}
    />
  );
};

export const Edit = () => {
  return (
    <Template
      Component={AddEditBlog}
      onCreate={RtcAPI.knowledgebank.create}
      onUpdate={RtcAPI.knowledgebank.update}
      getBlog={RtcAPI.knowledgebank.get}
      onCancel={console.log("hello")}
      uploadFile={RtcAPI.asset.create}
      fetchSection={RtcAPI.section.list}
      fetchCategory={RtcAPI.category.list}
      id={"6617e1628f65688897bc2358"}
      onAddEditSuccess={() => {
        console.log("onAddEditSuccuss");
      }}
      fetchUser={RtcAPI.user.getLawyerList}
      assetUrl={"https://rtc-dev.s3.ap-south-1.amazonaws.com"}
      deleteFile={RtcAPI.asset.remove}
      domainUrl={"https://stage.restthecase.com"}
    />
  );
};

export default {
  title: "Knowledgebank",
};
