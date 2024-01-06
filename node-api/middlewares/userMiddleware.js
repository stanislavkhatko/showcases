const Parse = require('../helpers/parse');

module.exports = {
    userRole(req, res, next) {
        getCurrentUserRole().then(userRole => {
            if (userRole) {
                req.userRole = userRole.get('role')
            }

            next()
        })
    },
    userWorkspaceRole(req, res, next) {
        getCurrentUserWorkspaceRole().then(userRole => {
            if (userRole) {
                req.userRole = userRole.get('role')
            }

            next()
        })
    },
}
