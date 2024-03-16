// Hämta referenser till uppgiftens inmatningsfält och uppgiftslistan
let taskTitle = document.getElementById('taskTitle');
let taskDescription = document.getElementById('taskDescription');
let taskStatus = document.getElementById('taskStatus');
let taskDeadline = document.getElementById('taskDeadline');
let taskEstimate = document.getElementById('taskEstimate');
let taskCategory = document.getElementById('taskCategory');
let taskList = document.getElementById('taskList');
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let saveTasksToLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

//Skapa mall för en task som senare ska fyllas på
function createTaskElement(task, index) {
    if (task.deleted) {
        // Ignorera raderade uppgifter
        return null;
    }
    // Skapa ett nytt listelement
    let li = document.createElement('li');

    // Lägger till uppgiftens titel, beskrivning, status, deadline, tidsestimat och kategori till listelementet

    li.innerHTML = `
        <h3 class="taskTitle">${task.title}</h3>

        <p>${task.description}</p>
        <p>Status: <span class="status">${task.status ? 'completed' : 'Not completed'}</span></p>
        <p>Deadline: ${task.deadline}</p>
        <p>Estimated time: ${task.estimate} hours</p>
        <p>category: ${task.category}</p>
        <button class="toggle">${task.status ? 'Undo ' : 'Mark as complete'}</button>
        <button class="edit"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="delete"><i class="far fa-trash-can"></i>
        </button> 

        </button>
    `;

    //eventListener till "Markera som slutförd" / "Ångra" knappen. 

    li.querySelector('.toggle').addEventListener('click', function () {
        task.status = !task.status;
        li.querySelector('.status').textContent = task.status ? 'completed' : 'Not completed';
        this.textContent = task.status ? 'Undo' : 'Mark as complete';
        saveTasksToLocalStorage();
    });

    //  eventListener till "Radera" knappen
    // I delete-eventet för uppgifter, använd data-attribut för att hämta indexet för uppgiften
    li.querySelector('.delete').addEventListener('click', function () {
        let taskIndex = parseInt(li.getAttribute('data-index'));
        tasks.splice(taskIndex, 1); // Ta bort uppgiften från arrayen baserat på index
        saveTasksToLocalStorage();
        taskList.removeChild(li); // Ta bort listelementet från DOM:en
        updateTaskIndices(); // Uppdatera data-index attributen för alla uppgifter efter borttagning
    });

    // EventListener till "Redigera" knappen
    li.querySelector('.edit').addEventListener('click', function () {
        openTaskEdit(task, index);
    });

    // data-index attributet för att lagra indexet för uppgiften
    li.setAttribute('data-index', index);

    // Returnera listelementet
    return li;
}



// Funktion för att uppdatera data-index attributen för alla uppgifter i listan
function updateTaskIndices() {
    Array.from(taskList.children).forEach((taskElement, index) => {
        taskElement.setAttribute('data-index', index);
    });
}



