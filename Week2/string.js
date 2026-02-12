// This is a comment in JavaScript
/* This is a multi-line comment
.....
.....

....
*/

// String represent textual data using quotes or backticks: "s" 's' or `s`
let first = "John";
let last = "Ibis";
let fullName = first + " " + last; // String concatenation can be confusing
console.log(fullName); // Output: John Ibis

// Using template literals for easier string interpolation
let fullNameTemplate = `The full name is: ${first} ${last}`;
console.log(fullNameTemplate); //Output is: John Ibis

// Common string operations
let sampleString = " Hello, World! ";

// Length of the string
console.log(sampleString.length); //Output: 15

// Convert to uppercase
console.log(sampleString.toUpperCase()); //Output: "HELLO, WORLD!"

// Convert to lowercase
console.log(sampleString.toLowerCase()); //Output: "hello, world!"

//Trim whitespace
console.log(sampleString.trim()); // Output: "Hello, World!"