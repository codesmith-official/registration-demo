const { Op } = require('sequelize');
const sequelize = require('../../../config/sequelize');
const Permission = require('../../permission/models/permission.model');
const UserTypePermission = require('../../permission/models/userTypePermission.model');
const UserType = require('../models/userType.model');

const createOrUpdate = async (payload) => {
  const { id, permissions = [], ...userTypeData } = payload;
  const transaction = await sequelize.transaction();

  try {
    let userType;
    if (id) {
      userType = await UserType.findByPk(id, { transaction });
      if (!userType) {
        await transaction.rollback();
        return null;
      }

      await userType.update(userTypeData, { transaction });

      if (Array.isArray(permissions)) {
        await UserTypePermission.destroy(
          {
            where: { user_type_id: userType.id },
          },
          { transaction },
        );
        if (permissions.length > 0) {
          const rows = permissions.map((permissionId) => ({
            user_type_id: userType.id,
            permission_id: permissionId,
          }));

          await UserTypePermission.bulkCreate(rows, { transaction });
        }
      }
    } else {
      userType = await UserType.create(userTypeData, { transaction });

      if (permissions.length > 0) {
        const rows = permissions.map((permissionId) => ({
          user_type_id: userType.id,
          permission_id: permissionId,
        }));

        await UserTypePermission.bulkCreate(rows, { transaction });
      }
    }
    await transaction.commit();
    return await getById(userType.id);
  } catch (error) {
    await transaction.rollback();
    return false;
  }
};

const getAll = async (loggedInUser, { page, limit }) => {
  const currentUserTypeId = Number(loggedInUser.userType?.id);
  const filter =
    currentUserTypeId === 1
      ? {}
      : {
          id: {
            [Op.gt]: currentUserTypeId,
          },
        };

  if (limit === 'all') {
    const rows = await UserType.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.notLike]: 'student',
            },
          },
          filter,
        ],
      },
      order: [['id', 'ASC']],
      include: [
        {
          model: Permission,
          as: 'permissions',
          attributes: ['id', 'key'],
          through: { attributes: [] },
          required: false,
        },
      ],
    });

    return {
      data: rows,
      pagination: null,
    };
  }

  const parsedLimit = +limit || 10;
  const offset = (page - 1) * parsedLimit;

  const { rows, count } = await UserType.findAndCountAll({
    where: filter,
    limit: parsedLimit,
    offset,
    order: [['id', 'ASC']],
    include: [
      {
        model: Permission,
        as: 'permissions',
        attributes: ['id', 'key'],
        through: { attributes: [] },
        required: false,
      },
    ],
    distinct: true,
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
  return await UserType.findByPk(id, {
    include: [
      {
        model: Permission,
        as: 'permissions',
        attributes: ['id', 'key'],
        through: { attributes: [] },
      },
    ],
  });
};

const remove = async (id) => {
  const userType = await UserType.findByPk(id);
  if (!userType) return null;

  await userType.destroy();
  return true;
};

module.exports = {
  createOrUpdate,
  getAll,
  getById,
  remove,
};
