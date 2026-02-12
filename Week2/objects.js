//non-primitive data type: Objects are used to store collections of data and more complex entities
let person = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    address: {
        street: "123 Main Street",
        city: "New York",
        zipCode: "10001"
    }
 };

console.log(person); // Output: entire person object

console.log(person.firstName); // Output: John
console.log(person.address.city); //Outut: New York

person.email = "ljt70@miami.edu"; // Adding a new property
console.log(person); //Output:
