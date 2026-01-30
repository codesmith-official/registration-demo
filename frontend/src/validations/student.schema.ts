import * as Yup from 'yup';

export const studentSchema = (isEdit = false) =>
  Yup.object({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    gender: Yup.string()
      .oneOf(['male', 'female'], 'Gender must be either male or female')
      .required('Gender is required'),
    standard_id: Yup.number()
      .required('Standard is required')
      .moreThan(0, 'Standard is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: isEdit
      ? Yup.string().notRequired()
      : Yup.string()
          .min(6, 'Minimum 6 characters')
          .required('Password is required'),
    contact_number: Yup.string().required('Contact Number is required'),
    bio: Yup.string().required('Bio is required'),
  });
