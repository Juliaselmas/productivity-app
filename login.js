let usernameInput = document.querySelector("#usernameInput");
let passwordInput = document.querySelector("#passwordInput");

let logInBtn = document.querySelector('#logInBtn');

let registerBtn = document.querySelector('#registerBtn');

let main = document.querySelector("main");

let userContentContainer = document.querySelector("#userContentContainer");




let users = JSON.parse(localStorage.getItem ("users")) || []; // hämta tidigare data alternativt skapa en tom array

let register = async () => {
    //hämta inputs
    let username = usernameInput.value;
    let password = passwordInput.value;
    console.log("användarnamn: "+ username)


    //kolla så att användarnamnet inte redan finns
    let userNameAlreadyExists = users.find((user) => user.username === username);
        
    if (userNameAlreadyExists){
        alert("Username is already taken!");
    } else {
        //skapa användare & lägg i array
        let user = {
            username: username,
            password: password
        }
        console.log(user);
        
        users.push(user);
        console.log(users);
        
        //lägg input i localstorage
        localStorage.setItem("users", JSON.stringify(users));
        
        console.log(localStorage.getItem("users"));
    
        // sätt nuvarande användare i Localstorage
        localStorage.setItem("currentUser", JSON.stringify(user))

    }; // här slutar else satsen
    
};

registerBtn.addEventListener("click", register);



let quoteParagraph = document.createElement("p");//den här behöver ligga globalt eftersom den ska användas både i login in och logout
let taskListUl = document.querySelector("#taskList");//samma som ovan

let login = async () => {
    //hämta inputs
    let username = usernameInput.value;
    let password = passwordInput.value;
    console.log("användarnamn: "+ username);
    
    
    //jämföra inputs med array
    let user = users.find(
        (user) => user.username === username && user.password === password
        );
        
    // Bekräftelsemeddelande på success
        
    if(user) {
        //successful login
        console.log("Welcome " + user.username + "!");
    } else {
        console.log("Lol u failed");
    }
    



    //Hämta rätt användares todos och rutiner och skriv ut dem 
    if (user.tasks) { // varför reageras på detta? om det inte finns några tasks så bör den väl snarare bara gå till else satsen???
        let taskLi = document.createElement("li");
        taskLi.innerHTML = '<p> ${user.tasks} </p>';
        taskListUl.append(taskLi);
    } else {
        let paragraph = document.createElement("p");
        paragraph.innerText = "Create your first task!";
        taskListUl.append(paragraph);
    }
    



    //skriva ut citat från API

    // här börjar axios
    let response = await axios.get('https://api.quotable.io/quotes/random');
    let quote = response.data[0].content;
    console.log(quote);

    quoteParagraph.innerText = quote;

    //main.append(quoteParagraph);
    let qotdSection = document.querySelector("#qotdSection");
    qotdSection.append(quoteParagraph);


    // sätt nuvarande användare i Localstorage
    localStorage.setItem("currentUser", JSON.stringify(user))

   
    //lämna hälsningsmeddelande
    let h1 = document.querySelector("#h1");
    h1.innerText = 'Welcome ' + user.username + "!";
   
};

logInBtn.addEventListener("click", login);


//Logga ut funktion
let logOutBtn = document.querySelector("#logOutBtn");

logOutBtn.addEventListener("click", () => {
    //ta bort alla ärenden och rutiner
    userContentContainer.innerHTML = " ";

    // nollställ nuvarande användare i Localstorage
    localStorage.setItem("currentUser", "none");

    //
});












