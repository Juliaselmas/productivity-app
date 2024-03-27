let habits = []
let habitList = document.getElementById("habitList");
let habitContainer = document.getElementById("habit-container");
let habitInput = document.getElementById("habitInput");
let addHabitBtn = document.getElementById("addHabitBtn");
let habitStreakCounter = 0;
let id = Date.now().toString(); //genererar ett unikt ID baserat på aktuell tid
let sortHabitsBtn = document.getElementById("showSortingBtnHabits");
let sortHabitsDropdown = document.getElementById("sortHabitsDropdown");


/*Att göra:
Sortering - få ordning på funktion updateHabitListItem rad 417
Filtrering
Funktionalitet för att kunna ladda redan sparade habits från localstorage i DOM!
påbygga completedknappen - tidsgräns på streak? nollställs efter 24h?

EN BUG: när en habit med högre streak än 0 raderas från DOM så startar inte streaken på 0 i nästa habit i DOM. funkar i localStorage. 
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

    //ökar streak och sparar i localStorage
    completedHabitBtn.addEventListener("click", () => {
        streak++;
        habitStreakCounter++;
        streakNumber.innerText = "Streak: " + streak;

     //uppdaterar streak i habits[]
    let habitIndex = habits.findIndex(habit => habit.id === id);
    if (habitIndex !== -1) {
        habits[habitIndex].streak = streak; // Uppdatera streak för habit i habits[]
    }

    //uppdaterar streak i currentUserObject.habits[]
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let currentUserHabits = currentUser.habits;
    let currentUserHabitIndex = currentUserHabits.findIndex(habit => habit.id === id);
    if (currentUserHabitIndex !== -1) {
        currentUserHabits[currentUserHabitIndex].streak = streak; // Uppdatera streak för habit i currentUserObject.habits[]
    }

    //uppdaterar streak i users[]
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
    
        //hittar habit baserat på ID
        let habitIndex = habits.findIndex(habit => habit.id === id);
        if (habitIndex !== -1) {
            //uppdaterar habit med nya värden
            habits[habitIndex].title = editedHabitText;
            habits[habitIndex].priority = editedPriorityValue;
            habits[habitIndex].streak = editedStreakCounter;
    
            //uppdaterar DOM med de nya värdena
            habitTextElement.innerText = editedHabitText;
            selectedPriorityElement.innerText = editedPriorityValue + " Priority";
            streakNumberElement.innerText = "Streak: " + editedStreakCounter;

              //ta bort inputfältet för habit och saveChangesBtn
        editedHabitInput.remove();
        priorityContainer.remove();
        saveChangesBtn.remove();
        editedStreakInput.remove();
        editedStreakLabel.remove();
    
            //sparar den uppdaterade habit till localstorage
            saveToLocalStorage(editedHabitText, editedPriorityValue, editedStreakCounter, id);
            //console.log("currentUserObject.habits after editing habit:", currentUserObject.habits);
            //console.log("habits after editing habit:", habits);
        } else {
            console.error("Habit not found in habits array.");
        }
    });
});

    //skapar ny deleteknapp
    let deleteHabitBtn = document.createElement("button");
    deleteHabitBtn.innerText = "Delete Habit";
    li.append(deleteHabitBtn);

    
    deleteHabitBtn.addEventListener("click", () => {
    //hitta indexet för habiten i habits[]
    let habitIndex = habits.findIndex(habit => habit.id === id);
    if (habitIndex !== -1) {
        //tar bort habiten från habits[]
        habits.splice(habitIndex, 1);
        //uppdaterar localStorage för habits
        localStorage.setItem("habits", JSON.stringify(habits));
    }

    //uppdaterar currentUserObject i localStorage
    let currentUserObject = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUserObject) {
        //hittar indexet för habiten i currentUserObject.habits[]
        let currentUserHabitIndex = currentUserObject.habits.findIndex(habit => habit.id === id);
        if (currentUserHabitIndex !== -1) {
            //tar bort habit från currentUserObject.habits[]
            currentUserObject.habits.splice(currentUserHabitIndex, 1);
            //uppdaterar localStorage för currentUserObject
            localStorage.setItem("currentUser", JSON.stringify(currentUserObject));
        }
    }

    //uppdaterar user-objektet i localStorage (om det behövs)
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let currentUserIndex = users.findIndex(user => user.username === currentUser.username);
    if (currentUserIndex !== -1) {
        //hittar indexet för habiten i users[].habits[]
        let userHabitIndex = users[currentUserIndex].habits.findIndex(habit => habit.id === id);
        if (userHabitIndex !== -1) {
            //tar bort habiten från users[].habits[]
            users[currentUserIndex].habits.splice(userHabitIndex, 1);
            //uppdaterar localStorage för users
            localStorage.setItem("users", JSON.stringify(users));
        }
    }

    //tar bort habit från DOM
    li.remove();
});

    //sparar det unika ID:t i ett attribut på habit-listpunkten
    li.setAttribute("data-habit-id", id);

    habitList.append(li);

    saveToLocalStorage();

    return li;

    
};


let saveHabitToUser = (habit) => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let currentUserObject = JSON.parse(localStorage.getItem("currentUser")); // Deklarera currentUserObject baserat på localStorage

    //hittar användaren i users[]
    let currentUserIndex = users.findIndex(user => user.username === currentUserObject.username);

    if (currentUserIndex !== -1) {
        //uppdaterar habits för den aktuella användaren
        if (!users[currentUserIndex].habits) {
            users[currentUserIndex].habits = [];
        }
        let existingHabitIndex = users[currentUserIndex].habits.findIndex(item => item.id === habit.id);
        if (existingHabitIndex !== -1) {
            //uppdaterar befintlig habit
            users[currentUserIndex].habits[existingHabitIndex] = habit;
        } else {
            //lägger till ny habit
            users[currentUserIndex].habits.push(habit);
        }

        //sparar den uppdaterade användaren i users[]
        localStorage.setItem("users", JSON.stringify(users));
    } else {
        console.error("User not found in users array.");
    }
};

let saveToLocalStorage = (title, priority, streak, id) => {
    let existingHabits = JSON.parse(localStorage.getItem('habits')) || [];
    let currentUser = localStorage.getItem("currentUser");
    let currentUserObject = JSON.parse(currentUser);

    //skapar en array (habits) om den inte redan finns
    currentUserObject.habits = currentUserObject.habits || [];

    //hittar befintlig vana med samma ID
    let existingHabit = currentUserObject.habits.find(habit => habit.id === id);

    //hittar befintlig habit med samma ID i habits[]
    let existingHabitIndex = habits.findIndex(habit => habit.id === id);
    
    if (existingHabit) {
        //uppdaterar den befintliga habiten
        existingHabit.title = title;
        existingHabit.priority = priority;
        existingHabit.streak = streak;
    } else {
        //skapar en ny habit om ingen matchande hittades i currentUserObject
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

    //sparar habit till users-arrayen
    saveHabitToUser({
        title: title,
        priority: priority,
        streak: streak,
        id: id
    });

    //filtrerar bort raderade uppgifter innan det sparar till localStorage
    localStorage.setItem("currentUser", JSON.stringify(currentUserObject));
    localStorage.setItem("habits", JSON.stringify(habits));
};


addHabitBtn.addEventListener("click", () => {
    let priorityBtn = document.querySelectorAll('input[name="priority"]:checked');
    //let prioritySelected = false;
    let priorityValue = "Medium"; //standardprioritet om ingen väljs
    let newId = Date.now().toString(); //genererar ett unikt ID baserat på aktuell tid

    if (priorityBtn.length > 0) {
        //prioritySelected = true;
        priorityValue = priorityBtn[0].value; //hämtar det första valda värdet
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

    //kontrollerar om den nya vanan redan finns i habits arrayen baserat på ID
    let existingHabitIndex = habits.findIndex(habit => habit.id === newId);
    if (existingHabitIndex === -1) {
        // Spara den nya vanan till local storage
        saveToLocalStorage(newHabitText, priorityValue, 0, newId);

        //console.log("currentUserObject.habits after adding new habit:", currentUserObject.habits);
        //console.log("habits after adding new habit:", habits);

        let newHabit = {
            title: newHabitText,
            priority: priorityValue,
            streak: 0,
            id: newId,
            deleted: false
        };

        //habits.push(newHabit);

        //skickar med id till createHabitListItem
        createHabitListItem(newHabitText, priorityValue, 0, newId); 
        habitInput.value = "";
    } else {
        console.log("Habit with ID " + newId + " already exists in habits array.");
    }
});


sortHabitsBtn.addEventListener("click", () => {
    let selectedSortOption = sortHabitsDropdown.value;

    let sortedHabits;
    switch(selectedSortOption) {
        case "priorityAscending":
            sortedHabits = habits.slice().sort(sortByPriorityAscending);
            break;
        case "priorityDescending":
            sortedHabits = habits.slice().sort(sortByPriorityDescending);
            break;
        case "streakAscending":
            sortedHabits = habits.slice().sort(sortByStreakAscending);
            break;
        case "streakDescending":
            sortedHabits = habits.slice().sort(sortByStreakDescending);
            break;
        default:
            // Om inget valt alternativ matchar, använd standard-sorteringen (om det finns någon)
            sortedHabits = habits;
            break;
    }

    // Uppdatera DOM med den sorterade listan av vanor
    updateHabitList(sortedHabits);
});

/* FUNGERAR EJ! SKRIVER ÖVER VÄRDEN FRÅN SKAPADE OBJEKT OCH GÖR DE IDENTISKA
function updateHabitList(sortedHabits) {
    // Rensa befintliga vanor från listan
    habitList.innerHTML = '';

    // Skapa nya listelement för varje habit i den sorterade listan
    sortedHabits.forEach(habit => {
        let habitItem = createHabitListItem(habit.title, habit.priority, habit.streak, habit.id);
        habitList.appendChild(habitItem);
    });
}
*/
let loadHabitsFromLocalStorage = () => {
    let habits = JSON.parse(localStorage.getItem('habits')) || [];
    habits.forEach(habit => {
        createHabitListItem(habit.title, habit.priority, habit.streak, habit.id);
    });
};

