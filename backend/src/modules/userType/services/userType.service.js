const sequelize = require('../../../config/sequelize');
const UserType = require('../models/userType.model');
const Permission = require('../../permission/models/permission.model');
const UserTypePermission = require('../../permission/models/userTypePermission.model');

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

const getAll = async () => {
  return await UserType.findAll({
    order: [['id', 'ASC']],
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
