import * as Yup from 'yup';

export const standardSchema = (isEdit = false) =>
  Yup.object({
    standard: isEdit
      ? Yup.string().notRequired()
      : Yup.string().required('Standard is required'),
    subject_ids: Yup.array()
      .of(Yup.number())
      .min(1, 'Select at least one subject'),
  });
