// Hämta referenser till uppgiftens inmatningsfält och uppgiftslistan
let taskTitle = document.getElementById('taskTitle');
let taskDescription = document.getElementById('taskDescription');
let taskStatus = document.getElementById('taskStatus');
let taskDeadline = document.getElementById('taskDeadline');
let taskEstimate = document.getElementById('taskEstimate');
let taskCategory = document.getElementById('taskCategory');
let taskList = document.getElementById('taskList');
let tasks = [];



// Deklaration av funktioner
let saveTasksToLocalStorage = (task) => {
    console.log("saving to local storage..", JSON.stringify(task))
    console.log("saving to local storage.." + this)
 
    //Gör så den hamnar i currentUser.task och ersätter den tidigare tasken.
    // let currentUser =localStorage.getItem('currentUser');
    // let currentUserObject= JSON.parse(currentUser);
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUserObjectsTasks = currentUserObject.tasks;
    let currentTask = task;

    if(this.classList.contains('delete')) { // om det klickadee objektets har klassen delete 
        //delete
        // Filtrera bort raderade uppgifter innan du sparar till localStorage
        let tasksToSave = tasks.filter(task => !task.deleted);
        localStorage.setItem('tasks', JSON.stringify(tasksToSave));

        let thisTaskInTheArray = currentUserObjectsTasks.find(
            (task) =>{ return task.title === currentTask.title}
            );
        let indexOfTask = currentUserObjectsTasks.indexOf(thisTaskInTheArray);
        currentUserObject.tasks[indexOfTask] = thisTaskInTheArray;
        currentUser = JSON.stringify(currentUserObject);//uppdatera denna så att den matchar den andra igen
        
    } else if(this.classList.contains('edit') ){ // det klickade objektet har klassen edit
        
    //     //edit
    
    //     let thisTaskInTheArray = currentUserObjectsTasks.find(
    //         (task) =>{ return task.title === currentTask.title}
    //         );
    //     let indexOfTask = currentUserObjectsTasks.indexOf(thisTaskInTheArray);
    //     currentUserObject.tasks[indexOfTask] = thisTaskInTheArray;
    //     currentUser = JSON.stringify(currentUserObject);//uppdatera denna så att den matchar den andra igen

    } else if ( this.classList.contains('toggle')){ ///det klickade objektet har klassen toggle (för completed)


    } else if (/* add task - om den klickade knappen har idt addTaskBtn*/ this.querySelector('#addTaskBtn')){

    // };

    
    //lägga in de ändringar som vi har gjort med tasks och sedan även currentuser in i users

    // users[indexOfUser].tasks[indexOfTask] = 

    let thisUserInTheArray = users.find(
    (user) =>{ return user.username === currentUserObject.username}
    );
    let indexOfUser = users.indexOf(thisUserInTheArray);

    users[indexOfUser] = currentUserObject;
    localStorage.setItem('users', JSON.stringify(users))

    //completed


    // tasks ----> currentUser

    //currentUser ----> users


    // vi behöver skapa if satser så att funktionen körs vid rätt tillfälle (edit,delete)
}

function createTaskElement(task, index) {
    if (task.deleted) {
        // Ignorera raderade uppgifter
        return null;
    }
    // Skapa ett nytt listelement
    let li = document.createElement('li');

    // Lägg till uppgiftens titel, beskrivning, status, deadline, tidsestimat och kategori till listelementet

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

    // Lägg till en eventListener till "Redigera" knappen
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
    /* kontrollerar att man som användare har fyllt i alla uppgifter. */

    if (!taskTitle.value || !taskDescription.value || !taskDeadline.value || !taskEstimate.value || !taskCategory.value) {
        let errorMessage = 'Fill in all the information to add a task';

        alert(errorMessage);
        return;
    }

    // Skapa ett nytt uppgifts-objekt med värdena från inmatningsfälten
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

    //lägga till tasks inuti currentUser
    let currentUserObject = JSON.parse(currentUser); //gör om strängen till ett objekt
    currentUserObject.tasks = tasks; //lägger in tasks som ett key-value par i objektet currentuser
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



    //Slut på sofias kodblock







    // Spara uppgifterna till localStorage
    //saveTasksToLocalStorage();
}

// Funktion för att ladda uppgifter från localStorage (Fungerar ej ?)
function loadTasksFromLocalStorage() {
    try {
        // Hämta uppgifterna från localStorage
        const loadedTasks = JSON.parse(localStorage.getItem('tasks'));
        // Om det finns några uppgifter, skapa ett nytt uppgiftselement för varje och lägg till det i uppgiftslistan
        if (loadedTasks) {
            tasks = loadedTasks;
            tasks.forEach((task, index) => {
                const taskElement = createTaskElement(task, index);
                if (taskElement) {
                    taskList.appendChild(taskElement);
                }
            });
        }
    } catch (error) {
        // Logga felet eller visa ett felmeddelande till användaren om något går fel vid parsning av JSON-data
        console.error('Failed to parse tasks from localStorage:', error);
        // Visar ett felmeddelande  till användaren ''
        alert('Failed to load tasks from localStorage. Please try again later.');
    }
}
////bör ej vata kvar 
// loadTasksFromLocalStorage();

// Funktion för att filtrera uppgifter baserat på deras status
function filterTasksByStatus(status) {
    return tasks.filter(task => task.status === status);
}




// Funktion för att visa uppgifter baserat på deras status
function displayTasksByStatus(status) {
    // Filtrera uppgifterna
    let filteredTasks = filterTasksByStatus(status);

    // Rensa den nuvarande uppgiftslistan
    taskList.innerHTML = '';

    // Skapa och lägg till ett nytt uppgiftselement för varje filtrerad uppgift
    filteredTasks.forEach((task, index) => {
        const taskElement = createTaskElement(task, index);
        taskList.appendChild(taskElement);
    });
}

//Funktion för att visa samtliga tasks utan sortering. 


function showAllTasks() {
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
}

// Funktion för att öppna redigeringsläge för en uppgift. Den tar in två argument, task och index. 
function openTaskEdit(task, index) {
    // Skapa nya inputs för redigering av varje uppgiftsdel. 
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
    let taskElement = taskList.children[index];
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

        // Sparar
        saveTasksToLocalStorage(task);

        // UPdaterad lista vid ändring 
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

        // Den återställer evetlistner  för "Markera som slutförd" / "Ångra" och "Radera" knappar
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
    });

}

