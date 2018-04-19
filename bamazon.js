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

connection.connect(function (err) {                                                                     // creating connection and starting
    console.log("connected as id " + connection.threadId);
    if (err) throw err;
    start();
});

var start = function () {
    connection.query("select * from products", function (err, res) {                                    // displaying all the products
        for (var i = 0; i < res.length; i++) {
            console.log("item id:" + res[i].item_id, "\t sale price: $" + res[i].price.toFixed(2), "\t poduct: " + res[i].product_name);
        }
        inquirer.prompt([{                                                                              // asking questions about order
            name: "selectedProduct",
            type: "input",
            message: "please select the id of the product you want to purchase",
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
            name: "numOfItemsReq",
            type: "input",
            message: "how may units would you like to buy?",
            validate: function (value) {
                if (isNaN(value)) {
                    return false;
                }
                else {
                    return true;
                }
            }
        }]).then(function(answer){
                var selectedItem = answer.selectedProduct-1;                                                // tells position in array
                if(res[selectedItem].stock_quantity> answer.numOfItemsReq){                                 //enough item in stock? if yes proceed with sale
                    var itemsLeft = res[selectedItem].stock_quantity - answer.numOfItemsReq;
                    connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: itemsLeft}, { item_id : answer.selectedProduct}], function(err,response){
                    if(err) throw err;
                    })
                    console.log("your order of " + answer.numOfItemsReq+ " "+ res[selectedItem].product_name + " has been fullfilled \n");
                    console.log("it cost a total of $" + answer.numOfItemsReq*res[selectedItem].price);
                }
                else{                                                                                      // not enough items in stock
                    console.log("we currently dont have enough inventory to fulfill your order");
                }
        })
    })
}