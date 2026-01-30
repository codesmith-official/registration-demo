const { StatusCodes } = require('http-status-codes');
const { sendError } = require('../common/responses/response.helper');
const Permission = require('../modules/permission/models/permission.model');
const UserPermission = require('../modules/user/models/userPermission.model');

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return sendError(
          res,
          req.lang,
          'AUTH.UNAUTHORIZED',
          StatusCodes.FORBIDDEN,
        );
      }

      if (user.userType?.id === 1) {
        return next();
      }

      const permission = await Permission.findOne({
        where: { name: requiredPermission },
        attributes: ['id'],
      });

      if (!permission) {
        return sendError(
          res,
          req.lang,
          'COMMON.PERMISSION_DENIED',
          StatusCodes.FORBIDDEN,
        );
      }

      const hasPermission = await UserPermission.findOne({
        where: {
          userId: user.id,
          permissionId: permission.id,
        },
      });

      if (!hasPermission) {
        return sendError(
          res,
          req.lang,
          'COMMON.PERMISSION_DENIED',
          StatusCodes.FORBIDDEN,
        );
      }

      return next();
    } catch (error) {
      return sendError(
        res,
        req.lang,
        'COMMON.SERVER_ERROR',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  };
};

const checkPermissionDynamic = (permissions) => {
  return (req, res, next) => {
    const isUpdate =
      req.body && req.body.id !== undefined && req.body.id !== null;

    const permissionToCheck = isUpdate
      ? permissions.update
      : permissions.create;

    return checkPermission(permissionToCheck)(req, res, next);
  };
};

module.exports = {
  checkPermission,
  checkPermissionDynamic,
};
