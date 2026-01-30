const Standard = require('../../standard/models/standard.model');
const Student = require('../../student/models/student.model');
const Subject = require('../../subject/models/subject.model');
const Marksheet = require('../models/marksheet.model');
const Report = require('../models/report.model');

const getAll = async ({ page, limit }) => {
  const offset = (page - 1) * limit;
  const { rows, count } = await Report.findAndCountAll({
    limit,
    offset,
    order: [['id', 'ASC']],
    include: [
      {
        model: Student,
        as: 'student',
        attributes: ['id', 'first_name', 'last_name'],
      },
      {
        model: Standard,
        as: 'standard',
        attributes: ['id', 'standard'],
      },
    ],
  });
  const total = Number.isInteger(count) ? count : 0;

  return {
    data: rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: total ? Math.ceil(total / limit) : 0,
    },
  };
};

const createOrUpdate = async ({ student_id, standard_id, marks }) => {
  await Marksheet.destroy({
    where: { student_id },
  });

  const rows = marks.map((m) => ({
    student_id,
    standard_id,
    subject_id: m.subject_id,
    marks: m.mark,
  }));

  await Marksheet.bulkCreate(rows);

  const totalObtained = marks.reduce((sum, m) => sum + m.mark, 0);
  const totalPossible = marks.length * 100;
  const percentage = (totalObtained / totalPossible) * 100;

  await Report.upsert({
    student_id,
    standard_id,
    percentage: percentage.toFixed(2),
  });

  return await getByStudent(student_id);
};

const getByStudent = async (student_id) => {
  const [marksData, studentData, reportData] = await Promise.all([
    Marksheet.findAll({
      where: { student_id },
      include: [
        {
          model: Subject,
          as: 'subject',
          attributes: ['id', 'subject'],
        },
      ],
    }),
    Student.findByPk(student_id),
    Report.findOne({ where: { student_id } }),
  ]);

  const standardData = await Standard.findByPk(reportData.standard_id);

  return {
    id: reportData ? reportData.id : 0,
    percentage: reportData ? parseFloat(reportData.percentage) : 0,
    student: {
      id: studentData.id,
      first_name: studentData.first_name,
      last_name: studentData.last_name,
    },
    standard: {
      id: 1,
      standard: standardData.standard,
    },
    marks: marksData.map((row) => ({
      standard_id: row.standard_id,
      subject_id: row.subject_id,
      subject: row.subject.subject,
      marks: row.marks,
    })),
  };
};

module.exports = {
  getAll,
  createOrUpdate,
  getByStudent,
};
