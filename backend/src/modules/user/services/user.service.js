const bcrypt = require('bcrypt');
const sequelize = require('../../../config/sequelize');
const User = require('../models/user.model');
const { Permission, UserType } = require('../../../models');
const UserPermission = require('../models/userPermission.model');
const UserStandard = require('../models/userStandard.model');
const { Op } = require('sequelize');
const { StatusCodes } = require('http-status-codes');

const SALT_ROUNDS = 10;

const findById = async (id) => {
  return User.findByPk(id, {
    include: [
      {
        model: UserType,
        as: 'userType',
        attributes: ['id', 'name'],
      },
      {
        model: Permission,
        as: 'permissions',
        attributes: ['id', 'name', 'key'],
        through: { attributes: [] },
      },
    ],
  });
};

const findByEmail = async (email, scope = 'fetchData') => {
  return scope === 'auth'
    ? User.scope('withPassword').findOne({ where: { email } })
    : User.findOne({ where: { email } });
};

const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

const findAll = async (userData, { page, limit }) => {
  const offset = (page - 1) * limit;
  const filter =
    userData.userType?.id === 1
      ? {}
      : {
          [Op.or]: [
            { id: userData.id },
            {
              user_type_id: {
                [Op.gt]: userData.userType.id,
              },
            },
          ],
        };

  const { rows, count } = await User.findAndCountAll({
    where: filter,
    limit,
    offset,
    order: [['id', 'DESC']],
    include: [
      {
        model: UserType,
        as: 'userType',
        attributes: ['id', 'name'],
        required: false,
      },
    ],
    distinct: true,
    subQuery: false,
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

const createUser = async (payload, loggedInUser) => {
  const { email, password, name, user_type_id, permissions = [] } = payload;

  const transaction = await sequelize.transaction();

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create(
      {
        email,
        password: hashedPassword,
        name,
        user_type_id,
      },
      { transaction },
    );

    let finalPermissions = permissions;

    if (loggedInUser.userType?.id !== 1) {
      const creatorPermissions = await UserPermission.findAll({
        where: { userId: loggedInUser.id },
        attributes: ['permissionId'],
      });

      const allowedPermissionIds = creatorPermissions.map(
        (p) => p.permissionId,
      );

      finalPermissions = permissions.filter((pid) =>
        allowedPermissionIds.includes(pid),
      );
    }

    if (finalPermissions.length > 0) {
      await UserPermission.bulkCreate(
        finalPermissions.map((permissionId) => ({
          userId: user.id,
          permissionId,
        })),
        { transaction },
      );
    }

    await transaction.commit();
    return user;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateUser = async (payload, loggedInUser) => {
  const { id, name, email, user_type_id, permissions = [] } = payload;

  const transaction = await sequelize.transaction();

  try {
    const user = await User.findByPk(id, { transaction });
    if (!user) {
      await transaction.rollback();
      return null;
    }

    const isSelfUpdate = loggedInUser.id === user.id;

    const updateData = { name };

    if (!isSelfUpdate && email) {
      updateData.email = email;
    }

    if (!isSelfUpdate && user_type_id) {
      updateData.user_type_id = user_type_id;
    }

    await user.update(updateData, { transaction });

    if (isSelfUpdate) {
      await transaction.commit();
      return user;
    }

    let finalPermissions = permissions;

    if (loggedInUser.userType?.id !== 1) {
      const creatorPermissions = await UserPermission.findAll({
        where: { userId: loggedInUser.id },
        attributes: ['permissionId'],
      });

      const allowedPermissionIds = creatorPermissions.map(
        (p) => p.permissionId,
      );

      finalPermissions = permissions.filter((pid) =>
        allowedPermissionIds.includes(pid),
      );
    }

    if (finalPermissions.length > 0) {
      await UserPermission.destroy({
        where: { userId: user.id },
        force: true,
        transaction,
      });

      await UserPermission.bulkCreate(
        finalPermissions.map((permissionId) => ({
          userId: user.id,
          permissionId,
        })),
        { transaction },
      );
    }

    await transaction.commit();
    return user;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const assignStandardsToUser = async (payload, loggedInUser) => {
  const { userId, standardIds } = payload;

  const user = await User.findOne({
    where: { id: userId },
    include: [
      {
        model: UserType,
        as: 'userType',
        attributes: ['id'],
      },
    ],
  });

  if (!user) {
    return {
      process: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: 'COMMON.NOT_FOUND',
    };
  }

  if (user.userType.id !== 4) {
    return {
      process: false,
      statusCode: StatusCodes.FORBIDDEN,
      message: 'USER.STANDARDS_ASSIGNED_TO_TEACHERS_ONLY',
    };
  }

  const existingAssignments = await UserStandard.findAll({
    where: {
      userId,
      standardId: standardIds,
    },
    attributes: ['standardId'],
  });

  const alreadyAssignedIds = existingAssignments.map((item) => item.standardId);

  const newStandardIds = standardIds.filter(
    (id) => !alreadyAssignedIds.includes(id),
  );

  if (!newStandardIds.length) {
    return {
      process: false,
      statusCode: StatusCodes.FORBIDDEN,
      message: 'USER.NO_NEW_STANDARD_ASSIGNED',
    };
  }

  const rows = newStandardIds.map((standardId) => ({
    userId,
    standardId,
    createdBy: loggedInUser.id,
  }));

  await UserStandard.bulkCreate(rows);

  return {
    process: true,
    statusCode: StatusCodes.OK,
    data: {
      assigned: newStandardIds.length,
      skipped: alreadyAssignedIds.length,
    },
  };
};

const deleteUser = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    const user = await User.findByPk(id, { transaction });
    if (!user) {
      await transaction.rollback();
      return null;
    }

    await UserPermission.destroy({
      where: { userId: id },
      transaction,
    });

    await UserStandard.destroy({
      where: { userId: id },
      transaction,
    });

    await user.destroy({ transaction });

    await transaction.commit();
    return true;
  } catch {
    await transaction.rollback();
    throw null;
  }
};

module.exports = {
  findById,
  findByEmail,
  comparePassword,
  findAll,
  createUser,
  updateUser,
  deleteUser,
  assignStandardsToUser,
};
