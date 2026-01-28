const bcrypt = require('bcrypt');
const sequelize = require('../../../config/sequelize');
const User = require('../models/user.model');
const { Permission, UserType } = require('../../../models');
const UserPermission = require('../models/userPermission.model');
const { Op } = require('sequelize');

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

const findAll = async (userData) => {
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
  return User.findAll({
    where: filter,
    order: [['id', 'DESC']],
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

module.exports = {
  findById,
  findByEmail,
  comparePassword,
  findAll,
  createUser,
  updateUser,
};
