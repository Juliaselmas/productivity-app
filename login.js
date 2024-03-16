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

        //lägga in inloggning här? så att man får öppna allt och blir inloggad?

    }; // här slutar else satsen
    
};

registerBtn.addEventListener("click", register);




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
        
        console.log(user);
        
        // Bekräftelsemeddelande på success
        
        if(user) {
            //successful login
            console.log("Welcome " + user.username + "!");
        } else {
            console.log("User not found, please register a new user."); 
        } 
        
        
        // sätt nuvarande användare i Localstorage
        localStorage.setItem("currentUser", JSON.stringify(user));
        
        
        
        
        //skicka användaren till startsidan
        window.location.href = "index.html";
                
};// här slutar login
            
            
logInBtn.addEventListener("click", login);


//Nedan körs när man har loggat in
//Hämta rätt användares todos och rutiner och skriv ut dem 

//Hitta rätt användare från users

let currentUserLogin = localStorage.getItem("currentUser");
let currentUserObjectLogin = JSON.parse(currentUserLogin);


//Börja med att ta bort tidigare användares tasks
taskListUl.innerHTML = " "; 
console.log('Om det inte finns några tasks så är detta undefined - > ' + currentUserObjectLogin.tasks);
if (currentUserObjectLogin.tasks) { 
    
    currentUserObjectLogin.tasks.forEach(task => {
        let taskLi = document.createElement("li"); 
        taskLi.innerHTML = `
        <h3 class="taskTitle">${task.title}</h3>
        
        <p>${task.description}</p>
        <p>Status: <span class="status">${task.status ? 'completed' : 'Not completed'}</span></p>
        <p>Deadline: ${task.deadline}</p>
        <p>Estimated time: ${task.estimate} hours</p>
        <p>category: ${task.category}</p>
        <button class="toggle">${task.status ? 'Undo' : 'Mark as complete'}</button>
        <button class="edit"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="delete"><i class="far fa-trash-can"></i></button>
        `;  
        
        
        taskListUl.append(taskLi);
    });
    
} else {
    let paragraph = document.createElement("p");
    paragraph.innerText = "Create your first task!";
    taskListUl.append(paragraph);
}



//skriva ut citat från API

let quoteParagraph = document.createElement("p");//den här behöver ligga globalt eftersom den ska användas både i login in och logout
quoteParagraph.setAttribute('id', 'quoteParagraph');
// här börjar axios
let getQuote = async () =>{
    let response = await axios.get('https://api.quotable.io/quotes/random');
    let quote = response.data[0].content;
    
    
    quoteParagraph.innerText = quote;
    
    //main.append(quoteParagraph);
    let qotdSection = document.querySelector("#qotdSection");
    qotdSection.append(quoteParagraph);
    
}
getQuote();




//lämna hälsningsmeddelande
let h1 = document.querySelector("#h1");
h1.innerText = 'Welcome ' + currentUserObjectLogin.username + "!";




        
//Logga ut funktion
let logOutBtn = document.querySelector("#logOutBtn");

logOutBtn.addEventListener("click", () => {
    // //ta bort alla ärenden och rutiner
    // userContentContainer.innerHTML = " ";

    // nollställ nuvarande användare i Localstorage
    localStorage.setItem("currentUser", "none");

     //skicka användaren till startsidan
     window.location.href = "login.html";

    //
});




