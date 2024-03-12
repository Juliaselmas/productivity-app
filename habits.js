let habits = []
let habitList = document.getElementById("habitList");
let habitContainer = document.getElementById("habit-container");
let habitInput = document.getElementById("habitInput");
let addHabitBtn = document.getElementById("addHabitBtn");
let habitStreakCounter = 0;
let id = Date.now().toString(); // Generera ett unikt ID baserat på aktuell tid


/*Att göra:
varför visas id som placeholder till streak i redigeringsläget??
påbygga completedknappen - tidsgräns på streak? nollställs efter 24h?
curentUser och user - liten bugg med unikt id som gör att ett nytt objekt skapas när en habit redigeras. annars funkar det!
ska objekten skickas till habits[] också? inte bara currentUser??
*/

let createHabitListItem = (title, priority, streak, id) => {
    
    let newId = Date.now().toString(); // Generera ett unikt ID baserat på aktuell tid


    let priorityBtn = document.querySelector("input[name='priority']:checked").value;
    if (priorityBtn) {
        priorityValue = priorityBtn.value;
    }

    let li = document.createElement("li");
    li.innerHTML = ` <h3>${title}</h3> `;

    let selectedPriority = document.createElement("p");
    selectedPriority.innerText = priorityBtn + " Priority";
    li.append(selectedPriority);

    let streakNumber = document.createElement("p");
    streakNumber.innerText = "Streak: " + habitStreakCounter;
    li.append(streakNumber);


    //skapar ny completedknapp
    let completedHabitBtn = document.createElement("button");
    completedHabitBtn.innerText = "Done for the day!";
    li.append(completedHabitBtn);

    // Eventlyssnare för att öka streak och spara i localStorage vid klick på completedHabitBtn
    completedHabitBtn.addEventListener("click", () => {
        streak++;
        habitStreakCounter++;
        streakNumber.innerText = "Streak: " + streak;

     // Uppdatera streak i habits[]
    let habitIndex = habits.findIndex(habit => habit.id === id);
    if (habitIndex !== -1) {
        habits[habitIndex].streak = streak; // Uppdatera streak för habit i habits[]
    }

    // Uppdatera streak i currentUserObject.habits[]
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let currentUserHabits = currentUser.habits;
    let currentUserHabitIndex = currentUserHabits.findIndex(habit => habit.id === id);
    if (currentUserHabitIndex !== -1) {
        currentUserHabits[currentUserHabitIndex].streak = streak; // Uppdatera streak för habit i currentUserObject.habits[]
    }

    // Uppdatera streak i users[]
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let currentUserIndex = users.findIndex(user => user.username === currentUser.username);
    if (currentUserIndex !== -1) {
        let userHabits = users[currentUserIndex].habits;
        let userHabitIndex = userHabits.findIndex(habit => habit.id === id);
        if (userHabitIndex !== -1) {
            userHabits[userHabitIndex].streak = streak; // Uppdatera streak för habit i users[].habits[]
            localStorage.setItem("users", JSON.stringify(users)); // Spara ändringarna till localStorage
        }
    }

    // Spara ändringarna till localStorage
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    saveToLocalStorage(title, priority, streak, id);
});
        //saveToLocalStorage();

        //lägga till att knappen ändrar text eller hela habit ändrar utseende?
    


    //skapar ny editknapp
    let editHabitBtn = document.createElement("button");
    editHabitBtn.innerText = "Edit Habit";
    li.append(editHabitBtn);

    //funktion för att redigera habit
    editHabitBtn.addEventListener("click", () => {
        let habitTextElement = li.querySelector('h3');
        let selectedPriorityElement = li.querySelector('p');
        let streakNumberElement = li.querySelector('p:nth-of-type(2)');
        //console.log(habitTextElement);

        let editedHabitInput = document.createElement("input");
        editedHabitInput.type = "text";
        editedHabitInput.value = habitTextElement.innerText;
        li.insertBefore(editedHabitInput, habitTextElement);
        //habitTextElement.remove();


    //skapar radio-btns för att redigera prioritet
    let highPriorityRadio = document.createElement("input");
    highPriorityRadio.type = "radio";
    highPriorityRadio.name = "editPriority";
    highPriorityRadio.value = "High";
    let highPriorityLabel = document.createElement("label");
    highPriorityLabel.for = "editHighPriority";
    highPriorityLabel.innerText = "High";
    highPriorityLabel.appendChild(highPriorityRadio);
    let mediumPriorityRadio = document.createElement("input");
    mediumPriorityRadio.type = "radio";
    mediumPriorityRadio.name = "editPriority";
    mediumPriorityRadio.value = "Medium";
    let mediumPriorityLabel = document.createElement("label");
    mediumPriorityLabel.for = "editMediumPriority";
    mediumPriorityLabel.innerText = "Medium";
    mediumPriorityLabel.appendChild(mediumPriorityRadio);
    let lowPriorityRadio = document.createElement("input");
    lowPriorityRadio.type = "radio";
    lowPriorityRadio.name = "editPriority";
    lowPriorityRadio.value = "Low";
    let lowPriorityLabel = document.createElement("label");
    lowPriorityLabel.for = "editLowPriority";
    lowPriorityLabel.innerText = "Low";
    lowPriorityLabel.appendChild(lowPriorityRadio);
    let priorityContainer = document.createElement("div");
    priorityContainer.appendChild(highPriorityLabel);
    priorityContainer.appendChild(mediumPriorityLabel);
    priorityContainer.appendChild(lowPriorityLabel);
    li.insertBefore(priorityContainer, editedHabitInput.nextSibling);
    //selectedPriorityElement.remove();

    //skapar input för att kunna ändra habit streak
    let editedStreakLabel = document.createElement("label");
    editedStreakLabel.innerText = "Change Streak:";
    li.insertBefore(editedStreakLabel, priorityContainer.nextSibling);
    let editedStreakInput = document.createElement("input");
    editedStreakInput.type = "number";
    editedStreakInput.value = streak;
    editedStreakInput.placeholder = "";
    li.insertBefore(editedStreakInput, editedStreakLabel.nextSibling);

    let saveChangesBtn = document.createElement("button");
    saveChangesBtn.innerText = "Save Changes";
    li.append(saveChangesBtn);

    saveChangesBtn.addEventListener("click", () => {
        let editedHabitText = editedHabitInput.value;
        let editedPriorityBtn = document.querySelector('input[name="editPriority"]:checked');
        let editedStreakCounter = parseInt(editedStreakInput.value);
    
        if (!editedPriorityBtn) {
            alert("Please select a priority for the edited habit.");
            return;
        }
        let editedPriorityValue = editedPriorityBtn.value;
    
        // Hitta habiten baserat på ID
        let habitIndex = habits.findIndex(habit => habit.id === id);
        if (habitIndex !== -1) {
            // Uppdatera habiten med nya värden
            habits[habitIndex].title = editedHabitText;
            habits[habitIndex].priority = editedPriorityValue;
            habits[habitIndex].streak = editedStreakCounter;
    
            // Uppdatera DOM med de nya värdena
            habitTextElement.innerText = editedHabitText;
            selectedPriorityElement.innerText = editedPriorityValue + " Priority";
            streakNumberElement.innerText = "Streak: " + editedStreakCounter;

              // Ta bort inputfältet för habit och saveChangesBtn
        editedHabitInput.remove();
        priorityContainer.remove();
        saveChangesBtn.remove();
        editedStreakInput.remove();
        editedStreakLabel.remove();
    
            // Spara den uppdaterade habiten till local storage
            saveToLocalStorage(editedHabitText, editedPriorityValue, editedStreakCounter, id);
            console.log("currentUserObject.habits after editing habit:", currentUserObject.habits);
            console.log("habits after editing habit:", habits);
        } else {
            console.error("Habit not found in habits array.");
        }
    });
});

    


    //skapar ny deleteknapp
    let deleteHabitBtn = document.createElement("button");
    deleteHabitBtn.innerText = "Delete Habit";
    li.append(deleteHabitBtn);

    // Eventlyssnare för att ta bort habit vid klick på deleteHabitBtn
    deleteHabitBtn.addEventListener("click", () => {
        li.remove();
        deleteHabitFromLocalStorage(id);
    });

    // Spara det unika ID:t i ett attribut på habit-listpunkten
    li.setAttribute("data-habit-id", id);

    habitList.append(li);

    saveToLocalStorage();

    return li;

    
};


