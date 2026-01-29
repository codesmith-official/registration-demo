const Subject = require('../models/subject.model');

const createOrUpdate = async (payload) => {
  if (payload.id) {
    const subject = await Subject.findByPk(payload.id);
    if (!subject) return null;

    await subject.update({ subject: payload.subject });
    return subject;
  }

  return await Subject.create({ subject: payload.subject });
};

const getAll = async ({ page, limit }) => {
  if (limit === 'all') {
    const rows = await Subject.findAll({
      order: [['id', 'ASC']],
    });

    return {
      data: rows,
      pagination: null,
    };
  }

  const parsedLimit = +limit || 10;
  const offset = (page - 1) * parsedLimit;

  const { rows, count } = await Subject.findAndCountAll({
    limit: parsedLimit,
    offset,
    order: [['id', 'ASC']],
  });

  const total = Number.isInteger(count) ? count : 0;

  return {
    data: rows,
    pagination: {
      total: count,
      page,
      limit: parsedLimit,
      totalPages: total ? Math.ceil(total / parsedLimit) : 0,
    },
  };
};

const getById = async (id) => {
  return await Subject.findByPk(id);
};

const remove = async (id) => {
  const subject = await Subject.findByPk(id);
  if (!subject) return null;

  await subject.destroy();
  return true;
};

module.exports = {
  createOrUpdate,
  getAll,
  getById,
  remove,
};
