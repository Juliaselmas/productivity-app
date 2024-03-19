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
påbygga completedknappen - tidsgräns på streak? nollställs efter 24h?

EN BUG: när en habit med högre streak än 0 raderas från DOM så startar inte streaken på 0 i nästa habit i DOM. funkar i localStorage. 
*/

let createHabitListItem = (title, priority, streak, id) => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let li = document.createElement("li");
    li.innerHTML = `
        <h3>${title}</h3>
        <p>Priority: ${priority}</p>
        <p>Streak: ${streak}</p>
        <button class="completedBtn">Done for the day!</button>
        <button class="editBtn">Edit Habit</button>
        <button class="deleteBtn">Delete Habit</button>
    `;

     // Markera den valda radioknappen för prioritet
     let priorityRadios = li.querySelectorAll('input[name="editPriority"]');
     priorityRadios.forEach(radio => {
         if (radio.value === priority) {
             radio.checked = true;
         }
     });

    let completedBtn = li.querySelector('.completedBtn');
    completedBtn.addEventListener('click', () => {
        streak++;
        habitStreakCounter++;
        // Uppdatera streak i DOM
        let streakElement = li.querySelector('p:nth-of-type(2)');
        streakElement.innerText = "Streak: " + streak;
    
        // Uppdatera streak i habits[]
        let habitIndex = habits.findIndex(habit => habit.id === id);
        if (habitIndex !== -1) {
            habits[habitIndex].streak = streak;
            localStorage.setItem("habits", JSON.stringify(habits));
    
            // Uppdatera streak i currentUserObject.habits[]
            let currentUser = JSON.parse(localStorage.getItem("currentUser"));
            if (currentUser) {
                let currentUserHabits = currentUser.habits || [];
                let currentUserHabitIndex = currentUserHabits.findIndex(habit => habit.id === id);
                if (currentUserHabitIndex !== -1) {
                    currentUserHabits[currentUserHabitIndex].streak = streak;
                    localStorage.setItem("currentUser", JSON.stringify(currentUser));
                    
                    // Uppdatera streak i users[]
                    let users = JSON.parse(localStorage.getItem("users")) || [];
                    let currentUserIndex = users.findIndex(user => user.username === currentUser.username);
                    if (currentUserIndex !== -1) {
                        let userHabits = users[currentUserIndex].habits || [];
                        let userHabitIndex = userHabits.findIndex(habit => habit.id === id);
                        if (userHabitIndex !== -1) {
                            users[currentUserIndex].habits[userHabitIndex].streak = streak;
                            localStorage.setItem("users", JSON.stringify(users));
                        }
                    }
                }
            }
        }
    });
    

    let editBtn = li.querySelector('.editBtn');
    editBtn.addEventListener('click', () => {
        let habitTextElement = li.querySelector('h3');
        let selectedPriorityElement = li.querySelector('p');
        let streakNumberElement = li.querySelector('p:nth-of-type(2)');
        //console.log(habitTextElement);

        let editedHabitInput = document.createElement("input");
        editedHabitInput.type = "text";
        editedHabitInput.value = habitTextElement.innerText;
        li.insertBefore(editedHabitInput, habitTextElement);


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

            //tar bort inputfältet för habit och saveChangesBtn
            editedHabitInput.remove();
            priorityContainer.remove();
            saveChangesBtn.remove();
            editedStreakInput.remove();
            editedStreakLabel.remove();
    
            //sparar den uppdaterade habit till localstorage
            //saveToLocalStorage(editedHabitText, editedPriorityValue, editedStreakCounter, id);

            // Spara den uppdaterade habiten till localStorage
        localStorage.setItem("habits", JSON.stringify(habits));
        
        // Uppdatera habiten i currentUser och users om det finns
        let currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser) {
            let currentUserHabits = currentUser.habits || [];
            let currentUserHabitIndex = currentUserHabits.findIndex(habit => habit.id === id);
            if (currentUserHabitIndex !== -1) {
                currentUserHabits[currentUserHabitIndex] = { title: editedHabitText, priority: editedPriorityValue, streak: editedStreakCounter, id: id };
                localStorage.setItem("currentUser", JSON.stringify(currentUser));
                
                let users = JSON.parse(localStorage.getItem("users")) || [];
                let currentUserIndex = users.findIndex(user => user.username === currentUser.username);
                if (currentUserIndex !== -1) {
                    let userHabits = users[currentUserIndex].habits || [];
                    let userHabitIndex = userHabits.findIndex(habit => habit.id === id);
                    if (userHabitIndex !== -1) {
                        users[currentUserIndex].habits[userHabitIndex] = { title: editedHabitText, priority: editedPriorityValue, streak: editedStreakCounter, id: id };
                        localStorage.setItem("users", JSON.stringify(users));
                    }
                }
            }
        }
    } else {
        console.error("Unable to save your changes.");
    }
    });
    });



    let deleteBtn = li.querySelector('.deleteBtn');
    deleteBtn.addEventListener('click', () => {
        
        // Hitta indexet för habiten i habits[]
        let habitIndex = habits.findIndex(habit => habit.id === id);
        if (habitIndex !== -1) {
            // Ta bort habiten från habits[]
            habits.splice(habitIndex, 1);
            // Uppdatera localStorage för habits
            localStorage.setItem("habits", JSON.stringify(habits));
        }


        
    // Uppdatera currentUserObject i localStorage
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
        // Hitta indexet för habiten i currentUserObject.habits[]
        let currentUserHabitIndex = currentUser.habits.findIndex(habit => habit.id === id);
        if (currentUserHabitIndex !== -1) {
            currentUser.habits.splice(currentUserHabitIndex, 1);
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
        }
    }

    if (currentUser) {
        // Hitta indexet för den aktuella användaren i users[]
        let currentUserIndex = users.findIndex(user => user.username === currentUser.username);
        if (currentUserIndex !== -1) {
            // Ta bort vanan från den aktuella användarens habits i users[]
            if (!users[currentUserIndex].habits) {
                users[currentUserIndex].habits = [];
            }
            let userHabitIndex = users[currentUserIndex].habits.findIndex(habit => habit.id === id);
            if (userHabitIndex !== -1) {
                users[currentUserIndex].habits.splice(userHabitIndex, 1);
                // Uppdatera localStorage för users
                localStorage.setItem("users", JSON.stringify(users));
            }
        }
    }

    // Ta bort vanan från DOM
    li.remove();
    });

 
    //lägger till listelementet i DOM
    habitList.appendChild(li); 

    //sparar den nya vanan för både currentUser och users i localStorage
    saveHabitToUser({ title, priority, streak, id });

    //sparar den nya vanan i habits[]
    habits.push({ title, priority, streak, id });
    localStorage.setItem("habits", JSON.stringify(habits));

    //uppdaterar currentUser och users i localStorage
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    //let users = JSON.parse(localStorage.getItem("users")) || [];

    if (currentUser) {
        // Uppdatera currentUserObject med den nya vanan
        if (!currentUser.habits) {
            currentUser.habits = [];
        }
        currentUser.habits.push({ title, priority, streak, id });
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }

    if (users.length > 0) {
        // Hitta indexet för den aktuella användaren i users[]
        let currentUserIndex = users.findIndex(user => user.username === currentUser.username);
        if (currentUserIndex !== -1) {
            // Uppdatera användarens habits med den nya vanan
            if (!users[currentUserIndex].habits) {
                users[currentUserIndex].habits = [];
            }
            users[currentUserIndex].habits.push({ title, priority, streak, id });
            localStorage.setItem("users", JSON.stringify(users));
        }
    }
};



