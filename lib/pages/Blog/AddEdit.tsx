import React, { useEffect, useState } from "react";
import {
  Button,
  FileUpload,
  Form,
  InputBox,
  RichTextEditor,
  SelectBox,
  Text,
  handleToast,
} from "@lipihipi/rtc-ui-components";
import {
  Box,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@mui/material";
import { ICreateProps } from "./types";
import { KnowledgeBankValidation } from "./validation";
import { languageArr } from "@lib/constants";
export const AddEdit: React.FC<ICreateProps> = ({
  id,
  onCreate,
  onUpdate,
  onCancel,
  getBlog,
  uploadFile,
  onAddEditSuccess,
  fetchSection,
  fetchCategory,
  assetUrl,
  fetchUser,
  domainUrl,
  deleteFile
}) => {
  const [sectionList, setSectionList] = useState<any>([]);
  const [userList, setUserList] = useState<any>([]);
  const [categoryList, setCategoryList] = useState<any>([]);
  const [subCategoryList, setSubCategoryList] = useState<any>([]);
  const [section, setSection] = useState<any>(null);
  const [initialValues, setInitialValues] = useState<any>({
    language: "English",
    title: "",
    description: "",
    seo: {
      title: "",
      description: "",
      metaTags: [
        {
          name: "Keyword",
          content: "",
        },
      ],
    },
    heading: "",
    subHeading: "",
    image: "",
    permalink: "",
    canonicalUrl: "",
  });
  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);
  useEffect(() => {
    Promise.all([
      fetchSection({
        pageSize: 500,
        isRecent: true,
        active: true,
      }),
      fetchUser({
        pageSize: 500,
        isRecent: true,
        active: true,
        status: "Approved",
      }),
    ]).then((res) => {
      const [sectionData, userData] = res;
      setSectionList(sectionData.data.data.list);
      setUserList(userData.data.data.list);
    });
  }, []);
  const fetchBlog = async () => {
    const response: any = await getBlog(id);
    setInitialValues(response.data.data);
    fetchCategoryList(response.data.data.section);
    if(response.data.data.subCategory){
      fetchSubCategoryList(response.data.data.category);
    }
  };

  const fetchCategoryList = async (section: any) => {
    const response: any = await fetchCategory({
      pageSize: 500,
      isRecent: true,
      section: section,
      active: true,
    });
    setCategoryList(response.data.data.list);
  };
  const fetchSubCategoryList = async (parent: any) => {
    const response: any = await fetchCategory({
      pageSize: 500,
      isRecent: true,
      parent: parent,
      active: true,
    });
    setSubCategoryList(response.data.data.list);
  };

  return (
    <>
      <Text sx={{ padding: "1rem 0 1rem 0.5rem" }}>
        {id ? "Edit Knowledge bank" : "Add Knowledge bank"}
      </Text>
      <Form
        initialValues={initialValues}
        validationSchema={KnowledgeBankValidation}
        enableReinitialize={true}
        onSubmit={async (values: any) => {
          const payload: any = Object.fromEntries(
            Object.entries(values).filter(([_, value]) => value !== "")
          );
          if (payload.seo.metaTags.length === 0 && !payload.seo.metaTags[0]?.content) {
            delete payload.seo.metaTags;
          }
          if (id) {
            await onUpdate(id, {
              ...payload,
            });
          } else {
            await onCreate(payload);
          }
          onAddEditSuccess();
          handleToast(
            id
              ? "Knowledge bank Updated Successfully"
              : "Knowledge bank Created Successfully",
            "success"
          );
        }}
        render={({
          handleChange,
          isSubmitting,
          values,
          dirty,
          setFieldValue,
          isValid,
        }: any) => {
          return (
            <>
              <Card>
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  gap={"1.5rem"}
                  padding={"2rem 0 2rem 2rem"}
                  width={"50%"}
                >
                  <FormControl>
                    <FormLabel required>Language</FormLabel>
                    <SelectBox
                      name="language"
                      size="medium"
                      required
                      label="Language"
                      options={Object.keys(languageArr).map((key) => ({
                        value: key,
                        label: key,
                      }))}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel required>Section</FormLabel>
                    <SelectBox
                      name="section"
                      required
                      size="medium"
                      label="Section"
                      options={sectionList.map((value: any) => ({
                        value: value._id,
                        label: value.name,
                      }))}
                      onChange={(e) => {
                        const selectedOption = sectionList.find(
                          (option: any) => option._id === e.target.value
                        );
                        setSection(selectedOption);
                        fetchCategoryList(e.target.value);
                        setFieldValue("section", e.target.value);
                      }}
                    />
                  </FormControl>
                  <InputBox
                    onChange={(e) => {
                      setFieldValue("name", e.target.value);
                    }}
                    required
                    placeholder="Title"
                    label="Title"
                    name="name"
                  />
                  {values.language &&
                    values.language !== languageArr["English"] && (
                      <InputBox
                        required
                        onChange={handleChange}
                        placeholder={`Title in ${values.language}`}
                        label={`Title in ${values.language}`}
                        name="otherTitle"
                      />
                    )}

                  <FormControl>
                    <FormLabel required>Category</FormLabel>
                    <SelectBox
                      name="category"
                      required
                      size="medium"
                      label="Category"
                      disabled={!categoryList.length}
                      options={categoryList.map((value: any) => ({
                        value: value._id,
                        label: value.name,
                      }))}
                      onChange={(e) => {
                        setFieldValue("category", e.target.value);
                        fetchSubCategoryList(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Sub Category</FormLabel>
                    <SelectBox
                      name="subCategory"
                      required
                      disabled={!subCategoryList.length}
                      size="medium"
                      label="Sub Category"
                      options={subCategoryList.map((value: any) => ({
                        value: value._id,
                        label: value.name,
                      }))}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <InputBox
                    onChange={handleChange}
                    placeholder="Source"
                    label="Source"
                    name="source"
                  />
                  <FormControl>
                    <FormLabel>Author</FormLabel>
                    <SelectBox
                      name="user"
                      disabled={!userList.length}
                      size="medium"
                      label="Select Author"
                      options={userList.map((value: any) => ({
                        value: value._id,
                        label: `${value.firstName} ${value.lastName}`,
                      }))}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <Box sx={{ width: "max-content" }}>
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Mark title as Permalink and Canonical Url"
                        checked={values.isHeaderMenu}
                        onChange={(e: any) => {
                          setFieldValue(
                            "permalink",
                            `${domainUrl}/knowledge-bank/${section?.slug}/${values?.name?.trim().replace(/\s+/g, "-")}`
                          );
                          setFieldValue(
                            "canonicalUrl",
                            `${domainUrl}/knowledge-bank/${section?.slug}/${values?.name?.trim().replace(/\s+/g, "-")}`
                          );
                        }}
                      />
                    </FormGroup>
                  </Box>

                  <InputBox
                    required
                    onChange={handleChange}
                    placeholder="Permalink"
                    label="Permalink"
                    name="permalink"
                  />
                  <InputBox
                    required
                    onChange={handleChange}
                    placeholder="Canonical Url"
                    label="Canonical Url"
                    name="canonicalUrl"
                  />

                  <RichTextEditor
                    required
                    id={`description`}
                    label={"Description"}
                    name={"description"}
                    maxHeight={600}
                    uploadFile={uploadFile}
                    imageBaseUrl={assetUrl}
                  />
                  <InputBox
                    required
                    onChange={handleChange}
                    placeholder="Enter meta title"
                    label="Meta title"
                    name="seo.title"
                  />
                  <InputBox
                    required
                    onChange={handleChange}
                    placeholder="Enter meta description"
                    label="Meta Description"
                    name="seo.description"
                  />
                  <InputBox
                    onChange={handleChange}
                    placeholder="Meta Keywords"
                    label="Meta Keywords"
                    name="seo.metaTags[0].content"
                  />
                  <InputBox
                    onChange={handleChange}
                    placeholder="Custom Schema"
                    label="Custom Schema"
                    name="schema"
                  />

                  <Box
                    flexGrow={1}
                    sx={{
                      "& .row + div": {
                        mt: 2,
                        "& > div": {
                          margin: 0,
                          gap: "1rem",
                          width: "100%",
                          "& svg": {
                            width: "1.5rem",
                            height: "1.5rem",
                          },
                          "& > div": {
                            flexGrow: 1,
                            "& .card-title": {
                              placeContent: "hrrl",
                            },

                            "& p": {
                              margin: 0,
                            },
                          },
                        },
                      },
                      "& .col-md-2": {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: 2,
                      },
                      "& .custom-file label": {
                        border: "none",
                        cursor: "pointer",
                        background: "#e2e2e2",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                      },
                    }}
                  >
                    <FileUpload
                      name={`image`}
                      upload={uploadFile}
                      accept={["image/jpeg", "image/jpg", "image/png"]}
                      label={"Banner Image"}
                      maxSize={"10mb"}
                      assetUrl={assetUrl}
                      required
                      onDelete={deleteFile}
                    />
                  </Box>
                </Box>
                <Box
                  gap={2}
                  display="flex"
                  justifyContent={"flex-end"}
                  sx={{
                    borderTop: "1px solid #ECECEC",
                    p: "1rem 1rem 1rem",
                  }}
                >
                  <Button
                    disabled={
                      isSubmitting || id ? !(isValid && dirty) : !isValid
                    }
                    type="submit"
                    variant="contained"
                  >
                    Submit
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      color: "#765847",
                      border: "1px solid #765847",
                    }}
                    onClick={() => {
                      onCancel();
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Card>
            </>
          );
        }}
      />
    </>
  );
};