let saveHabitToUser = (habit) => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let currentUserObject = JSON.parse(localStorage.getItem("currentUser")); // Deklarera currentUserObject baserat på localStorage

    // Hitta användaren i users-arrayen
    let currentUserIndex = users.findIndex(user => user.username === currentUserObject.username);

    if (currentUserIndex !== -1) {
        // Uppdatera vanor (habits) för den aktuella användaren
        if (!users[currentUserIndex].habits) {
            users[currentUserIndex].habits = [];
        }
        let existingHabitIndex = users[currentUserIndex].habits.findIndex(item => item.id === habit.id);
        if (existingHabitIndex !== -1) {
            // Uppdatera befintlig habit
            users[currentUserIndex].habits[existingHabitIndex] = habit;
        } else {
            // Lägg till ny habit
            users[currentUserIndex].habits.push(habit);
        }

        // Spara den uppdaterade användaren i users-arrayen
        localStorage.setItem("users", JSON.stringify(users));
    } else {
        console.error("User not found in users array.");
    }
};

let saveToLocalStorage = (title, priority, streak, id) => {
    let existingHabits = JSON.parse(localStorage.getItem('habits')) || [];
    let currentUser = localStorage.getItem("currentUser");
    let currentUserObject = JSON.parse(currentUser);

    // Skapa en array för vanor (habits) om den inte redan finns
    currentUserObject.habits = currentUserObject.habits || [];

    // Hitta befintlig vana med samma ID
    let existingHabit = currentUserObject.habits.find(habit => habit.id === id);

    /// Hitta befintlig habit med samma ID i habits[]
    let existingHabitIndex = habits.findIndex(habit => habit.id === id);
    
    if (existingHabit) {
        // Uppdatera den befintliga habiten
        existingHabit.title = title;
        existingHabit.priority = priority;
        existingHabit.streak = streak;
    } else {
        // Skapa en ny habit om ingen matchande hittades i currentUserObject
        let latestHabit = {
            title: title, 
            priority: priority,
            streak: streak,
            id: id,
            deleted: false
        };
        
        currentUserObject.habits.push(latestHabit);
        habits.push(latestHabit);
    }

    // Spara habit till users-arrayen
    saveHabitToUser({
        title: title,
        priority: priority,
        streak: streak,
        id: id
    });

    // Filtrera bort raderade uppgifter innan du sparar till localStorage
    localStorage.setItem("currentUser", JSON.stringify(currentUserObject));
    localStorage.setItem("habits", JSON.stringify(habits));
};


