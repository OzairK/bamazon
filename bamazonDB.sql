drop database bamazon; 
create database bamazon;
use bamazon;

create table products(
item_id integer(10) auto_increment,
product_name varchar(50) not null,
department_name varchar(50) not null,
price decimal(13,4),
stock_quantity integer(10),
primary key(item_id)
);



INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("tennis racquet", "Sports and Outdoors" , 20.00, 17),
("bat", "Sports and Outdoors" , 20.00, 15), 
("basketball", "Sports and Outdoors", 20.00, 25),
("baseball bat", "Sports and Outdoors" , 50.00, 15),
("shampoo", "Household Products", 7.50, 23),
("soap", "Household Products", 3.25, 27),
("salt", "Household Products", 1.25, 30),
("blankets", "Bedding", 45.50, 12),
("pillows", "Bedding", 12.50, 12),
("bedsheet", "Bedding", 15.50, 18);