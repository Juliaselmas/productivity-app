 // Hämta referenser till inmatningsfältet och uppgiftslistan
 const taskInput = document.getElementById('taskInput');
 const taskList = document.getElementById('taskList');

 // Funktion för att skapa ett nytt uppgiftselement
 function createTaskElement(taskText) {
     // Skapa ett nytt listelement
     const li = document.createElement('li');

     // Skapa en span för uppgiftstexten och lägg till den i listelementet
     const taskSpan = document.createElement('span');
     taskSpan.textContent = taskText;
     li.appendChild(taskSpan);

     // Skapa en edit-knapp, lägg till en eventListener, och lägg till den i listelementet
     const editBtn = document.createElement('button');
     editBtn.textContent = 'Edit';
     editBtn.addEventListener('click', function () {
         // Skapar en promt som gör det möjligt för användaren att redigera texten 
         const newTaskText = prompt('Enter new task text', taskText);
         // Om användaren angav en sträng, uppdatera uppgiftstexten och spara uppgifterna. Om användaren inte har skrivit något men ändå trycker på knappen kommer inte en tom sträng att skapas. 
         if (newTaskText !== null && newTaskText.trim() !== '') {
             taskSpan.textContent = newTaskText.trim();
             saveTasksToLocalStorage();
         }
     });
     li.appendChild(editBtn);

     // Skapa en radera-knapp, lägg till en klickhändelselyssnare, och lägg till den i listelementet
     const deleteBtn = document.createElement('button');
     deleteBtn.textContent = 'Delete';
     deleteBtn.addEventListener('click', function () {
         // Ta bort listelementet från uppgiftslistan och spara uppgifterna
         taskList.removeChild(li);
         saveTasksToLocalStorage();
     });
     li.appendChild(deleteBtn);

     // Lägg till en klickhändelselyssnare till uppgiftstexten för att växla uppgiftens slutförandestatus
     taskSpan.addEventListener('click', toggleTaskCompletion);

     // Returnera det nya listelementet
     return li;
 }

 // Funktion för att lägga till en ny uppgift
 function addTask() {
     // Hämta uppgiftstexten från inmatningsfältet
     const taskText = taskInput.value.trim();
     // Om uppgiftstexten inte är tom, skapa ett nytt uppgiftselement och lägg till det i uppgiftslistan
     if (taskText !== '') {
         const taskElement = createTaskElement(taskText);
         taskList.appendChild(taskElement);
         // Rensa inmatningsfältet och spara uppgifterna
         taskInput.value = '';
         saveTasksToLocalStorage();
     }
 }

 // Funktion för att växla uppgiftens slutförandestatus
 function toggleTaskCompletion(event) {
     // Växla 'completed'-klassen på uppgiftstexten
     const task = event.target;
     task.classList.toggle('completed');
 }

 // Funktion för att spara uppgifterna till localStorage
 function saveTasksToLocalStorage() {
     // Hämta uppgiftstexten från alla listelement och spara den till localStorage
     const tasks = Array.from(taskList.getElementsByTagName('li'), li => li.firstChild.textContent);
     localStorage.setItem('tasks', JSON.stringify(tasks));
 }

 // Funktion för att ladda uppgifterna från localStorage
 function loadTasksFromLocalStorage() {
     // Hämta uppgifterna från localStorage
     const tasks = JSON.parse(localStorage.getItem('tasks'));
     // Om det finns några uppgifter, skapa ett nytt uppgiftselement för varje och lägg till det i uppgiftslistan
     if (tasks) {
         tasks.forEach(taskText => {
             const taskElement = createTaskElement(taskText);
             taskList.appendChild(taskElement);
         });
     }
 }

 // Ladda uppgifterna från localStorage när skriptet körs
 loadTasksFromLocalStorage();