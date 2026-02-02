'use client';

import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Standard } from '@/lib/api/reports/reports';
import {
  fetchStudentsByStandard,
  StudentsByStandard,
} from '@/lib/api/student/students';
import { fetchSubjectsByStandard } from '@/lib/api/subject/subjects';
import { Subject } from '@/lib/api/subject/subjects'; //
import { reportSchema } from '@/src/validations/report.schema';

type Props = {
  initialValues: {
    standard_id: number;
    student_id: number;
    marks: Record<number, number>;
  };
  standards: Standard[]; //
  onSubmit: (values: any) => void;
  submitLabel?: string;
  isEdit?: boolean;
};

export default function ReportForm({
  isEdit,
  initialValues,
  standards,
  onSubmit,
  submitLabel = 'Create Report',
}: Props) {
  const [students, setStudents] = useState<StudentsByStandard[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingDep, setLoadingDep] = useState(false);

  // Fetch dynamic dependencies based on selected Standard
  const loadDependencies = async (standardId: number) => {
    if (!standardId) return;
    setLoadingDep(true);
    try {
      const [studentData, subjectData] = await Promise.all([
        fetchStudentsByStandard(standardId),
        fetchSubjectsByStandard(standardId),
      ]);
      setStudents(studentData);
      setSubjects(subjectData);
    } finally {
      setLoadingDep(false);
    }
  };

  // Load dependencies on edit mode initialization
  useEffect(() => {
    if (isEdit && initialValues.standard_id) {
      loadDependencies(initialValues.standard_id);
    }
  }, [isEdit, initialValues.standard_id]);

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validate={(values) => {
        try {
          const arrayValues = {
            ...values,
            marks: Object.entries(values.marks).map(([id, val]) => ({
              subject_id: Number(id),
              marks: !val ? undefined : Number(val),
            })),
          };
          reportSchema().validateSync(arrayValues, { abortEarly: false });
        } catch (err: any) {
          const errors: any = {};
          err.inner.forEach((error: any) => {
            if (error.path.startsWith('marks[')) {
              const match = error.path.match(/marks\[(\d+)\]/);
              if (match) {
                const index = parseInt(match[1]);
                const subjectId = Object.keys(values.marks)[index];
                if (!errors.marks) errors.marks = {};
                errors.marks[subjectId] = error.message;
              }
            } else {
              errors[error.path] = error.message;
            }
          });
          return errors;
        }
      }}
      onSubmit={async (values, { setSubmitting }) => {
        const payload = {
          standard_id: values.standard_id,
          student_id: values.student_id,
          marks: Object.entries(values.marks).map(([id, val]) => ({
            subject_id: Number(id),
            mark: Number(val),
          })),
        };
        try {
          await onSubmit(payload);
        } catch {
          setSubmitting(false);
        }
      }}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form className='bg-white border border-gray-200 rounded-lg p-6 space-y-4'>
          <div>
            <Field
              as='select'
              name='standard_id'
              className='w-full border px-3 py-2 rounded'
              disabled={isEdit}
              onChange={(e: any) => {
                const val = Number(e.target.value);
                setFieldValue('standard_id', val);
                setFieldValue('student_id', 0);
                setFieldValue('marks', {});
                loadDependencies(val);
              }}
            >
              <option value={0}>Select Standard</option>
              {standards.map((s) => (
                <option key={s.id} value={+s.id}>
                  {s.standard}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name='standard_id'
              component='p'
              className='text-sm text-red-600 mt-1'
            />
          </div>

          {values.standard_id > 0 && !loadingDep && (
            <>
              <div>
                <Field
                  as='select'
                  name='student_id'
                  className='w-full border px-3 py-2 rounded'
                  disabled={isEdit}
                >
                  <option value={0}>Select Student</option>
                  {students.map((stu) => (
                    <option key={stu.id} value={stu.id}>
                      {stu.first_name} {stu.last_name}
                    </option>
                  ))}
                </Field>

                <ErrorMessage
                  name='student_id'
                  component='p'
                  className='text-sm text-red-600 mt-1'
                />
              </div>

              <div className='space-y-3 pt-4 border-t'>
                <p className='text-sm font-bold text-gray-700'>Subject Marks</p>
                {subjects.map((sub) => (
                  <div key={sub.id}>
                    <div className='flex items-center justify-between bg-gray-50 p-2 rounded'>
                      <span className='text-sm'>{sub.subject}</span>
                      <Field
                        type='number'
                        name={`marks.${sub.id}`}
                        placeholder='0'
                        className='w-24 border px-2 py-1 rounded text-right'
                        value={values.marks[sub.id] ?? ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue(`marks.${sub.id}`, e.target.value);
                        }}
                      />
                    </div>
                    <div className='text-right'>
                      <ErrorMessage
                        name={`marks[${sub.id}]`}
                        component='p'
                        className='text-sm text-red-600 mt-1'
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className='flex justify-end pt-4'>
            <button
              type='submit'
              disabled={isSubmitting || values.student_id === 0}
              className='px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400'
            >
              {isSubmitting ? 'Saving...' : submitLabel}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
