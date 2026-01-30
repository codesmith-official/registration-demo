'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import { subjectSchema } from '@/src/validations/subject.schema';

type Props = {
  initialValues: {
    subject: string;
  };
  onSubmit: (values: any) => void;
  submitLabel?: string;
  isEdit?: boolean;
};

export default function SubjectForm({
  isEdit,
  initialValues,
  onSubmit,
  submitLabel = 'Create Subject',
}: Props) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={subjectSchema(isEdit)}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => {
        return (
          <Form className='bg-white border border-gray-200 rounded-lg p-6 space-y-4'>
            <div>
              <Field
                name='subject'
                placeholder='Name'
                className='w-full border px-3 py-2 rounded'
              />
              <ErrorMessage
                name='subject'
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
