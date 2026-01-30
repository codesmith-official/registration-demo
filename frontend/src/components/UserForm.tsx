'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import { UserType } from '@/lib/api/userType/userTypes';
import { userSchema } from '@/src/validations/user.schema';

type Props = {
  initialValues: {
    name: string;
    email: string;
    password: string;
    user_type_id: number;
    permissions: number[];
  };
  userTypes: UserType[];
  onSubmit: (values: any) => void;
  submitLabel?: string;
  isEdit?: boolean;
};

export default function UserForm({
  isEdit,
  initialValues,
  userTypes,
  onSubmit,
  submitLabel = 'Create User',
}: Props) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={userSchema(isEdit)}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, isSubmitting }) => {
        const selectedType = userTypes.find(
          (u) => u.id === values.user_type_id,
        );

        return (
          <Form className='bg-white border border-gray-200 rounded-lg p-6 space-y-4'>
            <div>
              <Field
                name='name'
                placeholder='Name'
                className='w-full border px-3 py-2 rounded'
              />
              <ErrorMessage
                name='name'
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
                as='select'
                name='user_type_id'
                className='w-full border px-3 py-2 rounded'
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const id = Number(e.target.value);
                  setFieldValue('user_type_id', id);
                  setFieldValue('permissions', []);
                }}
              >
                <option value={0}>Select User Type</option>
                {userTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name='user_type_id'
                component='p'
                className='text-sm text-red-600 mt-1'
              />
            </div>

            {selectedType && (
              <div>
                <p className='text-sm font-medium mb-2'>Permissions</p>
                <div className='grid grid-cols-2 gap-2'>
                  {selectedType.permissions.map((perm) => (
                    <label
                      key={perm.id}
                      className='flex items-center gap-2 text-sm'
                    >
                      <input
                        type='checkbox'
                        checked={values.permissions.includes(perm.id)}
                        onChange={() => {
                          const next = values.permissions.includes(perm.id)
                            ? values.permissions.filter((id) => id !== perm.id)
                            : [...values.permissions, perm.id];
                          setFieldValue('permissions', next);
                        }}
                      />
                      {perm.key}
                    </label>
                  ))}
                </div>
                <ErrorMessage
                  name='permissions'
                  component='p'
                  className='text-sm text-red-600 mt-1'
                />
              </div>
            )}

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
