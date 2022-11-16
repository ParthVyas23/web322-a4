const file = require('fs');     //to use file system module
var students = [];
var programs = [];

exports.initialize = () => {
    return new Promise ((resolve, reject) => {
        file.readFile('./data/students.json', (err,data) => {
            if (err) {
                reject ('unable to read file');
            }
            else {
                students = JSON.parse(data);
            }
        });

        file.readFile('./data/programs.json', (err,data)=> {
            if (err) {
                reject ('unable to read file');
            }
            else {
                programs = JSON.parse(data);
            }
        })
        resolve();
    })
};

exports.getAllStudents = () => {
    return new Promise ((resolve,reject) => {
        if (students.length == 0) {
            reject('no results returned');
        }
        else {
            resolve(students);
        }
    })
};

exports.getInternationalStudents = () => {
    return new Promise ((resolve, reject) => {
        var intlstudents = students.filter(student => student.isInternationalStudent == true);
        if (intlstudents.length == 0) {
            reject('no results returned');
        }
        resolve(intlstudents);
    })
};

exports.getPrograms = () => {
    return new Promise((resolve,reject) => {
        if (programs.length == 0) {
            reject ('no results returned');
        }
        else {
            resolve (programs);
        }
    })
};

exports.addStudent = (studentData) => {
    studentData.isInternationalStudent==undefined ? studentData.isInternationalStudent = false : studentData.isInternationalStudent = true;
    studentData.studentID = students.length + 1;
    students.push(studentData);

    return new Promise((resolve,reject) => {
        if (students.length == 0) {
            reject ('no results');
        }
        else {
            resolve(students);
        }
    })
};

exports.getStudentsByStatus = (status) => {
    return new Promise((resolve,reject) => {
        var std_status = students.filter(student => student.status == status);
        if (std_status.length == 0) {
            reject('no results returned');
        }
        resolve(std_status);
    })
};

exports.getStudentsByProgramCode = (programCode) => {
    return new Promise ((resolve,reject) => {
        var std_program = students.filter(student => student.program == programCode);        
        if (std_program.length == 0) {
            reject ('no results returned');
        }
        resolve(std_program);
    })
};

exports.getStudentsByExpectedCredential = (credential) => {
    return new Promise ((resolve,reject) => {
        var std_credentials = students.filter(student => student.expectedCredential == credential);
        if (std_credentials.length == 0) {
            reject('no results returned');
        }
        resolve(std_credentials);
    })
};

exports.getStudentById = (sid) => {
    return new Promise((resolve,reject) => {
        var std_num = students.filter(student => student.studentID == sid);
        if (std_num.length == 0) {
            reject('no results returned');
        }
        resolve(std_num);
    })
}

