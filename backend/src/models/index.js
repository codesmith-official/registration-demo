const sequelize = require('../config/sequelize');
const Marksheet = require('../modules/marksheet/models/marksheet.model');
const Report = require('../modules/marksheet/models/report.model');
const Permission = require('../modules/permission/models/permission.model');
const UserTypePermission = require('../modules/permission/models/userTypePermission.model');
const Standard = require('../modules/standard/models/standard.model');
const StandardSubject = require('../modules/standard/models/standardSubject.model');
const Student = require('../modules/student/models/student.model');
const Subject = require('../modules/subject/models/subject.model');
const User = require('../modules/user/models/user.model');
const UserPermission = require('../modules/user/models/userPermission.model');
const UserType = require('../modules/userType/models/userType.model');

Standard.belongsToMany(Subject, {
  through: StandardSubject,
  foreignKey: 'standard_id',
  as: 'subjects',
});
Subject.belongsToMany(Standard, {
  through: StandardSubject,
  foreignKey: 'subject_id',
  as: 'standards',
});

Student.belongsTo(Standard, { foreignKey: 'standard_id', as: 'standard' });
Standard.hasMany(Student, { foreignKey: 'standard_id', as: 'students' });

Marksheet.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });
Marksheet.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject' });
Student.hasMany(Marksheet, { foreignKey: 'student_id', as: 'marks' });

UserType.belongsToMany(Permission, {
  through: UserTypePermission,
  foreignKey: 'user_type_id',
  otherKey: 'permission_id',
  as: 'permissions',
});

Permission.belongsToMany(UserType, {
  through: UserTypePermission,
  foreignKey: 'permission_id',
  otherKey: 'user_type_id',
  as: 'userTypes',
  onDelete: 'CASCADE',
});

User.belongsTo(UserType, { foreignKey: 'user_type_id', as: 'userType' });
User.belongsToMany(Permission, {
  through: UserPermission,
  foreignKey: 'user_id',
  otherKey: 'permission_id',
  as: 'permissions',
  onDelete: 'CASCADE',
});
Permission.belongsToMany(User, {
  through: UserPermission,
  foreignKey: 'permission_id',
  otherKey: 'user_id',
  as: 'users',
  onDelete: 'CASCADE',
});
UserPermission.belongsTo(Permission, {
  foreignKey: 'permission_id',
  as: 'permission',
});

Student.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
  onDelete: 'CASCADE',
});

User.hasOne(Student, {
  foreignKey: 'user_id',
  as: 'student',
  onDelete: 'CASCADE',
});

Student.hasOne(Report, { foreignKey: 'student_id', as: 'report' });
Report.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });
Report.belongsTo(Standard, { foreignKey: 'standard_id', as: 'standard' });

StandardSubject.belongsTo(Subject, {
  foreignKey: 'subject_id',
  as: 'subject',
});

module.exports = {
  sequelize,
  Subject,
  Standard,
  StandardSubject,
  Student,
  Marksheet,
  Permission,
  UserTypePermission,
  User,
  UserPermission,
  UserType,
  Report,
};
