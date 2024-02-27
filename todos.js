// Hämta referenser till uppgiftens inmatningsfält och uppgiftslistan
let taskTitle = document.getElementById('taskTitle');
let taskDescription = document.getElementById('taskDescription');
let taskStatus = document.getElementById('taskStatus');
let taskDeadline = document.getElementById('taskDeadline');
let taskEstimate = document.getElementById('taskEstimate');
let taskCategory = document.getElementById('taskCategory');
let taskList = document.getElementById('taskList');
let tasks = [];


// selecta nuvarande användaren -- detta behövs till användardatan
let currentUser = localStorage.getItem("currentUser");



// Deklaration av funktioner
let saveTasksToLocalStorage = () => {
    // Filtrera bort raderade uppgifter innan du sparar till localStorage
    let tasksToSave = tasks.filter(task => !task.deleted);
    localStorage.setItem('tasks', JSON.stringify(tasksToSave));
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

    // Lägg till en eventListener till "Markera som slutförd" / "Ångra" knappen. 
    li.querySelector('.toggle').addEventListener('click', function () {
        task.status = !task.status;
        li.querySelector('.status').textContent = task.status ? 'completed' : 'Not completed';
        this.textContent = task.status ? 'Undo' : 'Mark as complete';
        saveTasksToLocalStorage();
    });

    // Lägg till en eventListener till "Radera" knappen
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

    // Sätt data-index attributet för att lagra indexet för uppgiften
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
    /* kontrollerar att man som användare har fyllt i alla uppgifter. Just nu är det en "alert", men jag tycker att vi ska se om det finns en mer användarvänlig metod att meddela användaren om att hen inte fyllt i korrekt .
    Jag är medveten om att man kan skriva en bättre if sats, men har ej gjort det än */

    if (!taskTitle.value) {
        alert('Please enter a task title');
        return;
    }
    if (!taskDescription.value) {
        alert('Please enter a task description');
        return;
    }
    if (!taskDeadline.value) {
        alert('Please provide a deadline for the task');
        return;
    }
    if (!taskEstimate.value) {
        alert('Please provide an estimated time for the task');
        return;
    }
    if (!taskCategory.value) {
        alert('Please enter a category for the task');
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
    

    


    // OBS ej klart /S


    //lägga till tasks inuti currentUser
    let currentUserObject = JSON.parse(currentUser); //gör om strängen till ett objekt
    currentUserObject.tasks = tasks;
    console.log(currentUserObject);
    currentUser = JSON.stringify(currentUserObject); //konverterar tillbaka till en sträng


    localStorage.setItem("currentUser" , currentUser); // uppdaterar currentUser till det nya som har skapats


    //hämta motsvarande user frånusers array och uppdatera den med nya tasks, stoppa sedan tillbaka den i users arrayn

    let users = JSON.parse(localStorage.getItem ("users")) || []; // hämta tidigare data alternativt skapa en tom array
    let previousUser = users.find(
        (user) => user.username === currentUser.username && user.password === currentUser.password
        );
    let updatedUser = currentUser; //uppdaterar så att updatedUser matchar currentUser


    let index = users.findIndex(
    (user) => user.username === previousUser.username && user.password === previousUser.password
    ); // skapa ett index för var i users arrayen som användaren vi jobbar med ligger

    if (index !== -1) {
        // ersätta previousUser med updatedUser med hjälp av indexet
        users[index] = updatedUser;

    // spara den uppdaterade användaren tillbaka till localStorage
    localStorage.setItem("users", JSON.stringify(users));
    }
    
    //slut på sofias kodblock






    
    

    // Spara uppgifterna till localStorage
    saveTasksToLocalStorage();
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
        console.error('Failed to parse tasks from localStorage:', error);
        // Man kan också visa ett felmeddelande till användaren här.
    }
}
// Funktion för att ladda uppgifter från localStorage vid sidans laddning
loadTasksFromLocalStorage();

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

    // Skapa en knapp--> uppdatera 
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
        saveTasksToLocalStorage();

        // UPdaterad lista vid ändring 
        taskElement.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p>status: <span class="status">${task.status ? 'completed' : 'Not completed'}</span></p>
        <p>Deadline: ${task.deadline}</p>
        <p>Estimated time: ${task.estimate} hours</p>
        <p>Category: ${task.category}</p>
        <button class="toggle">${task.status ? 'Undo' : 'Mark as complete'}</button>
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
    `;

        // Tog hjälp av chatGpt (fastnade) när jag gjorde detta. Behöver kolla igenom detta innan vi fastställer denna lösning... Den återställer evetlistner  för "Markera som slutförd" / "Ångra" och "Radera" knappar
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
document.getElementById('applyFiltersButton').addEventListener('click', function() {
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


// Ladda uppgifter från localStorage när sidan laddas
loadTasksFromLocalStorage();