// Funktion för att lägga till en ny uppgift
function addTask() {
    /* kontrollerar att man som användare har fyllt i alla uppgifter, men jag är medveten om att den inte fungerar korrekt. Behöver öndras */

    // console.log('taskTitle.value:', taskTitle.value);
    // console.log('taskDescription.value:', taskDescription.value);
    // console.log('taskDeadline.value:', taskDeadline.value);
    // console.log('taskEstimate.value:', taskEstimate.value);
    // console.log('taskCategory.value:', taskCategory.value);
    if (!taskTitle.value || !taskDescription.value || !taskDeadline.value || !taskEstimate.value || !taskCategory.value) {
        let errorMessage = 'Fill in all the information to add a task';

        alert(errorMessage);
        return;
    }

    // Skapar ett nytt uppgifts-objekt med värdena från inmatningsfälten
    let task = {
        title: taskTitle.value,
        description: taskDescription.value,
        status: taskStatus.checked,
        deadline: taskDeadline.value,
        estimate: taskEstimate.value,
        category: taskCategory.value,
        deleted: false // indikera om uppgiften är raderad
    };

    if (!task.deleted) {
        tasks.push(task);
        const taskElement = createTaskElement(task, tasks.length - 1); // Använd tasks.length - 1 som index
        taskList.appendChild(taskElement);
        taskElement.setAttribute('data-index', tasks.length - 1); // Sätt data-index attributet för att lagra indexet
    }

    // Rensa inmatningsfälten
    taskTitle.value = '';
    taskDescription.value = '';
    taskStatus.checked = false;
    taskDeadline.value = '';
    taskEstimate.value = '';
    taskCategory.value = '';





    //SOFIAS KOD - användardata

    // selecta nuvarande användaren 
    let currentUser = localStorage.getItem("currentUser");
    let currentUserObject = JSON.parse(currentUser); //gör om strängen till ett objekt

    //lägga till tasks inuti currentUser

    //alternativ metod: göra en variabel av currentUser.tasks och sedan göra en array som man pushar in var ny task i
    let currentUserObjectTasks = currentUserObject.tasks || [];
    currentUserObjectTasks.push(task); //lägg till nya tasken

    currentUserObject.tasks = currentUserObjectTasks; //lägger in tasks som ett key-value par i objektet currentuser
    console.log(currentUserObject);
    currentUser = JSON.stringify(currentUserObject); //konverterar tillbaka till en sträng


    localStorage.setItem("currentUser", currentUser); // uppdaterar currentUser till det nya som har skapats

    //hämta motsvarande user frånusers array och uppdatera den med nya tasks, stoppa sedan tillbaka den i users arrayn
    let users = JSON.parse(localStorage.getItem("users")) || [];
    //let users = JSON.stringify(localStorage.getItem ("users")) || []; 
    // hämta tidigare data alternativt skapa en tom array

    console.log(users);

    //tittar i arrayn med users och väljer den användaren som legat i arrayn
    let thisUserInTheArray = users.find(
        (user) => {
            console.log("checking user", user.username, currentUserObject.username)
            return user.username === currentUserObject.username
        }
    );

    console.log(thisUserInTheArray);  //såhär ser användaren ut i users innan vi upppdaterat den
    console.log(currentUserObject); //såhär vill vi att den ska se ut


    // hitta index för objektet i arrayen
    let indexOfUser = users.indexOf(thisUserInTheArray);
    console.log(indexOfUser);
    console.log(thisUserInTheArray.tasks + currentUserObject.tasks);
    thisUserInTheArray.tasks = currentUserObject.tasks;  //byta ut tasks i användaren i users mot currentusers tasks 
    console.log("uppdaterade användaren: " + thisUserInTheArray); //nu är den uppdaterad

    //lägga in den uppdaterade versionen av användaren i users
    users[indexOfUser] = thisUserInTheArray;

    //lägga in nya versionen av users i LocalStorage
    localStorage.setItem('users', JSON.stringify(users));

};

let addTaskBtn = document.querySelector('#addTaskBtn');
addTaskBtn.addEventListener('click', addTask);


// Funktion för att filtrera uppgifter baserat på deras status
function filterTasksByStatus(status) {
    return tasks.filter(task => task.status === status);
};


// Funktion för att visa uppgifter baserat på deras status
function displayTasksByStatus(status) {
    // Filtrera uppgifterna
    let filteredTasks = filterTasksByStatus(status);

    // Rensar den nuvarande uppgiftslistan
    taskList.innerHTML = '';

    // Skapar och lägger till ett nytt uppgiftselement för varje filtrerad uppgift
    filteredTasks.forEach((task, index) => {
        const taskElement = createTaskElement(task, index);
        taskList.appendChild(taskElement);
    });
};

function showAllTasks(tasks) {
    // Rensa taskList
    taskList.innerHTML = '';

    // Iterera över tasks
    tasks.forEach((task, index) => {
        // Skapa ett nytt uppgiftselement och lägg till det i taskList
        const taskElement = createTaskElement(task, index);
        if (taskElement) {
            taskList.appendChild(taskElement);
        }
    });
};



