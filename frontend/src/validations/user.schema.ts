import * as Yup from 'yup';

export const userSchema = (isEdit = false) =>
  Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),

    password: isEdit
      ? Yup.string().notRequired()
      : Yup.string()
          .min(6, 'Minimum 6 characters')
          .required('Password is required'),

    user_type_id: Yup.number()
      .required('User type is required')
      .moreThan(0, 'User type is required'),

    permissions: Yup.array()
      .of(Yup.number())
      .min(1, 'Select at least one permission'),
  });
