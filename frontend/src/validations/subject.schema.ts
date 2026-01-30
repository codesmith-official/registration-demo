import * as Yup from 'yup';

export const subjectSchema = (isEdit = false) =>
  Yup.object({
    subject: isEdit
      ? Yup.string().notRequired()
      : Yup.string().required('Standard is required'),
  });