// Kalla på funktionen när sidan laddas eller användaren loggar in
window.addEventListener('load', loadHabitsFromLocalStorage);


//sorterar från high priority till low priority
function sortByPriorityAscending(a, b) {
    let priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
}

//sorterar från low priority till high priority
function sortByPriorityDescending(a, b) {
    let priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
}

//sorterar från högsta till lägsta streak
function sortByStreakAscending(a, b) {
    return a.streak - b.streak;
}

//sorterar från lägsta till högsta streak
function sortByStreakDescending(a, b) {
    return b.streak - a.streak;
}



//funktion för att filtrera habits baserat på prioritet
function filterHabitsByPriority(priorityFilters) {
    let habitItems = document.querySelectorAll('#habitList li');
    habitItems.forEach(item => {
        let priority = item.querySelector('p:nth-of-type(2)').innerText.split(': ')[1];
        if (priorityFilters.length === 0 || priorityFilters.includes(priority)) {
            item.style.display = 'block'; // Visar habit om den matchar filtret eller om inga filter är valda
        } else {
            item.style.display = 'none'; // Döljer habit om den inte matchar filtret
        }
    });
};

// Funktion för att visa alla habits
function showAllHabits() {
    let habitItems = document.querySelectorAll('#habitList li');
    habitItems.forEach(item => {
        item.style.display = 'block'; // Visa alla habit-items
    });
};

// Funktion för att hantera klick på applyFiltersButton
function applyFilters() {
    let priorityFilters = []; // Tom array för att lagra valda prioriteringar
    if (document.getElementById('low').checked) {
        priorityFilters.push('Low');
    }
    if (document.getElementById('medium').checked) {
        priorityFilters.push('Medium');
    }
    if (document.getElementById('high').checked) {
        priorityFilters.push('High');
    }

    if (priorityFilters.length === 0) {
        showAllHabits(); // Visa alla habits om inga filter är valda
    } else {
        filterHabitsByPriority(priorityFilters); // Filtrera habits baserat på valda prioriteringar
    }
};

//document.getElementById("applyFiltersButton").addEventListener("click", filterHabitsByPriority);
document.getElementById("applyFiltersButton").addEventListener("click", applyFilters);
/*
applyFiltersBtn.addEventListener('click', function () {
    filterHabitsByPriority();
});
*/
console.log(filterHabitsByPriority());
