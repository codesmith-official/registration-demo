const sequelize = require('../config/sequelize');
const Subject = require('../modules/subject/models/subject.model');
const Standard = require('../modules/standard/models/standard.model');
const StandardSubject = require('../modules/standard/models/standardSubject.model');
const Student = require('../modules/student/models/student.model');
const Marksheet = require('../modules/marksheet/models/marksheet.model');
const Permission = require('../modules/permission/models/permission.model');
const UserTypePermission = require('../modules/permission/models/userTypePermission.model');
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
};
