const Subject = require('../../subject/models/subject.model');
const Marksheet = require('../models/marksheet.model');

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

  return await getByStudent(student_id);
};

const getByStudent = async (student_id) => {
  const data = await Marksheet.findAll({
    where: { student_id },
    include: [
      {
        model: Subject,
        as: 'subject',
        attributes: ['id', 'subject'],
      },
    ],
  });

  return data.map((row) => ({
    subject_id: row.subject_id,
    subject: row.subject.subject,
    marks: row.marks,
  }));
};

module.exports = {
  createOrUpdate,
  getByStudent,
};
