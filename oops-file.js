const fs = require('fs');
const prompt = require('prompt-sync')();

class Person {
    constructor(name) {
        this.name = name;
    }
}

class Student extends Person {
    constructor(rollno, name, grade, section) {
        super(name);
        this.rollno = rollno;
        this.grade = grade;
        this.section = section;
    }
}

class StudentDatabase {
    constructor() {
        this.loadData();
    }

    loadData() {
        try {
            const data = fs.readFileSync('students.json', 'utf8');
            this.students = JSON.parse(data);
        } catch (err) {
            this.students = [];
        }
    }

    saveData() {
        const data = JSON.stringify(this.students, null, 2);
        fs.writeFileSync('students.json', data, 'utf8');
    }

    viewJsonData() {
        console.log('\nJSON Data:');
        console.log(JSON.stringify(this.students, null, 2));
    }
}

class studentfunctions extends StudentDatabase {
    addStudent(student) {
        this.students.push(student);
        this.saveData();
    }

    getStudentByRollNo(rollno) {
        return this.students.find(student => student.rollno === rollno);
    }

    editStudentData(rollno, newGrade, newSection) {
        const student = this.getStudentByRollNo(rollno);
        if (student) {
            if (newGrade !== '') {
                student.grade = newGrade;
            }
            if (newSection !== '') {
                student.section = newSection;
            }
            this.saveData();
        } else {
            console.log("Student rollno Not Found");
        }
    }

    deleteStudent(rollno) {
        this.students = this.students.filter(student => student.rollno !== rollno);
        this.saveData();
    }
}

const studentDB = new studentfunctions();

