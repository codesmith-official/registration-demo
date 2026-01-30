const path = require('path');
const ExcelJS = require('exceljs');
const { Op } = require('sequelize');
const sequelize = require('../../../config/sequelize');
const { checkAndCreateDirectory } = require('../../../utils/filesystem');
const Permission = require('../../permission/models/permission.model');
const Standard = require('../../standard/models/standard.model');
const User = require('../../user/models/user.model');
const UserPermission = require('../../user/models/userPermission.model');
const UserStandard = require('../../user/models/userStandard.model');
const userService = require('../../user/services/user.service');
const UserType = require('../../userType/models/userType.model');
const Student = require('../models/student.model');

const createOrUpdate = async (payload, loggedInUser) => {
  const transaction = await sequelize.transaction();
  try {
    if (payload.id) {
      const student = await Student.findByPk(payload.id, { transaction });
      if (!student) {
        await transaction.rollback();
        return null;
      }
      await student.update(payload);

      if (student.user_id) {
        const userUpdateData = {};

        if (payload.first_name || payload.last_name)
          userUpdateData.name = `${payload.first_name} ${payload.last_name}`;
        if (payload.email) userUpdateData.email = payload.email;

        if (Object.keys(userUpdateData).length > 0) {
          const user = await User.findByPk(student.user_id, { transaction });
          if (user) {
            await user.update(userUpdateData, { transaction });
          }
        }
      }

      await transaction.commit();
      return await getById(student.id);
    }

    const studentUserType = await UserType.findOne({
      where: {
        name: {
          [Op.like]: 'student',
        },
      },
      include: [
        {
          model: Permission,
          as: 'permissions',
          attributes: ['id'],
          through: { attributes: [] },
        },
      ],
    });

    const permissionIds = studentUserType.permissions.map(
      (permission) => permission.id,
    );

    const user = await userService.createUser(
      {
        name: `${payload.first_name} ${payload.last_name}`,
        email: payload.email,
        password: payload.password,
        user_type_id: studentUserType.id,
        permissions: permissionIds,
      },
      loggedInUser,
    );

    payload.user_id = user.id;
    const student = await Student.create(payload, { transaction });
    await transaction.commit();
    return await getById(student.id);
  } catch (error) {
    await transaction.rollback();
    return null;
  }
};

const getAll = async ({ page, limit }) => {
  const offset = (page - 1) * limit;

  const { rows, count } = await Student.findAndCountAll({
    limit,
    offset,
    order: [['id', 'DESC']],
    include: [
      {
        model: Standard,
        as: 'standard',
        attributes: ['id', 'standard'],
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

const getById = async (id) => {
  return await Student.findByPk(id, {
    include: [
      {
        model: Standard,
        as: 'standard',
        attributes: ['id', 'standard'],
      },
    ],
  });
};

const remove = async (id) => {
  const transaction = await sequelize.transaction();

  try {
    const student = await Student.findByPk(id, { transaction });
    if (!student) {
      await transaction.rollback();
      return null;
    }

    await User.destroy({
      where: { id: student.user_id },
      transaction,
    });

    await UserPermission.destroy({
      where: { userId: student.user_id },
      transaction,
    });

    await UserStandard.destroy({
      where: { userId: student.user_id },
      transaction,
    });

    await student.destroy({ transaction });

    await transaction.commit();
    return true;
  } catch {
    await transaction.rollback();
    return null;
  }
};

const exportStudents = async () => {
  const students = await Student.findAll({
    order: [['id', 'DESC']],
    include: [
      {
        model: Standard,
        as: 'standard',
        attributes: ['standard'],
      },
    ],
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Students');

  sheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'First Name', key: 'first_name', width: 20 },
    { header: 'Last Name', key: 'last_name', width: 20 },
    { header: 'Gender', key: 'gender', width: 12 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Contact Number', key: 'contact_number', width: 18 },
    { header: 'Standard', key: 'standard', width: 15 },
    { header: 'Bio', key: 'bio', width: 30 },
  ];

  students.forEach((s) => {
    sheet.addRow({
      id: s.id,
      first_name: s.first_name,
      last_name: s.last_name,
      gender: s.gender,
      email: s.email,
      contact_number: s.contact_number,
      standard: s.standard?.standard || '',
      bio: s.bio || '',
    });
  });

  const exportDir = checkAndCreateDirectory(
    path.join(__dirname, '../../../public/assets'),
  );
  const fileName = `students_${Date.now()}.xlsx`;
  const filePath = path.join(exportDir, fileName);

  await workbook.xlsx.writeFile(filePath);

  return {
    fileName,
    filePath: `/assets/${fileName}`,
  };
};

const importStudents = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const sheet = workbook.worksheets[0];

  const results = {
    inserted: 0,
    failed: [],
  };

  for (let i = 2; i <= sheet.rowCount; i++) {
    const row = sheet.getRow(i);

    try {
      const first_name = row.getCell(1).value?.toString().trim();
      const last_name = row.getCell(2).value?.toString().trim();
      const gender = row.getCell(3).value?.toString().toLowerCase();
      const email = row.getCell(4).value?.toString().trim();
      const contact_number = row.getCell(5).value?.toString().trim();
      const standardName = row.getCell(6).value?.toString().trim();
      const bio = row.getCell(7)?.value?.toString() || null;

      if (
        !first_name ||
        !last_name ||
        !gender ||
        !email ||
        !contact_number ||
        !standardName
      ) {
        throw new Error('Missing required fields');
      }

      if (!['male', 'female'].includes(gender)) {
        throw new Error('Invalid gender');
      }

      const standard = await Standard.findOne({
        where: { standard: standardName },
      });

      if (!standard) {
        throw new Error(`Standard not found: ${standardName}`);
      }

      await Student.create({
        first_name,
        last_name,
        gender,
        email,
        contact_number,
        standard_id: standard.id,
        bio,
      });

      results.inserted++;
    } catch (err) {
      results.failed.push({
        row: i,
        error: err.message,
      });
    }
  }

  return results;
};

module.exports = {
  createOrUpdate,
  getAll,
  getById,
  remove,
  exportStudents,
  importStudents,
};