// Lägg till en eventlistener för knappen "Apply Filters"
document.getElementById('applyFiltersButton').addEventListener('click', function () {
    filterTasksByCategory();
});

// Funktion för att filtrera uppgifter baserat på kategorierna som är markerade
function filterTasksByCategory() {
    let selectedCategories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.id.replace("CategoryCheckbox", "").toLowerCase());

    if (selectedCategories.length === 0) {
        showAllTasks();
        return;
    }

    let filteredTasks = tasks.filter(task => selectedCategories.includes(task.category.toLowerCase()));

    taskList.innerHTML = ''; // Rensa den aktuella uppgiftslistan
    filteredTasks.forEach((task, index) => { // Lägg till de filtrerade uppgifterna i listan
        const taskElement = createTaskElement(task, index);
        taskList.appendChild(taskElement);
    });
}



// 4 Funktioner som ser likadana ut. De sorterar bara på olika variabler 

// Funktionalitet  för att sortera uppgifter baserat på DEADLINE i stigande ordning. Ser exakt likadon ut som nästa funktion. (Hittade logiken på stackoverflow) 
function sortTasks(sortType) {
    switch (sortType) {
        case 'deadlineAscending':
            tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
            break;
        case 'deadlineDescending':
            tasks.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
            break;
        case 'estimateAscending':
            tasks.sort((a, b) => a.estimate - b.estimate);
            break;
        case 'estimateDescending':
            tasks.sort((a, b) => b.estimate - a.estimate);
            break;
        default:
            console.log('Invalid sort type');
            return;
    }
    showAllTasks();
}




//sätta funktionalitet på knappar i tasks

