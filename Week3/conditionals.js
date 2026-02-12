//equal == ===
//not equal != !==
//greater than >
//less than <
//greater than or equal to >=
//less than or equal to <=

if ( 5 === 5) {
    console.log("5 is equal to 5");
}

if (5 == "5") {
    console.log("5 is equal to '5'");
}

let a = "contact";

if (a == "home") {
    console.log("show home page");
}
else if (a == "about") {
    console.log("show about page");
}else {
    console.log("show contact page");
}
    console.log("show about page");

//switch case
let page = "home";

switch(page) {
    case "home":
        console.log("show home page");
        break;
    case "about":
        console.log("show about page");
        break;
    default:
        console.log("Not found");
}  