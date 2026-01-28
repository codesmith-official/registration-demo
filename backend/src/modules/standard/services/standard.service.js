const { Op } = require('sequelize');
const Standard = require('../models/standard.model');
const StandardSubject = require('../models/standardSubject.model');
const Subject = require('../../subject/models/subject.model');
const UserStandard = require('../../user/models/userStandard.model');

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

const getAll = async (userData) => {
  let filter = {};

  // teacher: show only assigned standards
  if (userData.userType?.id === 4) {
    const assignedStandards = await UserStandard.findAll({
      where: {
        userId: userData.id,
      },
      attributes: ['standardId'],
    });

    const standardIds = assignedStandards.map((item) => item.standardId);

    // no assignment → empty list
    if (!standardIds.length) {
      return [];
    }

    filter = {
      id: {
        [Op.in]: standardIds,
      },
    };
  }
  return await Standard.findAll({
    where: filter,
    order: [['id', 'ASC']],
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
