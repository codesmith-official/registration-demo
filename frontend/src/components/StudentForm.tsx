'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Standard } from '@/lib/api/standard/standards';
import { studentSchema } from '../validations/student.schema';

type Props = {
  initialValues: {
    first_name: string;
    last_name: string;
    gender: '' | 'male' | 'female';
    standard_id: number;
    email: string;
    password?: string;
    contact_number: string;
    bio: string;
  };
  standards: Standard[];
  onSubmit: (values: any) => void;
  submitLabel?: string;
  isEdit?: boolean;
};

export default function StudentForm({
  isEdit,
  initialValues,
  standards,
  onSubmit,
  submitLabel = 'Create User',
}: Props) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={studentSchema(isEdit)}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ setFieldValue, isSubmitting }) => {
        return (
          <Form className='bg-white border border-gray-200 rounded-lg p-6 space-y-4'>
            <div>
              <Field
                name='first_name'
                placeholder='First Name'
                className='w-full border px-3 py-2 rounded'
              />
              <ErrorMessage
                name='first_name'
                component='p'
                className='text-sm text-red-600 mt-1'
              />
            </div>

            <div>
              <Field
                name='last_name'
                placeholder='Last Name'
                className='w-full border px-3 py-2 rounded'
              />
              <ErrorMessage
                name='last_name'
                component='p'
                className='text-sm text-red-600 mt-1'
              />
            </div>

            <div>
              <Field
                as='select'
                name='gender'
                className='w-full border px-3 py-2 rounded'
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setFieldValue('gender', e.target.value);
                }}
              >
                <option value={''}>Select Gender</option>
                <option key='male' value='male'>
                  Male
                </option>
                <option key='female' value='female'>
                  Female
                </option>
              </Field>
              <ErrorMessage
                name='gender'
                component='p'
                className='text-sm text-red-600 mt-1'
              />
            </div>

            <div>
              <Field
                as='select'
                name='standard_id'
                className='w-full border px-3 py-2 rounded'
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const id = Number(e.target.value);
                  setFieldValue('standard_id', id);
                }}
              >
                <option value={0}>Select Standard</option>
                {standards.map((std) => (
                  <option key={std.id} value={std.id}>
                    {std.standard}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name='standard_id'
                component='p'
                className='text-sm text-red-600 mt-1'
              />
            </div>

            <div>
              <Field
                name='email'
                type='email'
                placeholder='Email'
                className='w-full border px-3 py-2 rounded'
              />
              <ErrorMessage
                name='email'
                component='p'
                className='text-sm text-red-600 mt-1'
              />
            </div>

            {!isEdit && (
              <div>
                <Field
                  name='password'
                  type='password'
                  placeholder='Password'
                  className='w-full border px-3 py-2 rounded'
                />
                <ErrorMessage
                  name='password'
                  component='p'
                  className='text-sm text-red-600 mt-1'
                />
              </div>
            )}

            <div>
              <Field
                name='contact_number'
                placeholder='Contact Number'
                className='w-full border px-3 py-2 rounded'
              />
              <ErrorMessage
                name='contact_number'
                component='p'
                className='text-sm text-red-600 mt-1'
              />
            </div>

            <div>
              <Field
                name='bio'
                placeholder='Bio'
                className='w-full border px-3 py-2 rounded'
              />
              <ErrorMessage
                name='bio'
                component='p'
                className='text-sm text-red-600 mt-1'
              />
            </div>

            <div className='flex justify-end'>
              <button
                type='submit'
                disabled={isSubmitting}
                className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
              >
                {isSubmitting ? 'Saving...' : submitLabel}
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