while (true) {
    console.log('\x1b[32m%s\x1b[0m', "\n1. Add Student");
    console.log('\x1b[36m%s\x1b[0m', "2. Get Student Data");
    console.log('\x1b[34m%s\x1b[0m', "3. Edit Student Data");
    console.log('\x1b[31m%s\x1b[0m', "4. Delete Student Data");
    console.log('\x1b[35m%s\x1b[0m', "5. Display Students Data");
    console.log('\x1b[33m%s\x1b[0m', "6. View JSON Data");
    console.log('\x1b[33m%s\x1b[0m', "7. Exit\n");

    const option = prompt("Enter the Option: ");

    switch (option) {
        case "1": // Adding Student
            {
                console.log('\x1b[32m%s\x1b[0m', "\n***Adding Student***");

                let urollno;
                let isRollNoValid = false;

                do {
                    urollno = prompt("Enter the rollno: ");

                    if (isNaN(urollno) || urollno === "") {
                        console.log('\x1b[33m%s\x1b[0m', "*****The rollno should be a number********");
                    } else {
                        const isRollNoExist = studentDB.getStudentByRollNo(urollno);

                        if (isRollNoExist) {
                            const ck = "Roll No already exists";
                            console.log('\x1b[31m%s\x1b[0m', ck);
                        } else {
                            isRollNoValid = true;
                        }
                    }

                } while (!isRollNoValid);

                let uname;
                do {
                    uname = prompt("Enter the name: ");
                    if (!uname || uname.trim() === "") {
                        console.log('\x1b[33m%s\x1b[0m', "*****Name cannot be empty********");
                    }
                } while (!uname || uname.trim() === "");

                let ugrade;
                do {
                    ugrade = prompt("Enter the grade: ");
                    if (!ugrade || ugrade.trim() === "") {
                        console.log('\x1b[33m%s\x1b[0m', "*****Grade cannot be empty********");
                    }
                } while (!ugrade || ugrade.trim() === "");

                let usection;
                do {
                    usection = prompt("Enter the section: ");
                    if (!usection || usection.trim() === "") {
                        console.log('\x1b[33m%s\x1b[0m', "*****Section cannot be empty********");
                    }
                } while (!usection || usection.trim() === "");

                if (typeof uname === 'string' && typeof ugrade === 'string' && typeof usection === 'string') {
                    const student = new Student(urollno, uname, ugrade, usection);
                    studentDB.addStudent(student);

                    console.log('\x1b[32m%s\x1b[0m', 'After adding:');
                    studentDB.viewJsonData();
                } else {
                    const vt = "'*****The Other data should be in string format********'";
                    console.log('\x1b[33m%s\x1b[0m', vt);
                }
                break;
            }

        case "2": // Getting Student Data
            {
                console.log('\x1b[36m%s\x1b[0m', "\n***Getting Student Data by rollno***");

                let getrollno;
                let isValidRollNo = false;

                do {
                    getrollno = prompt("Enter the rollno to get student's details: ");

                    if (!isNaN(getrollno)) {
                        const student = studentDB.getStudentByRollNo(getrollno);
                        if (student) {
                            console.log("Student Details");
                            console.log("Roll No\t Name\t Grade\t Section");
                            console.log(`${student.rollno}\t ${student.name}\t ${student.grade}\t ${student.section}`);
                            isValidRollNo = true;
                        } else {
                            console.log('\x1b[33m%s\x1b[0m', "Student rollno Not Found");
                        }
                    } else {
                        console.log('\x1b[33m%s\x1b[0m', "'*****Enter a valid rollno********'");
                    }

                } while (!isValidRollNo);
                break;
            }

        case "3":
            {
                // Editing Student Data
                let rollnoToEdit;
                let isValidRollNoForEdit = false;

                do {
                    rollnoToEdit = prompt("Enter the rollno for editing: ");

                    if (!isNaN(rollnoToEdit)) {
                        const studentToEdit = studentDB.getStudentByRollNo(rollnoToEdit);

                        if (studentToEdit) {
                            console.log("Current Student Details");

                            const newGrade = prompt("Enter the new grade: ");
                            const newSection = prompt("Enter the new section: ");

                            studentDB.editStudentData(rollnoToEdit, newGrade, newSection);
                            console.log('Student data updated successfully:');
                            isValidRollNoForEdit = true;
                        } else {
                            console.log('\x1b[33m%s\x1b[0m', "Student rollno Not Found");
                        }
                    } else {
                        console.log('\x1b[33m%s\x1b[0m', "'*****Enter a valid rollno********'");
                    }

                } while (!isValidRollNoForEdit);

                console.log('After editing:');
                studentDB.viewJsonData();
                break;
            }

        case "4":
            {
                // Deleting Student Data
                let rollnoToDelete;
                let todelete = false;

                do {
                    rollnoToDelete = prompt("Enter the rollno to delete that student data: ");

                    if (!isNaN(rollnoToDelete)) {
                        const studentToDelete = studentDB.getStudentByRollNo(rollnoToDelete);

                        if (studentToDelete) {
                            console.log("Student to Delete Details");
                            console.log('\x1b[33m%s\x1b[0m',"Roll No\t Name\t Grade\t Section");
                            console.log(`${studentToDelete.rollno}\t ${studentToDelete.name}\t ${studentToDelete.grade}\t ${studentToDelete.section}`);

                            const confirmation = prompt("Delete student data? (yes/no): ");
                            if (confirmation.toLowerCase() === "yes") {
                                studentDB.deleteStudent(rollnoToDelete);
                                console.log('Student data deleted successfully:');
                                todelete = true;
                            } else {
                                console.log("Deletion canceled.");
                            }
                        } else {
                            console.log('\x1b[33m%s\x1b[0m', "Student rollno Not Found");
                        }
                    } else {
                        console.log('\x1b[33m%s\x1b[0m', "'*****Enter a valid rollno********'");
                    }
                } while (!todelete);

                console.log('After deleting:');
                studentDB.viewJsonData();
                break;
            }

        case "5":
            console.log("\nList of students");
            studentDB.viewJsonData();
            break;

        case "6":
            studentDB.viewJsonData();
            break;

        case "7":
            console.log('\x1b[33m%s\x1b[0m', "Exiting Program......");
            process.exit();

        default:
            console.log("Enter a valid option");
    }
}
