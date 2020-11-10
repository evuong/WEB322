const Sequelize = require('sequelize');
var sequelize = new Sequelize('d41ea24563tp6e', 'psnolynfwcxxou', 'd2e0d3608aacad13aea00a211b40d7d35ac323bd2ba36c5cceebd71631f5e109', {
    host: 'ec2-54-225-95-183.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    }
});

const Employee = sequelize.define('employee', {
    employeeNum: {
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    firstName:Sequelize.STRING,
    lastName:Sequelize.STRING,
    email:Sequelize.STRING,
    SSN:Sequelize.STRING,
    addressStreet:Sequelize.STRING,
    addressCity:Sequelize.STRING,
    addressState:Sequelize.STRING,
    addressPostal:Sequelize.STRING,
    maritalStatus:Sequelize.STRING,
    isManager:Sequelize.BOOLEAN,
    employeeManagerNum:Sequelize.INTEGER,
    status:Sequelize.STRING,
    department:Sequelize.INTEGER,
    hireDate:Sequelize.STRING
});

const Department = sequelize.define('department', {
    departmentId: {
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    departmentName:Sequelize.STRING
})

exports.initialize = () => {
    return new Promise((resolve,reject) => {
        sequelize.sync()
        .then(resolve('database synced'))
        .catch(reject('unable to sync the database'));
    })
};

exports.getAllEmployees = () => {
    return new Promise((resolve,reject) => {
        sequelize.sync()
        .then(resolve(Employee.findAll()))
        .catch(reject('no results returned'));
    })
};

exports.getEmployeeByStatus = (status) => {
    return new Promise((resolve,reject) => {
        Employee.findAll({
            where:{
                status: status
            }
        })
        .then(resolve(Employee.findAll({ where: { status: status }})))
        .catch(reject('no results returned'))
    })
};

exports.getEmployeesByDepartment = (department) => {
    return new Promise((resolve,reject) => {
        Employee.findAll({
            where: {
                department:department
            }
        })
        .then(data => resolve(data))
        .catch(err => reject(err))
    })
};

exports.getEmployeesByManager = (manager) => {
    return new Promise((resolve,reject) => {
        Employee.findAll({
            where: {
                employeeManagerNum: manager
            }
        })
        .then(resolve(Employee.findAll({ where: { employeeManagerNum: manager }})))
        .catch(reject('no results returned'))
    })
};

exports.getEmployeeByNum = (value) => {
    return new Promise((resolve,reject) => {
        Employee.findAll({
            where: {
                employeeNum:value
            }
        })
        .then(data => resolve(data))
        .catch('no results returned')
    })
};

exports.getManagers = () => {
    return new Promise((resolve,reject) => {
        Employee.findAll({
            where: {
                isManager:true
            }
        })
        .then(resolve(Employee.findAll({ where: { isManager: true }})))
        .catch('no results returned')
    })
};

exports.getDepartments = () => {
    return new Promise((resolve, reject) => {
        Department.findAll()
        .then(data => { resolve(data); })
        .catch(err => { reject(err); })
    }) 
};

exports.addEmployee = (employeeData) => {
    return new Promise((resolve,reject) => {
        employeeData.isManager = employeeData.isManager ? true : false;
        for (var i in employeeData) {
            if (employeeData[i] == "") { employeeData[i] = null; }
        }

        Employee.create(employeeData)
        .then(resolve(Employee.findAll()))
        .catch(reject('unable to create employee'))
    })
}; 

exports.updateEmployee = (employeeData) => {
    return new Promise((resolve,reject) => {
        employeeData.isManager = (employeeData.isManager) ? true : false;

        for (var i in employeeData) {
            if (employeeData[i] == "") { employeeData[i] = null; }
        }

        sequelize.sync()
        .then(Employee.update(employeeData, {where: {
            employeeNum: employeeData.employeeNum
        }}))
        .then(resolve(Employee.update(employeeData, { where: { employeeNum:employeeData.employeeNum }})))
        .catch(reject('unable to update employee'))
    })
};

exports.addDepartment = (departmentData) => {
    return new Promise((resolve,reject) => {
        for (var i in departmentData) {
            if (departmentData[i] == "") { departmentData[i] = null; }
        }

        Department.create(departmentData)
        .then(resolve(Department.findAll()))
        .catch(reject('unable to add department'))
    })
};

exports.updateDepartment = (departmentData) => {
    return new Promise((resolve,reject) => {
        for (var i in departmentData) {
            if (departmentData[i] == "") { departmentData[i] = null; }
        }

        sequelize.sync()
        .then(Department.update(departmentData, {where: { 
            departmentId: departmentData.departmentId
        }}))
        .then(resolve(Department.update(departmentData, {where: { departmentId:departmentData.departmentId }})))
        .catch(reject('unable to update department'))
    })
};

exports.getDepartmentById = id => {
    return new Promise((resolve,reject) => {
        Department.findAll({ 
            where: {
                departmentId: id
            }
        })
        .then(resolve(Department.findAll({ where: { departmentId: id }})))
        .catch(reject('no results returned'))
    })
};

exports.deleteEmployeeByNum = num => {
    return new Promise((resolve,reject) => {
        Employee.destroy({
            where: {
                employeeNum: num
            }
        })
        .then(resolve())
        .catch(reject('unable to delete employee'))
    })
};

exports.deleteDepartmentByNum = num => {
    return new Promise((resolve,reject) => {
        Department.destroy({
            where: {
                departmentId: num
            }
        })
        .then(resolve())
        .catch(reject('unable to delete employee'))
    })
};