addHabitBtn.addEventListener("click", () => {
    let priorityBtn = document.querySelectorAll('input[name="priority"]:checked');
    //let prioritySelected = false;
    let priorityValue = "Medium"; // Standardprioritet om ingen väljs
    let newId = Date.now().toString(); // Generera ett unikt ID baserat på aktuell tid

    if (priorityBtn.length > 0) {
        //prioritySelected = true;
        priorityValue = priorityBtn[0].value; // Hämta det första valda värdet
    }
    /*
    if (!prioritySelected) {
        alert("Please select a priority for your new habit. Defaulting to Medium.");
    }
    */
    let newHabitText = habitInput.value.trim();

    if (newHabitText === "") {
        alert("Please enter a habit.");
        return;
    }

    // Kontrollera om den nya vanan redan finns i habits arrayen baserat på ID
    let existingHabitIndex = habits.findIndex(habit => habit.id === newId);
    if (existingHabitIndex === -1) {
        // Spara den nya vanan till local storage
        saveToLocalStorage(newHabitText, priorityValue, 0, newId);

        console.log("currentUserObject.habits after adding new habit:", currentUserObject.habits);
        console.log("habits after adding new habit:", habits);

        let newHabit = {
            title: newHabitText,
            priority: priorityValue,
            streak: 0,
            id: newId,
            deleted: false
        };

        //habits.push(newHabit);
        createHabitListItem(newHabitText, priorityValue, 0, newId); // Skicka med id till createHabitListItem
        habitInput.value = "";
    } else {
        console.log("Habit with ID " + newId + " already exists in habits array.");
    }
});

// Funktion för att läsa in sparade habits från localStorage och skapa listelement för varje habit
let loadHabitsFromLocalStorage = () => {
    let habits = JSON.parse(localStorage.getItem('habits')) || [];
    habits.forEach(habit => {
        createHabitListItem(habit.title, priority, habit.streak, habit.id);
    });
};

// Kalla på funktionen när sidan laddas eller användaren loggar in
window.addEventListener('load', loadHabitsFromLocalStorage);