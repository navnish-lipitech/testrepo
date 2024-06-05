import React, { useEffect, useState } from "react";
import {
  Button,
  Datepicker,
  Form,
  ImageCropper,
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
import { createPayload } from "@lib/utils";
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
  deleteFile,
}) => {
  const [sectionList, setSectionList] = useState<any>([]);
  const [userList, setUserList] = useState<any>([]);
  const [categoryList, setCategoryList] = useState<any>([]);
  const [subCategoryList, setSubCategoryList] = useState<any>([]);
  const [section, setSection] = useState<any>(null);
  const [sectionId, setSectionId] = useState<any>(null);
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
    section: "",
  });
  useEffect(() => {
    Promise.all([
      fetchSection({
        pageSize: 500,
        isRecent: true,
        active: true,
      }),
      fetchUser({
        pageSize: 1500,
        isRecent: true,
        active: true,
        status: "Approved",
        userType: "Lawyer",
      }),
    ]).then((res) => {
      const [sectionData, userData] = res;
      setSectionList(sectionData.data.data.list);
      setUserList(userData.data.data.list);
    });
  }, []);
  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);
  useEffect(() => {
    getSectionValue(sectionId);
  }, [sectionList, sectionId]);

  const fetchBlog = async () => {
    await getBlog(id).then((res: any) => {
      console.log(res.data.data.section);
      setInitialValues(res.data.data);
      fetchCategoryList(res.data.data.section);
      setSectionId(res.data.data.section);
      if (res.data.data.subCategory) {
        fetchSubCategoryList(res.data.data.category);
      }
    });
  };

  const getSectionValue = (value: any) => {
    const selectedOption = sectionList.find(
      (option: any) => option._id === value
    );
    setSection(selectedOption);
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
          if (values.image && !values?.image?._id) {
            let imagePayload: any = {
              file: values.image,
            };
            await uploadFile(imagePayload).then((res: any) => {
              values.image = res.data.data._id;
            });
          }
          let payload: any = createPayload(values);
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
                      size="small"
                      label="Language"
                      required
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
                      size="small"
                      label="Section"
                      disabled={!sectionList.length}
                      options={sectionList.map((value: any) => ({
                        value: value._id,
                        label: value.name,
                      }))}
                      onChange={(e) => {
                        getSectionValue(e);
                        fetchCategoryList(e);
                        // setFieldValue("section", e);
                        handleChange(e);
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
                    size="small"
                  />
                  {values.language &&
                    values.language !== languageArr["English"] && (
                      <InputBox
                        size="small"
                        required
                        onChange={handleChange}
                        placeholder={`Title in ${values.language}`}
                        label={`Title in ${values.language}`}
                        name="otherTitle"
                      />
                    )}

                  <FormControl>
                    <FormLabel required>Parent Category</FormLabel>
                    <SelectBox
                      name="category"
                      required
                      size="small"
                      label="Category"
                      disabled={!categoryList.length}
                      options={categoryList.map((value: any) => ({
                        value: value._id,
                        label: value.name,
                      }))}
                      onChange={(e) => {
                        handleChange(e);
                        fetchSubCategoryList(e);
                      }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Sub Category</FormLabel>
                    <SelectBox
                      name="subCategory"
                      required
                      disabled={!subCategoryList.length}
                      size="small"
                      label="Sub Category"
                      options={subCategoryList.map((value: any) => ({
                        value: value._id,
                        label: value.name,
                      }))}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <InputBox
                    size="small"
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
                      size="small"
                      label="Select Author"
                      options={userList.map((value: any) => ({
                        value: value._id,
                        label: `${value.firstName} ${value.lastName}`,
                      }))}
                      onChange={handleChange}
                    />
                  </FormControl>

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
                    size="small"
                    required
                    onChange={handleChange}
                    placeholder="Enter meta title"
                    label="Meta title"
                    name="seo.title"
                  />
                  <InputBox
                    size="small"
                    required
                    onChange={handleChange}
                    placeholder="Enter meta description"
                    label="Meta Description"
                    name="seo.description"
                  />
                  <InputBox
                    size="small"
                    onChange={handleChange}
                    placeholder="Meta Keywords"
                    label="Meta Keywords"
                    name="seo.metaTags[0].content"
                  />
                  <FormControl>
                    <FormLabel>Last Updated Date</FormLabel>
                    <Datepicker
                      sx={{ margin: "auto" }}
                      onChange={(value: string) =>
                        setFieldValue("lastUpdatedAt", value)
                      }
                      value={values.lastUpdatedAt}
                      name={"lastUpdatedAt"}
                      variant="outlined"
                      slotProps={{
                        textField: {
                          error: false,
                          size: "small",
                        },
                      }}
                    />
                  </FormControl>
                  <InputBox
                    size="small"
                    onChange={handleChange}
                    placeholder="Custom Schema"
                    label="Custom Schema"
                    name="schema"
                  />

                  <ImageCropper
                    id="image"
                    name={"image"}
                    label="Upload Image"
                    previewPic={values?.image}
                    width={250}
                    ratio={2 / 1}
                    accept={["image/*"]}
                    deleteFile={deleteFile}
                    imageBaseUrl={assetUrl}
                    previewCrop={false}
                  />

                  <Box sx={{ width: "100%" }}>
                    <Box
                      display={"inline-flex"}
                      justifyContent={"flex-end"}
                      width={"100%"}
                    >
                      <Button
                        sx={{
                          height: "40px",
                        }}
                        color="secondary"
                        onClick={() => {
                          setFieldValue(
                            "permalink",
                            `${domainUrl}/knowledge-bank/${section?.slug}/${values?.name?.trim().replace(/\s+/g, "-").toLowerCase()}`
                          );
                          setFieldValue(
                            "canonicalUrl",
                            `${domainUrl}/knowledge-bank/${section?.slug}/${values?.name?.trim().replace(/\s+/g, "-").toLowerCase()}`
                          );
                        }}
                      >
                        Mark permalink
                      </Button>
                    </Box>
                    {/* <FormGroup>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Mark title as Permalink and Canonical Url"
                        checked={values.isHeaderMenu}
                      />
                    </FormGroup> */}
                  </Box>

                  <InputBox
                    size="small"
                    required
                    onChange={handleChange}
                    placeholder="Permalink"
                    label="Permalink"
                    name="permalink"
                  />
                  <InputBox
                    size="small"
                    required
                    onChange={handleChange}
                    placeholder="Canonical Url"
                    label="Canonical Url"
                    name="canonicalUrl"
                  />
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
