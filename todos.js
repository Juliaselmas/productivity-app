// Hämta referenser till uppgiftens inmatningsfält och uppgiftslistan
let taskTitle = document.getElementById('taskTitle');
let taskDescription = document.getElementById('taskDescription');
let taskStatus = document.getElementById('taskStatus');
let taskDeadline = document.getElementById('taskDeadline');
let taskEstimate = document.getElementById('taskEstimate');
let taskCategory = document.getElementById('taskCategory');
let taskList = document.getElementById('taskList');

let tasks = [];

// Funktiion för att skapa ett nytt uppgiftselement
function createTaskElement(task, index) {
    // Skapa ett nytt listelement
    let li = document.createElement('li');

    // Lägg till uppgiftens titel, beskrivning, status, deadline, tidsestimat och kategori till listelementet
    li.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p>Status: <span class="status">${task.status ? 'Slutförd' : 'Ej slutförd'}</span></p>
        <p>Deadline: ${task.deadline}</p>
        <p>Uppskattad tid: ${task.estimate} timmar</p>
        <p>Kategori: ${task.category}</p>
        <button class="toggle">${task.status ? 'Ångra' : 'Markera som slutförd'}</button>
        <button class="edit">Redigera</button>
        <button class="delete">Radera</button>
    `;

    // Lägg till en eventListener till "Markera som slutförd" / "Ångra" knappen
    li.querySelector('.toggle').addEventListener('click', function() {
        task.status = !task.status;
        li.querySelector('.status').textContent = task.status ? 'Slutförd' : 'Ej slutförd';
        this.textContent = task.status ? 'Ångra' : 'Markera som slutförd';
        saveTasksToLocalStorage();
    });

    // Lägg till en eventListener till "Radera" knappen
    li.querySelector('.delete').addEventListener('click', function() {
        taskList.removeChild(li);
        tasks.splice(index, 1);
        saveTasksToLocalStorage();
    });

    // Returnera listelementet
    return li;
}
    // Spara uppgifterna till localstorage
    saveTasksToLocalStorage();
// Funktion för att lägga till en ny uppgift
function addTask() {

    
    /* kontrollerar att man som användare har fyllt i alla uppgifter. Just nu är det en "alert", men jag tycker att vi ska se om det finns en mer användarvänlig metod att meddela användaren om att hen inte fyllt i korrekt .
    Jag är medveten om att man kan skriva en bättre if sats, men har ej gjort det än */
    if (!taskTitle.value) {
        alert('Vänligen ange en uppgiftstitel');
        return;
    }
    if(!taskDescription.value){
        alert('Vänligen ange en uppgiftsbeskrivning');
        return;
    }
    if(!taskDeadline.value){
        alert('Vänligen ange en deadline för uppgiften');
        return;
    }
    if(!taskEstimate.value){
        alert('Vänligen ange en uppskattad tid för uppgiften');
        return;
    }
    if(!taskCategory.value){
        alert('Vänligen ange en kategori för uppgiften');
        return;
    }
    
    // Skapa ett nytt uppgifts-objekt med värdena från inmatningsfälten
    let task = {
        title: taskTitle.value,
        description: taskDescription.value,
        status: taskStatus.checked,
        deadline: taskDeadline.value,
        estimate: taskEstimate.value,
        category: taskCategory.value
    };

    // Lägg till den nya uppgiften i uppgiftslistan
    tasks.push(task);
    const taskElement = createTaskElement(task, tasks.length - 1);
    taskList.appendChild(taskElement);

    // Rensa inmatningsfälten
    taskTitle.value = '';
    taskDescription.value = '';
    taskStatus.checked = false;
    taskDeadline.value = '';
    taskEstimate.value = '';
    taskCategory.value = '';

}

// Funktion för att spara uppgifter till localStorage
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Funktion för att ladda uppgifter från localstorage
function loadTasksFromLocalStorage() {
    try {
        // Hämta uppgifterna från localstorage
        const loadedTasks = JSON.parse(localStorage.getItem('tasks'));
        // Om det finns några uppgifter, skapa ett nytt uppgiftselement för varje och lägg till det i uppgiftslistan
        if (loadedTasks) {
            tasks = loadedTasks;
            tasks.forEach((task, index) => {
                const taskElement = createTaskElement(task, index);
                taskList.appendChild(taskElement);
            });
        }
    } catch (error) {
        console.error('Failed to parse tasks from localStorage:', error);
        // Man  kan också visa ett felmeddelande till användaren här. 
    }
}

// Ladda uppgifterna från localStorage
loadTasksFromLocalStorage();






//Redigera tasks

//funktionen här
let openTaskEdit = () => {
    //välja nuvarande task
    let taskToEdit = this.parentNode; // this är knappen, parentNode är dess förälder
    
    //skapa nya inputs
    let newTitleInput = document.createElement("input[type:text]");
    let newDescriptionInput = document.createElement("input[type:text]");

    //välja de specifika raderna och lägga in nya input bredvid
    let taskTitleRow = taskToEdit.firstChild;
    taskTitleRow.append(newTitleInput);

    let taskDescriptionRow = taskToEdit.secondChild;
    taskTitleRow.append(newDescriptionInput);
    

    
}


//sätta eventlistener på alla redigera knappar
let editBtnsNodes= document.querySelectorAll(".edit");

editBtnsNodes.forEach(function(editBtn) {
    editBtn.addEventListener('click', openTaskEdit );

    console.log("eventlistener funkar!");
});
