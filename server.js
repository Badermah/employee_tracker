const mysql = require("mysql2");
const inquirer = require("inquirer");
require('dotenv').config();
const PORT = process.env.PORT || 3001;


const connection = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "employee_db"
  });
  connection.connect(function(err){
    if (err) throw err;
    console.log("Connected with ID: " + connection.threadId);
  });

inital();
function inital() {
   inquirer.prompt({
         type: "list",
         choices: [
            "Add department",
            "Add role",
            "Add employee",
            "View departments",
            "View role",
            "View employees",
            "Update employee role",
            "Exit"
         ],
         message: "Please choose an option.",
         name: "option"
      })
      .then(function(result){
         console.log("You chose: " + result.option);
         switch (result.option) {
            case "Add department":
               addDepartment();
               break;
            case "Add role":
                addRole();
               break;
            case "Add employee":
               addEmployee();
               break;
            case "View departments":
               viewDepartment();
               break;
            case "View role":
               viewRole();
               break;
            case "View employees":
               viewEmployees();
               break;
            case "Update employee role":
               updateEmployee();
               break;
            default:
               quit();
         }
      });
}
function addDepartment() {
   inquirer.prompt({
      type: "input",
      message: "What is the name of the department?",
      name: "deptName"
   }).then(function(answer){
     connection.query("INSERT INTO department (name) VALUES (?)", [answer.deptName], function(err, res) {
         if (err) throw err;
         console.table(res)
         inital()
      })
   })
}
function addRole() {
   inquirer
      .prompt([
         {
            type: "input",
            "message": "What is the role?",
            name: "roleName"
         },
         {
            type: "input",
            message: "What is the salary for this role?",
            name: "salaryTotal"
         },
         {
            type: "input",
            message: "what is the department id?",
            name: "deptID"
         }
      ])
      .then(function(answer){
         connection.query("INSERT INTO role (title, salary, department_id) VALUE(?, ?, ?)", [answer.roleName, answer.salaryTotal, answer.deptID], function(err, res) {
            if (err) throw err;
            console.table(res);
            inital();
         });
      });
}
function addEmployee() {
   inquirer
      .prompt([
         {
            type: "input",
            message: "What is the first name of the employee?",
            name: "empFirstName"
         },
         {
            type: "input",
            message: "What is the last name of the employee?",
            name: "empLastName"
         },
         {
            type: "input",
            message: "what is the employee's role ID number?",
            name: "roleID"
         },
         {
            type: "input",
            message: "What is the manager's ID number?",
            name:  "managerID"
         }
      ])
      .then(function(answer){
         connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [answer.empFirstName, answer.empLastName, answer.roleID, answer.managerID], function(err, res) {
            if (err) throw err;
            console.table(res);
            inital();
         });
      });
}
function updateEmployee() {
   inquirer
   .prompt([
      {
         type: "input",
         message: "Which employee would you like to update?",
         name: "updateEmployee"
      },
      {
      type: "input",
      message: "What do you want to update it to?",
      name: "updateRole"
      }
   ])
   .then(function(answer) {
     connection.query('UPDATE employee SET role_id=? WHERE first_name=?', [answer.updateRole, answer.updateEmployee], function(err, res) {
         if (err) throw err;
         console.table(res);
         inital();
      });
   });
}
function viewDepartment() {
   let query = "SELECT * FROM department";
 connection.query(query, function(err, res) {
      if (err) throw err;
      console.table(res);
      inital();
   });
}
function viewRole() {
   let query = "SELECT * FROM role";
 connection.query(query, function(err, res) {
      if (err) throw err;
      console.table(res);
      inital();
   });
}
function viewEmployees() {
   let query = "SELECT * FROM employee";
 connection.query(query, function(err, res) {
      if (err) throw err;
      console.table(res);
      inital();
   });
}
function quit() {
 connection.end();
   process.exit();
}
