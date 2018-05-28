var inquirer = require('inquirer');
var mysql = require('mysql');
require("dotenv").config();

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.MYSQL,
    database: "bamazon"
})

connection.connect(function (err) {
    //console.log("you are conned as id: " + connection.threadId);
    if (err) throw err;
    managerPrompt();
})

function managerPrompt() {
    inquirer.prompt({
        name: "requestedCommand",
        type: "rawlist",
        choices: ["View porducts for sale", "View low inventory", "Add to inventory", "Add new product"],
        message: "please select a command from the options below"
    }).then(function (answer) {
        switch (answer.requestedCommand) {
            case "View porducts for sale":
                showProducts();
                break;
            case "View low inventory":
                lowInventory();
                break;
            case "Add to inventory":
                addInventory();
                break;
            default:
                addProduct();
        }
    })
}


// displaying all the products
var showProducts = function () {
    connection.query("select * from products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(`item id: ${res[i].item_id} \t sale price: $ ${res[i].price.toFixed(2)}\t` +
                `quantity: ${res[i].stock_quantity} \t poduct: ${res[i].product_name}`);
        }
        managerPrompt();
    });

}




var lowInventory = function () {
    connection.query("select * from products where stock_quantity< 5", function (err, res) {
        if (res.length === 0) {
            console.log("All items are well stocked, there are atleast 5 of each.\n");
        }
        for (var i = 0; i < res.length; i++) {
            console.log(`item id: ${res[i].item_id} \t sale price: $ ${res[i].price.toFixed(2)}\t` +
                `quantity: ${res[i].stock_quantity} \t poduct: ${res[i].product_name} \n`);
        }
        managerPrompt();
    });
}

var addInventory = function () {
    inquirer.prompt([{
        name: "itemToAdd",
        type: "input",
        message: "which item to do you want to add to the itenary? please specify the item id",
        validate: function (value) {
            if (isNaN(value)) {
                return false;
            }
            else {
                return true;
            }
        }
    },
    {
        name: "howMany",
        type: "input",
        message: "how many items do you want to add? please specify a number",
        validate: function (value) {
            if (isNaN(value)) {
                return false;
            }
            else {
                return true;
            }
        }
    }]).then(function (answer) {
        connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE ? ", [
            answer.howMany, { item_id: answer.itemToAdd }], function (err, data) {
                if (err) throw err
            })
        console.log(`${answer.howMany} items have been added to inventory \n`);
        managerPrompt();
    })
}
var addProduct = function () {
    inquirer.prompt([{
        name: "item",
        type: "input",
        message: "what item do you want to add?"
    },
    {
        name: "category",
        type: "input",
        message: "what department do you want to put it in?"
    },
    {
        name: "price",
        type: "input",
        message: "what do you want to price it at?",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            else {
                return false;
            }
        }
    },
    {
        name: "howMany",
        type: "input",
        message: "What is the quantatiy you want to add?",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            else {
                return false;
            }
        }
    }]).then(function (answer) {
        connection.query("INSERT INTO products SET ?",
            {
                product_name: answer.item,
                department_name: answer.category,
                price: answer.price,
                stock_quantity: answer.howMany
            },
            function (err, res) {
                console.log("your auction was posted\n");
                managerPrompt();
            }
        )
    })
}
