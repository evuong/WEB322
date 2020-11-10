const file = require('fs');     //to use file system module
var employees = [];
var departments = [];

exports.initialize = () => {
    return new Promise ((resolve, reject) => {
        file.readFile('./data/employees.json', (err,data) => {
            if (err) {
                reject ('unable to read file');
            }
            else {
                employees = JSON.parse(data);
            }
        });

        file.readFile('./data/departments.json', (err,data)=> {
            if (err) {
                reject ('unable to read file');
            }
            else {
                departments = JSON.parse(data);
            }
        })
        resolve();
    })
};

exports.getAllEmployees = () => {
    return new Promise ((resolve,reject) => {
        if (employees.length == 0) {
            reject('no results returned');
        }
        else {
            resolve(employees);
        }
    })
};

exports.getManagers = () => {
    return new Promise ((resolve, reject) => {
        var managers = employees.filter(employee => employee.isManager == true);
        if (managers.length == 0) {
            reject('no results returned');
        }
        resolve(managers);
    })
};

exports.getDepartments = () => {
    return new Promise((resolve,reject) => {
        if (departments.length == 0) {
            reject ('no results returned');
        }
        else {
            resolve (departments);
        }
    })
};

exports.addEmployee = (employeeData) => {
    employeeData.isManager==undefined ? employeeData.isManager = false : employeeData.isManager = true;
    employeeData.employeeNum = employees.length + 1;
    employees.push(employeeData);

    return new Promise((resolve,reject) => {
        if (employees.length == 0) {
            reject ('no results');
        }
        else {
            resolve(employees);
        }
    })
};

exports.getEmployeeByStatus = (status) => {
    return new Promise((resolve,reject) => {
        var emp_status = employees.filter(employee => employee.status == status);
        if (emp_status.length == 0) {
            reject('no results');
        }
        resolve(emp_status);
    })
};

exports.getEmployeesByDepartment = (department) => {
    return new Promise ((resolve,reject) => {
        var emp_department = employees.filter(employee => employee.department == department);        
        if (emp_department.length == 0) {
            reject ('department not found');
        }
        resolve(emp_department);
    })
};

exports.getEmployeesByManager = (manager) => {
    return new Promise ((resolve,reject) => {
        var emp_manager = employees.filter(employee => employee.employeeManagerNum == manager);
        if (emp_manager.length == 0) {
            reject('manager not found');
        }
        resolve(emp_manager);
    })
};

exports.getEmployeeByNum = (value) => {
    return new Promise((resolve,reject) => {
        var emp_num = employees.filter(employee => employee.employeeNum == value);
        if (emp_num.length == 0) {
            reject('no employee found');
        }
        resolve(emp_num[0]);
    })
};

exports.updateEmployee = (employeeData) => {
    return new Promise ((resolve,reject) => {
        employees.forEach((hahaha) => {
            if (hahaha.employeeNum == employeeData.employeeNum) {
                employees.splice(employeeData.employeeNum-1, 1, employeeData);
                resolve();
            }
        })
    })
};