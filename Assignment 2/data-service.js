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



