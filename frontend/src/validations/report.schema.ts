import * as Yup from 'yup';

export const reportSchema = () =>
  Yup.object({
    standard_id: Yup.number()
      .required('Standard is required')
      .moreThan(0, 'Standard is required'),

    student_id: Yup.number()
      .required('Student is required')
      .moreThan(0, 'Student is required'),

    marks: Yup.array()
      .of(
        Yup.object({
          subject_id: Yup.number()
            .required('Subject ID is required')
            .moreThan(0, 'Invalid Subject'),
          marks: Yup.number()
            .required('Marks are required')
            .min(0, 'Marks cannot be negative')
            .max(100, 'Marks cannot exceed 100'),
        }),
      )
      .min(1, 'At least one subject mark is required'),
  });
