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



let quoteParagraph = document.createElement("p");//den här behöver ligga globalt eftersom den ska användas både i login in och logout
quoteParagraph.setAttribute('id', 'quoteParagraph');

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



    //Hämta rätt användares todos och rutiner och skriv ut dem 
    
    //Börja med att ta bort tidigare användares tasks
    taskListUl.innerHTML = " "; // varför funkar inte det här???
    console.log('Om det inte finns några tasks så är detta undefined - > ' + user.tasks);
    if (user.tasks) { // verkar ej fungera nu längre?
        
        user.tasks.forEach(task => {
            let taskLi = document.createElement("li");
            taskLi.innerHTML = `
            <h3>${task.title}</h3>
    
            <p>${task.description}</p>
            <p>Status: <span class="status">${task.status ? 'completed' : 'Not completed'}</span></p>
            <p>Deadline: ${task.deadline}</p>
            <p>Estimated time: ${task.estimate} hours</p>
            <p>category: ${task.category}</p>
            <button class="toggle">${task.status ? 'Undo' : 'Mark as complete'}</button>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        `;  


        taskListUl.append(taskLi);
        });
        
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

    //slut på axios



   
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








//     // OBS nedan ej klart /S


//     //lägga till tasks inuti currentUser
//     let currentUserObject = JSON.parse(currentUser); //gör om strängen till ett objekt
//     currentUserObject.tasks = tasks;
//     console.log(currentUserObject);
//     currentUser = JSON.stringify(currentUserObject); //konverterar tillbaka till en sträng


//     localStorage.setItem("currentUser" , currentUser); // uppdaterar currentUser till det nya som har skapats


//     //hämta motsvarande user frånusers array och uppdatera den med nya tasks, stoppa sedan tillbaka den i users arrayn

//     let users = JSON.parse(localStorage.getItem ("users")) || []; // hämta tidigare data alternativt skapa en tom array

//     //tittar i arrayn med users och väljer den användaren som legat i arrayn
//     let thisUserInTheArray = users.find(
//         (user) => user.username === currentUser.username && user.password === currentUser.password
//         );

//         console.log(currentUserObject.tasks);        
//     //byta ut tasks i användaren i users mot currentusers tasks
//     thisUserInTheArray.tasks = currentUserObject.tasks;
    
//     console.log(thisUserInTheArray);
    
    
//         // let previousUser = users.find(
//     //     (user) => user.username === currentUser.username && user.password === currentUser.password
//     //     );
//     // let updatedUser = currentUser; //uppdaterar så att updatedUser matchar currentUser


//     // let index = users.findIndex(
//     // (user) => user.username === previousUser.username && user.password === previousUser.password
//     // ); // skapa ett index för var i users arrayen som användaren vi jobbar med ligger

//     // if (index !== -1) {
//     //     // ersätta previousUser med updatedUser med hjälp av indexet
//     //     users[index] = updatedUser;
    
//         // spara den uppdaterade användaren tillbaka till localStorage
//     localStorage.setItem("users", JSON.stringify(users));
//     }


//     //hämta tasks[ ] och lägg in dem i currentUser

//     //lägga in updated version av currentUser i users

//     // uppdatera currentuser och users när man raderar en task från tasks[]

//     //uppdatera currentUser och users när man redigerar en task från tasks []


//     //slut på sofias kodblock
