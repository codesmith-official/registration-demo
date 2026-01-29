'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Subject } from '@/lib/api/subject/subjects';
import { standardSchema } from '@/src/validations/standard.schema';

type Props = {
  initialValues: {
    standard: string;
    subject_ids: number[];
  };
  subjects: Subject[];
  onSubmit: (values: any) => void;
  submitLabel?: string;
  isEdit?: boolean;
};

export default function StandardForm({
  isEdit,
  initialValues,
  subjects,
  onSubmit,
  submitLabel = 'Create Standard',
}: Props) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={standardSchema(isEdit)}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, isSubmitting }) => {
        return (
          <Form className='bg-white border border-gray-200 rounded-lg p-6 space-y-4'>
            <div>
              <Field
                name='standard'
                placeholder='Name'
                className='w-full border px-3 py-2 rounded'
              />
              <ErrorMessage
                name='standard'
                component='p'
                className='text-sm text-red-600 mt-1'
              />
            </div>

            <div>
              <p className='text-sm font-medium mb-2'>Subjects</p>
              {
                <div className='grid grid-cols-2 gap-2'>
                  {subjects.map((sub: Subject) => (
                    <label
                      key={sub.id}
                      className='flex items-center gap-2 text-sm'
                    >
                      <input
                        type='checkbox'
                        checked={values.subject_ids.includes(sub.id)}
                        onChange={() => {
                          const next = values.subject_ids.includes(sub.id)
                            ? values.subject_ids.filter((id) => id !== sub.id)
                            : [...values.subject_ids, sub.id];
                          setFieldValue('subject_ids', next);
                        }}
                      />
                      {sub.subject}
                    </label>
                  ))}
                </div>
              }
              <ErrorMessage
                name='subject_ids'
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