let saveHabitToUser = (habit) => {
    let currentUserObject = JSON.parse(localStorage.getItem("currentUser")); // Deklarera currentUserObject baserat på localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];

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
        console.log(currentUserIndex);
        console.error("User not found in users array.");
    }
};

let saveToLocalStorage = (title, priority, streak, id) => {
    let existingHabits = JSON.parse(localStorage.getItem('habits')) || [];
    let newHabit = {
        title: title,
        priority: priority,
        streak: streak,
        id: id
    };

    existingHabits.push(newHabit);
    localStorage.setItem("habits", JSON.stringify(existingHabits));
};


addHabitBtn.addEventListener("click", () => {
    let title = habitInput.value.trim();
    if (title === "") {
        alert("Please enter a habit.");
        return;
    }

    let priority = document.querySelector("[name='priority']:checked").value; // Implementera logik för att få prioritet från användare
    let streak = 0; // Implementera logik för att sätta streak

    // Skapa en unik ID för den nya vanan
    let id = Date.now().toString();

    // Skapa en ny vana och lägg till den i listan samt spara den i localStorage
    createHabitListItem(title, priority, streak, id);

    // Återställ inputfältet
    habitInput.value = "";

});

/*
sortHabitsDropdown.addEventListener('change', () => {
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
*/

function sortHabits(sortType) {
    let currentUserStorage = localStorage.getItem("currentUser");
    let currentUserStorageObject = JSON.parse(currentUserStorage);

    switch (sortType) {
        case 'highestPriority':
            currentUserStorageObject.habits.sort((a, b) => {
                let priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
            break;
        case 'lowestPriority':
            currentUserStorageObject.habits.sort((a, b) => {
                let priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            });
            break;
        case 'highestStreak':
            currentUserStorageObject.habits.sort((a, b) => a.streak - b.streak);
            break;
        case 'lowestStreak':
            currentUserStorageObject.habits.sort((a, b) => b.streak - a.streak);
            break;
        default:
            console.log('Unable to sort habits');
            return;
    }

    // Uppdatera listan med de sorterade vanorna
    updateHabitList(currentUserStorageObject.habits);
}

//FUNGERAR EJ! SKRIVER ÖVER VÄRDEN FRÅN SKAPADE OBJEKT OCH GÖR DE IDENTISKA
function updateHabitList(sortedHabits) {
    // Rensa befintliga vanor från listan
    habitList.innerHTML = '';

    // Skapa nya listelement för varje habit i den sorterade listan
    sortedHabits.forEach(habit => {
        let li = document.createElement('li');
        li.innerHTML = `
            <h3>${habit.title}</h3>
            <p>Priority: ${habit.priority}</p>
            <p>Streak: ${habit.streak}</p>
            <button class="completedBtn">Done for the day!</button>
            <button class="editBtn">Edit Habit</button>
            <button class="deleteBtn">Delete Habit</button>
        `;
        // Lägg till li-elementet i habitList
        habitList.appendChild(li);
    });
}


let loadHabitsFromLocalStorage = () => {
    // Rensa befintliga vanor från currentUser
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
        currentUser.habits = [];
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }

    // Rensa befintliga vanor från users[]
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users.forEach(user => {
        user.habits = [];
    });
    localStorage.setItem("users", JSON.stringify(users));

    // Lägg till vanor från local storage
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