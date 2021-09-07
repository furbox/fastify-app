//basic min permissions in the sistem
const PermissionsEnum = {
    AUTH: {
        refreshToken: {
            name: 'REFRESH TOKEN',
            namekey: 'refreshToken',
            description: 'This permission is used to refresh the token of a user'
        }
    },
    MODULE: {
        getAllModules: {
            name: 'LIST ALL MODULES',
            namekey: 'getAllModules',
            description: 'This permission list all modules'
        },
        addModule: {
            name: 'CREATE A MODULE',
            namekey: 'addModule',
            description: 'This permission create a module'
        },
        getModule: {
            name: 'GET ONE MODULE BY ID',
            namekey: 'getModule',
            description: 'This permission find one module by id'
        },
        updateModule: {
            name: 'UPDATE A MODULE BY ID',
            namekey: 'updateModule',
            description: 'This permission updated a module by id'
        },
        deleteModule: {
            name: 'DELETE A MODULE BY ID',
            namekey: 'deleteModule',
            description: 'This permission delete a module by id'
        }
    },
    PERMISSION: {
        getAllPersmissions: {
            name: 'GET ALL PERMISSIONS',
            namekey: 'getAllPersmissions',
            description: 'This permission list all permissions'
        },
        addPermission: {
            name: 'CREATE A PERMISSIONS',
            namekey: 'addPermission',
            description: 'This permission created a permission'
        },
        getPermission: {
            name: 'GET ONE PERMISSION',
            namekey: 'getPermission',
            description: 'This permission find one permission'
        },
        updatePermission: {
            name: 'UPDATED A PERMISSION',
            namekey: 'updatePermission',
            description: 'This permission updated a permission'
        },
        deletePermission: {
            name: 'DETELED A PERMISSION',
            namekey: 'deletePermission',
            description: 'This permission deleted a permission'
        },
    },
    ROLE: {
        getAllRoles: {
            name: 'GET ALL ROLES',
            namekey: 'getAllRoles',
            description: 'This permission list all roles'
        },
        addRole: {
            name: 'CREATE A ROLE',
            namekey: 'addRole',
            description: 'This permission created a role'
        },
        getRole: {
            name: 'GET ONE ROLE',
            namekey: 'getRole',
            description: 'This permission find one role'
        },
        updateRole: {
            name: 'UPDATED A ROLE',
            namekey: 'updateRole',
            description: 'This permission updated a role'
        },
        deleteRole: {
            name: 'DELETED A ROLE',
            namekey: 'deleteRole',
            description: 'This permission deleted a role'
        },
        getRoleByName: {
            name: 'GET A ROLE BY NAME',
            namekey: 'getRoleByName',
            description: 'This permission find one role by name'
        },
    },
    USER: {
        getUserById: {
            name: 'GET ONE USER',
            namekey: 'getUserById',
            description: 'This permission find one user'
        },
        getAllUsers: {
            name: 'GET ALL USER',
            namekey: 'getAllUsers',
            description: 'This permission list all roles'
        },
        addUser: {
            name: 'CREATE A USER',
            namekey: 'addUser',
            description: 'This permission created a roles'
        },
        deleteUser: {
            name: 'DELETED A USER',
            namekey: 'deleteUser',
            description: 'This permission deleted a roles'
        },
        updateUser: {
            name: 'UPDATED A USER',
            namekey: 'updateUser',
            description: 'This permission updated a roles'
        }
    },
    PROFILE: {
        profileUpdate: {
            name: 'UPDATED PROFILE',
            namekey: 'profileUpdate',
            description: 'This permission updated profile to user'
        },
        profilePasswordChange: {
            name: 'UPDATED PASSWORD PROFILE',
            namekey: 'profilePasswordChange',
            description: 'This permission updated password profile to user'
        }
    }
};

module.exports = PermissionsEnum;