let currentUser = localStorage.getItem("currentUser");
let currentUserObject = JSON.parse(currentUser); //gör om strängen till ett objekt



// Lägg till en eventListener till "MARKERA SOM SLUTFÖRD" / "Ångra" knappen. 
//skapar nodelista
let completedBtnNodes = document.querySelectorAll('.toggle');


//loopa igenom nodelista och sätta funktionalitet på alla completedknappar
completedBtnNodes.forEach((button) => {
    button.addEventListener('click', function () {

        console.log('eventlistener  TOGGLE körs!');
        let thisTaskLi = this.parentNode;
        let taskTitle = thisTaskLi.querySelector('.taskTitle').textContent;

        let tasksFromCurrentUser = currentUserObject.tasks;

        let task = tasksFromCurrentUser.find((task) => task.title === taskTitle);
        console.log(task);


        task.status = !task.status;
        li.querySelector('.status').textContent = task.status ? 'completed' : 'Not completed';
        this.textContent = task.status ? 'Undo' : 'Mark as complete';

    });
});


// Välj alla knappar med klassen 'DELETE' 

let deleteBtnNodes = document.querySelectorAll('.delete');

console.log('dessa är delete nodes:' + deleteBtnNodes);

// Loopa igenom nodlistan och lägg till händelselyssnare på varje delete-knapp
deleteBtnNodes.forEach((button) => {
    button.addEventListener('click', function () {
        console.log('Event listener DELETE körs!'); // Logga att händelselyssnaren körs

        // Hämta förälderelementet till knappen, vilket är listelementet som innehåller uppgiften
        let thisTaskLi = this.parentNode;

        // Hämta index för uppgiften från dess data-index attribut
        let taskIndex = parseInt(thisTaskLi.getAttribute('data-index'));

        tasks.splice(taskIndex, 1);      // Ta b¨ort uppgiften från arrayen tasks baserat på dess index

        taskList.removeChild(thisTaskLi);        // Ta bort listelementet från DOM:en

        // Uppdatera index
        updateTaskIndices();
    });
});






// Välj alla knappar med klassen 'EDIT'
document.addEventListener('DOMContentLoaded', function () {
    try {
        let editBtnNodes = document.querySelectorAll('.edit');
        console.log('dessa är edit nodes:' + editBtnNodes);

        // Loopa igenom nodlistan och lägg till händelselyssnare på varje edit-knapp
        editBtnNodes.forEach((button) => {
            button.addEventListener('click', function () {
                console.log('Event listener EDIT körs!'); // tillfällig Loggar att händelselyssnaren körs

                let thisTaskLi = this.parentNode;
                let taskIndex = parseInt(thisTaskLi.getAttribute('data-index'));
                let task = currentUserObject.tasks[taskIndex];
                openTaskEdit(task, taskIndex);
            });
        });
    } catch (err) {
        console.log('det går inte att göra en nodelista av edit btns');
    }
});


//DET HÄR UNDER ÄR DET INNEHÅLL SOM SKA SKRIVAS OM FÖR ATT MATCHA FORMATET OVAN OCH SEN TAS BORT





// // Lägg till en eventListener till "Radera" knappen
// // I delete-eventet för uppgifter, använd data-attribut för att hämta indexet för uppgiften
// li.querySelector('.delete').addEventListener('click', function () {
//     let taskIndex = parseInt(li.getAttribute('data-index'));
//     tasks.splice(taskIndex, 1); // Ta bort uppgiften från arrayen baserat på index
//     saveTasksToLocalStorage();
//     taskList.removeChild(li); // Ta bort listelementet från DOM:en
//     updateTaskIndices(); // Uppdatera data-index attributen för alla uppgifter efter borttagning
// });

// // Lägg till en eventListener till "Redigera" knappen
// li.querySelector('.edit').addEventListener('click', function () {
//     openTaskEdit(task, index);
// });

// // Sätt data-index attributet för att lagra indexet för uppgiften
// li.setAttribute('data-index', index);



//olika styling för tasks som skapas och tasks som laddas in