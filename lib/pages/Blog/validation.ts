import * as yup from "yup";

const SeoJoiSchema = {
  title: yup.string().trim().required('Seo title is required'),
  description: yup.string().trim().required('Seo description is required'),
  metaTags: yup.array().of(
    yup.object({
      content: yup.string().trim().optional(),
      name: yup.string().trim().optional(),
    })
  ),
};

export const KnowledgeBankValidation = yup.object().shape({
  name: yup.string().required("Title is Required"),
  section: yup.mixed().required("Section is Required"),
  category: yup.mixed().required("Category is Required"),
  subCategory: yup.mixed().optional(),
  description: yup.string().required("Description is required"),
  permalink: yup.string().required("Permanent link is required"),
  canonicalUrl: yup.string().required("Canonical url is required"),
  schema: yup.string().optional(),
  image: yup.mixed().required("Banner image is required"),
  source: yup.string().optional(),
  seo:yup.object(SeoJoiSchema).optional()
});


