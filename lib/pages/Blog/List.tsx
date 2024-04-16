import React, { useRef, useState } from "react";
import { Box, Card, CardContent, IconButton, debounce } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import {
  EnhancedTableWithPagination,
  Button,
  SearchBar,
  Form as CustomForm,
  AnimationWrapper,
  Text,
  Icon,
  NoDataFound,
  Loader,
  handleToast,
  ConfirmationModal,
  Restricted,
  PermissionFallback,
  Datepicker,
  SelectBox,
} from "@lipihipi/rtc-ui-components";

import { BlogHeadCells, createData } from "../../utilities";
import { Filters, IListProps } from "./types";
import { MODULE_PERMISSION_NAMES, PERMISSIONS } from "../../constants";
import { createParams } from "@lib/utils";

export const List: React.FC<IListProps> = ({
  onAdd,
  onEdit,
  fetchBlogPage,
  onUpdate,
  language,
  fetchCategories,
  fetchSections,
}) => {
  const [total, setTotal] = useState(0);
  const [rowsPerPageData, setRowsPerPageData] = useState(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = React.useState(0);
  const [pageData, setPageData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [showBlockActivity, setShowBlockActivity] = useState<boolean>(false);
  const selectedRow = useRef<Record<string, any> | null>(null);
  const [openFilters, setOpenFilters] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    search: "",
    from: "",
    to: "",
    category: "",
    section: "",
  });
  React.useEffect(() => {
    fetchKnowledgeBankList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, language]);
  React.useEffect(() => {
    Promise.all([
      fetchCategories({
        pageSize: 500,
        active: true,
        isRecent: true,
        type: "knowledge_bank",
      }),
      fetchSections({
        pageSize: 500,
        active: true,
        isRecent: true,
      }),
    ]).then((res) => {
      const [categoriesData, sectionsData] = res;
      setCategories(categoriesData.data.data.list);
      setSections(sectionsData.data.data.list);
    });
  }, []);
  const onStatusChange = () => {
    return new Promise(async (rs, rj) => {
      console.log(selectedRow);
      if (selectedRow.current) {
        await onUpdate(selectedRow.current?._id, {
          active: !selectedRow.current.active,
        })
          .then(() => {
            handleToast("Page Updated Successfully", "success");
            fetchKnowledgeBankList();
            setShowBlockActivity(false);
            rs("");
          })
          .catch((err: any) => {
            console.log("Error", err);
            rj(err);
          });
      }
    });
  };
  const fetchKnowledgeBankList = async (
    page: number = pageNumber,
    pageSize: number = rowsPerPageData
  ) => {
    try {
      setRowsPerPageData(pageSize);
      setLoading(true);
      const params = createParams({
        isRecent: "true",
        page: (page + 1).toString(),
        language: language,
        // Optional params
        ...filters,
        pageSize: pageSize?.toString(),
      });
      const pages = await fetchBlogPage(params);
      setLoading(false);
      setTotal(pages.data.data.total);
      let pageArr = pages.data.data.list.map((ele: any) => {
        return createData(
          ele.createdAt,
          ele.updatedAt,
          ele._id,
          ele.active,
          ele.name,
          ele?.section?.name,
          ele?.category?.name,
          ele.description,
          ele.canonicalUrl,
          ele.schema,
          ele.permalink
        );
      });
      setPageData(pageArr);
    } catch (error) {}
  };

  const onChangeSearch = debounce(({ target: { value } }: any) => {
    setFilters((prev) => ({ ...prev, search: value }));
  }, 500);

  const handlePageChange = (page: number, pageSize: number) => {
    setRowsPerPageData(pageSize);
    fetchKnowledgeBankList(page, pageSize);
    setPageNumber(page);
  };
  const onSubmit = (values: Filters) => {
    setFilters((prev) => ({ ...prev, ...values }));
  };
  return (
    <>
      <Card>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={2}
          pt={2}
        >
          <Text variant="h3">List of Knowledge Banks</Text>

          <Box display="flex" gap={1}>
            <Box>
              <IconButton onClick={() => setOpenFilters((p) => !p)}>
                <Icon.Filter />
              </IconButton>
            </Box>
            <CustomForm initialValues={{}}>
              <SearchBar placeholder="search" onChange={onChangeSearch} />
            </CustomForm>
            <Restricted
              to={`${MODULE_PERMISSION_NAMES.KnowledgeBank}:${PERMISSIONS.Write}`}
            >
              <Box gap={1} display="flex">
                <Button
                  size="small"
                  color="secondary"
                  sx={{
                    height: 42,
                    display: "flex",
                    gap: "10px",
                    padding: "0rem 1rem",
                  }}
                  variant="contained"
                  onClick={() => {
                    onAdd();
                  }}
                >
                  <Icon.Add /> Add Knowledge Bank
                </Button>
              </Box>
            </Restricted>
          </Box>
        </Box>
        {openFilters && (
          <AnimationWrapper>
            <CustomForm
              initialValues={filters}
              onSubmit={onSubmit}
              validateOnMount
              validateOnChange
              render={({
                values,
                handleReset,
                setFieldValue,
                handleChange,
              }: any) => (
                <Box display="flex" alignItems="center" gap={2} mt={2} px={2}>
                  <Box>
                    <SelectBox
                      label="Section"
                      size="small"
                      name="section"
                      disabled={!sections.length}
                      options={sections.map((section) => ({
                        value: section._id,
                        label: section.name,
                      }))}
                      onChange={handleChange}
                      sx={{ width: "150px" }}
                    />
                  </Box>
                  <Box>
                    <SelectBox
                      label="Category"
                      size="small"
                      name="category"
                      disabled={!categories.length}
                      options={categories.map((category) => ({
                        value: category._id,
                        label: category.name,
                      }))}
                      onChange={handleChange}
                      sx={{ width: "150px" }}
                    />
                  </Box>
                  <Box>
                    <Datepicker
                      sx={{ margin: "auto" }}
                      onChange={(value: string) => setFieldValue("from", value)}
                      value={values.from}
                      name={"from"}
                      label="From"
                      variant="outlined"
                      slotProps={{
                        textField: {
                          size: "small",
                          error: false,
                        },
                      }}
                    />
                  </Box>
                  <Box>
                    <Datepicker
                      sx={{ margin: "auto" }}
                      onChange={(value: string) => setFieldValue("to", value)}
                      value={values.to}
                      name={"to"}
                      label="To"
                      variant="outlined"
                      slotProps={{
                        textField: {
                          size: "small",
                          error: false,
                        },
                      }}
                    />
                  </Box>

                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ height: 42 }}
                    onClick={() => {
                      handleReset();
                      setFilters((prev) => ({
                        ...prev,
                        category: "",
                        section: "",
                        from: "",
                        to: "",
                      }));
                    }}
                  >
                    Clear
                  </Button>

                  <Button
                    sx={{ height: 42 }}
                    color="secondary"
                    type="submit"
                    size="small"
                    variant="contained"
                  >
                    Apply
                  </Button>
                </Box>
              )}
            />
          </AnimationWrapper>
        )}
        <CardContent>
          <Restricted
            to={`${MODULE_PERMISSION_NAMES.KnowledgeBank}:${PERMISSIONS.Read}`}
            fallBack={
              <PermissionFallback message="You don't have permission to view Knowledgebank" />
            }
          >
            {!loading ? (
              pageData.length > 0 ? (
                <AnimationWrapper>
                  <EnhancedTableWithPagination
                    stickyHeader={true}
                    maxHeight={"80vh"}
                    checkSelection={false}
                    pagination={true}
                    numSelected={0}
                    headCells={BlogHeadCells}
                    total={total}
                    rowsPerPageData={rowsPerPageData}
                    handlePageChange={(page: number, pageSize: number) =>
                      handlePageChange(page, pageSize)
                    }
                    tableBodyNode={
                      <>
                        {pageData.map((row: any) => (
                          <TableRow hover sx={{ cursor: "pointer" }}>
                            <TableCell sx={{ color: "#000000" }} align="left">
                              {row.section}
                            </TableCell>
                            <TableCell sx={{ color: "#000000" }} align="left">
                              {row.category}
                            </TableCell>
                            <TableCell sx={{ color: "#000000" }} align="left">
                              {row.name}
                            </TableCell>

                            <TableCell align="center">
                              <Text
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <Restricted
                                  to={`${MODULE_PERMISSION_NAMES.KnowledgeBank}:${PERMISSIONS.Edit}`}
                                  fallBack={
                                    <Button
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: `${
                                          row.active ? "#14cc80" : "#FF4A4A"
                                        }`,
                                        width: "85px",
                                        color: "#ffffff",
                                        height: "27px",
                                        fontSize: "14px",
                                        borderRadius: "4px",
                                      }}
                                    >
                                      {row.active ? "Active" : "Inactive"}
                                    </Button>
                                  }
                                >
                                  <Button
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      backgroundColor: `${
                                        row.active ? "#14cc80" : "#FF4A4A"
                                      }`,
                                      width: "72px",
                                      color: "#ffffff",
                                      height: "27px",
                                      fontSize: "14px",
                                      borderRadius: "4px",
                                    }}
                                    onClick={() => {
                                      selectedRow.current = row;
                                      setShowBlockActivity(true);
                                    }}
                                  >
                                    {row.active ? "Active" : "Inactive"}
                                  </Button>
                                </Restricted>
                              </Text>
                            </TableCell>

                            <TableCell>
                              <Restricted
                                to={`${MODULE_PERMISSION_NAMES.KnowledgeBank}:${PERMISSIONS.Edit}`}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "1rem",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      width: "40px",
                                      height: "40px",
                                      borderRadius: "50%",
                                      backgroundColor: "#fafafa",
                                    }}
                                    onClick={() => onEdit(row?._id)}
                                  >
                                    <Icon.Edit />
                                  </Box>
                                </Box>
                              </Restricted>
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    }
                  ></EnhancedTableWithPagination>
                </AnimationWrapper>
              ) : (
                <NoDataFound
                  description={{
                    primary: "Yet you dont have any Knowledge bank",
                  }}
                  action={false}
                />
              )
            ) : (
              <Loader />
            )}
          </Restricted>
        </CardContent>
      </Card>
      <ConfirmationModal
        open={showBlockActivity}
        onClose={() => {
          setShowBlockActivity(false);
        }}
        onConfirm={onStatusChange}
        title="Are you sure?"
        description={`Are you sure want to ${
          selectedRow?.current?.active ? "Inactive" : "Active"
        }`}
      />
    </>
  );
};