//Funktion för att öppna redigeringsläge för en uppgift. Den tar in två argument, task och index. 
function openTaskEdit(task, index) {
    // Skapar nya inputs för redigering av varje uppgiftsdel. 
    let newTitleInput = document.createElement("input");
    newTitleInput.type = "text";
    newTitleInput.value = task.title;
    let newDescriptionInput = document.createElement("input");
    newDescriptionInput.type = "text";
    newDescriptionInput.value = task.description;
    let newStatusInput = document.createElement("input");
    newStatusInput.type = "checkbox";
    newStatusInput.checked = task.status;
    let newDeadlineInput = document.createElement("input");
    newDeadlineInput.type = "date";
    newDeadlineInput.value = task.deadline;
    let newEstimateInput = document.createElement("input");
    newEstimateInput.type = "number";
    newEstimateInput.value = task.estimate;
    let newCategoryInput = document.createElement("select");
    let categories = ["Health", "Household", "Work-related", "Fun"];
    categories.forEach(category => {
        let option = document.createElement("option");
        option.value = category.toLowerCase();
        option.text = category;
        newCategoryInput.appendChild(option);
    });
    newCategoryInput.value = task.category.toLowerCase();

    // Skapar en knapp--> uppdatera 
    let updateButton = document.createElement("button");
    updateButton.textContent = "Update";

    // Ersätt varje uppgiftsdetalj med motsvarande input-fält för redigering
    //let thisLi = this.parent; //Nå rätt li
    //let indexOfTaskInDOM = Array.from(taskList.children).indexOf(thisLi);
    let taskElement = taskList.children[index]; // Verkar som att det kan vara indexet här som blir fel och tar den översta tasken
    taskElement.innerHTML = '';
    taskElement.appendChild(newTitleInput);
    taskElement.appendChild(newDescriptionInput);
    taskElement.appendChild(newStatusInput);
    taskElement.appendChild(newDeadlineInput);
    taskElement.appendChild(newEstimateInput);
    taskElement.appendChild(newCategoryInput);
    taskElement.appendChild(updateButton);

    // eventListener för Uppdatera knappen/funktionen 
    updateButton.addEventListener('click', function () {
        // Uppdatera objektet med de nya inputen som användaren gör i input-fälten
        task.title = newTitleInput.value;
        task.description = newDescriptionInput.value;
        task.status = newStatusInput.checked;
        task.deadline = newDeadlineInput.value;
        task.estimate = newEstimateInput.value;
        task.category = newCategoryInput.value;

        // Sparar till localS
        saveTasksToLocalStorage(task); // denna sparar bara till tasks[] som ligger löst i LocalStorage

        // UPdaterad lista vid ändring /redigering 
        taskElement.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p>status: <span class="status">${task.status ? 'completed' : 'Not completed'}</span></p>
        <p>Deadline: ${task.deadline}</p>
        <p>Estimated time: ${task.estimate} hours</p>
        <p>Category: ${task.category}</p>
        <button class="toggle">${task.status ? 'Undo' : 'Mark as complete'}</button>
        <button class="edit"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="delete"><i class="far fa-trash-can"></i>
    `;

        // Den återställer eventlistener  för "Markera som slutförd" / "Ångra" och "Radera" knappar
        taskElement.querySelector('.toggle').addEventListener('click', function () {
            task.status = !task.status;
            taskElement.querySelector('.status').textContent = task.status ? 'completed' : 'Not completed';
            this.textContent = task.status ? 'Undo' : 'Mark as complete';
            saveTasksToLocalStorage();
        });
        taskElement.querySelector('.delete').addEventListener('click', function () {
            taskList.removeChild(taskElement);
            tasks.splice(index, 1);
            saveTasksToLocalStorage();
        });
        taskElement.querySelector('.edit').addEventListener('click', function () {
            openTaskEdit(task, index);
        });

        //spara resten av localstorage
        console.log('task är: ' + task);
        console.log('index är: ' + index);
        saveEditedToStorage(index, task);
    });


    //return task; //detta ska användas senare


}


// Funktion för att filtrera uppgifter baserat på kategorierna som är markerade
function filterTasksByCategory() {
    let selectedCategories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.id.replace("CategoryCheckbox", "").toLowerCase());

    let currentUserShowAllTasks = localStorage.getItem("currentUser");
    let currentUserObjectShowAll = JSON.parse(currentUserShowAllTasks); //gör om strängen till ett objekt

    if (selectedCategories.length === 0) {
        showAllTasks(currentUserObjectShowAll.tasks);
    }
    else {
        let filteredTasks = currentUserObjectShowAll.tasks.filter(task => selectedCategories.includes(task.category.toLowerCase()));
        showAllTasks(filteredTasks);
    }
}

// Funktionalitet  för att sortera uppgifter baserat på DEADLINE i stigande ordning. Ser exakt likadon ut som nästa funktion. (Hittade logiken på stackoverflow) 
// Funktion för att sortera uppgifter baserat på det valda sorteringsalternativet
function sortTasks(sortType) {

    let currentUserStorage = localStorage.getItem("currentUser");
    let currentUserStorageObject = JSON.parse(currentUserStorage); //gör om strängen till ett objekt

    console.log('Sort type:', sortType);
    switch (sortType) {
        case 'deadlineAscending':
            currentUserStorageObject.tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
            break;
        case 'deadlineDescending':
            currentUserStorageObject.tasks.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
            break;
        case 'estimateAscending':
            currentUserStorageObject.tasks.sort((a, b) => a.estimate - b.estimate);
            break;
        case 'estimateDescending':
            currentUserStorageObject.tasks.sort((a, b) => b.estimate - a.estimate);
            break;
        default:
            console.log('Invalid sort type');
            return;
    }

    showAllTasks(currentUserStorageObject.tasks); // Uppdatera listan med de sorterade uppgifterna
}


//sätta funktionalitet på knappar i tasks

let currentUser = localStorage.getItem("currentUser");
let currentUserObject = JSON.parse(currentUser); //gör om strängen till ett objekt



function saveNonDeletedToStorage() {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    console.log('Event listener DELETE körs!'); // Logga att händelselyssnaren körs

    //Själva raderingen först
    // Hämta förälderelementet till knappen, vilket är listelementet som innehåller uppgiften
    let thisTaskLi = this.parentNode;
    // Hämta index för uppgiften från dess data-index attribut
    console.log('thisTaskLi' + thisTaskLi);
    let taskIndex = parseInt(thisTaskLi.getAttribute('data-index'));
    tasks.splice(taskIndex, 1);      // Ta b¨ort uppgiften från arrayen tasks baserat på dess index
    taskList.removeChild(thisTaskLi);        // Ta bort listelementet från DOM:en
    // Uppdatera index
    updateTaskIndices();


    //Uppdatera currentUser i localStorage
    let currentUserObjectTasks = currentUserObject.tasks;
    let taskTitle = thisTaskLi.classList.contains('title');
    let taskInTheArray = currentUserObjectTasks.find(
        (task) => { return task.title === taskTitle }
    );
    let indexOfTask = currentUserObjectTasks.indexOf(taskInTheArray);
    //currentUserObject.tasks[indexOfTask] = ; //ta bort denna
    currentUserObjectTasks.splice(taskInTheArray, 1);
    currentUser = JSON.stringify(currentUserObject);//uppdatera denna så att den matchar den andra igen

    localStorage.setItem('currentUser', currentUser);

    //uppdatera user
    let thisUserInTheArray = users.find(
        (user) => { return user.username === currentUserObject.username }
    );
    let indexOfUser = users.indexOf(thisUserInTheArray);

    users[indexOfUser] = currentUserObject;
    localStorage.setItem('users', JSON.stringify(users));
};

let deleteBtnNodes = document.querySelectorAll('.delete');
deleteBtnNodes.forEach((button) => {
    button.addEventListener('click', function () {
        console.log('Event listener DELETE körs!');

        saveNonDeletedToStorage.call(this);
    });
});







function saveEditedToStorage(indexOfLi, task) { // thisTask är den tidigare versionen, indexOfLi är vilket index, och task är den nya uppdaterade versionen som har gått via openTaskEdit
    let currentUserObjectTasks = currentUserObject.tasks;
    //let taskInTheArray = currentUserObjectTasks[indexOfLi];
    currentUserObjectTasks[indexOfLi] = task;
    //let indexOfTask = currentUserObjectTasks.indexOf(taskInTheArray);   

    //uppdatera currentUserObject.tasks
    //currentUserObject.tasks[indexOfTask] = /*den nya versionen av tasken här*/ ;


    //uppdatera currentUser
    currentUser = JSON.stringify(currentUserObject);//uppdatera denna så att den matchar den andra igen      
    localStorage.setItem('currentUser', currentUser);

    //uppdatera userS
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let thisUserInTheArray = users.find(
        (user) => { return user.username === currentUserObject.username }
    );
    let indexOfUser = users.indexOf(thisUserInTheArray);


    users[indexOfUser] = currentUserObject;
    localStorage.setItem('users', JSON.stringify(users));

};

//applicera funktionen på knapparna
let editedBtnNodes = document.querySelectorAll('.edit');
editedBtnNodes.forEach(function (button) {
    button.addEventListener('click', function () {
        console.log('Event listener EDIT körs!');
        //detta handlar mest om att hitta argument till parametrar i funktioner som körs mot slutet här. 
        let thisTaskLi = this.parentNode;

        //hitta index till openTaskEdit()
        //hämta ul 
        let thisTaskList = document.querySelector('#taskList');
        console.log('thisTaskList är: ' + thisTaskList);
        let arrayFromTaskListChildren = Array.from(thisTaskList.children);
        //hämta index av li i ul
        let indexOfLi = arrayFromTaskListChildren.indexOf(thisTaskLi);
        console.log('indexOfLi är: ' + indexOfLi);


        //hitta task till openTaskEdit()

        // Hämta förälderelementet till knappen, vilket är listelementet som innehåller uppgiften
        console.log('thisTaskLi är: ' + JSON.stringify(thisTaskLi));
        let taskTitle = thisTaskLi.classList.contains('title'); //fungerar ej?? därav nedan fullösning nedan
        console.log('thisTaskTitle är: ' + taskTitle);
        let currentUserObjectTasksInThisEvent = currentUserObject.tasks;
        let thisTask = currentUserObjectTasksInThisEvent[indexOfLi];
        console.log('thisTask är: ' + thisTask);




        openTaskEdit(thisTask, indexOfLi); //thisTask i det här fallet är den nuvarande/gamla versionen av task
        //saveEditedToStorage.call(this , thisTask);

    });
});






function saveToggledToStorage(indexOfLi) {

    //uppdatera tasks
    let currentUserObjectTasks = currentUserObject.tasks;

    // let thisTaskList = document.querySelector('#taskList');
    // console.log('thisTaskList är: ' + thisTaskList);
    // let arrayFromTaskListChildren = Array.from(thisTaskList.children);
    // //hämta index av li i ul
    // let indexOfLi = arrayFromTaskListChildren.indexOf(thisTaskLi);
    // console.log('indexOfLi är: ' + indexOfLi);

    let taskInTheArray = currentUserObjectTasks[indexOfLi];
    //console.log(taskInTheArray);
    //let taskTitle = thisTaskLi.classList.contains('title');

    // let taskInTheArray = currentUserObjectTasks.find(
    //     (task) =>{ return task.title === taskTitle}
    //     );
    // let indexOfTask = currentUserObjectTasks.indexOf(taskInTheArray);

    taskInTheArray.status = !taskInTheArray.status;
    console.log(taskInTheArray);
    console.log(taskInTheArray.status);

    //Få in ändrade status i currentUser

    currentUserObject.tasks[indexOfLi] = taskInTheArray;

    //uppdatera currentUser
    currentUser = JSON.stringify(currentUserObject);//uppdatera denna så att den matchar den andra igen      
    localStorage.setItem('currentUser', currentUser);

    //uppdatera userS
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let thisUserInTheArray = users.find(
        (user) => { return user.username === currentUserObject.username }
    );
    let indexOfUser = users.indexOf(thisUserInTheArray);

    users[indexOfUser] = currentUserObject;
    localStorage.setItem('users', JSON.stringify(users));


    //läs in DOM igen
    location.reload();
};

let toggledBtnNodes = document.querySelectorAll('.toggle');
toggledBtnNodes.forEach((button) => {
    button.addEventListener('click', function () {
        console.log('Event listener TOGGLE körs!');

        // Hämta förälderelementet till knappen, vilket är listelementet som innehåller uppgiften
        let thisTaskLi = this.parentNode;

        //hämta ul 
        let thisTaskList = document.querySelector('#taskList');
        //console.log('thisTaskList är: ' + thisTaskList);
        let arrayFromTaskListChildren = Array.from(thisTaskList.children);
        //hämta index av li i ul
        let indexOfLi = arrayFromTaskListChildren.indexOf(thisTaskLi);
        //console.log('indexOfLi är: ' + indexOfLi);
        console.log('indexOfLi är: ' + indexOfLi);


        saveToggledToStorage(indexOfLi);

    });

    //Detta är en eventlistnerer och funktionl för att kunna filterar baserat på vilken kategori man vill kunna få upp. 
    let applyFiltersButton = document.getElementById('applyFiltersButton');

    applyFiltersButton.addEventListener('click', function () {
        filterTasksByCategory();
    });
});

