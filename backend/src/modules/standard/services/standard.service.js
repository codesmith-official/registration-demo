const Standard = require('../models/standard.model');
const StandardSubject = require('../models/standardSubject.model');
const Subject = require('../../subject/models/subject.model');

const createOrUpdate = async (payload) => {
  let standard;

  if (payload.id) {
    standard = await Standard.findByPk(payload.id);
    if (!standard) return null;

    await standard.update({ standard: payload.standard });

    await StandardSubject.destroy({
      where: { standard_id: payload.id },
    });
  } else {
    standard = await Standard.create({ standard: payload.standard });
  }

  const mappings = payload.subject_ids.map((subject_id) => ({
    standard_id: standard.id,
    subject_id,
  }));

  await StandardSubject.bulkCreate(mappings);
  return await Standard.findByPk(standard.id, {
    include: [
      {
        model: Subject,
        as: 'subjects',
        through: { attributes: [] },
        attributes: ['id', 'subject'],
      },
    ],
  });
};

const getAll = async () => {
  return await Standard.findAll({
    order: [['id', 'DESC']],
    include: [
      {
        model: Subject,
        as: 'subjects',
        through: { attributes: [] },
        attributes: ['id', 'subject'],
      },
    ],
  });
};

const getById = async (id) => {
  return await Standard.findByPk(id, {
    include: [
      {
        model: Subject,
        as: 'subjects',
        through: { attributes: [] },
        attributes: ['id', 'subject'],
      },
    ],
  });
};

const remove = async (id) => {
  const standard = await Standard.findByPk(id);
  if (!standard) return null;

  await standard.destroy();
  return true;
};

module.exports = {
  createOrUpdate,
  getAll,
  getById,
  remove,
};
