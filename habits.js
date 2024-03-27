let habits = []
let habitList = document.getElementById("habitList");
let habitContainer = document.getElementById("habit-container");
let habitInput = document.getElementById("habitInput");
let addHabitBtn = document.getElementById("addHabitBtn");
let habitStreakCounter = 0;
let id = Date.now().toString(); //genererar ett unikt ID baserat på aktuell tid
let sortHabitsBtn = document.getElementById("showSortingBtnHabits");
let sortHabitsDropdown = document.getElementById("sortHabitsDropdown");
let filterHabitsBtn = document.getElementById("showFiltersBtnHabits");
let applyFiltersBtn = document.getElementById("applyHabitFiltersButton");


/*NOTES:

FILTRERING:
-Inget händer när man klickar på applyFiltersBtn. ID stämmer, men nås inte radioknapparna kanske? 

ANNAT:
-påbygga completedknappen - tidsgräns på streak? nollställs efter 24h?
 
*/

let createHabitListItem = (title, priority, streak, id) => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let li = document.createElement("li");
    li.innerHTML = `
        <h3>${title}</h3>
        <p>Priority: ${priority}</p>
        <p>Streak: ${streak}</p>
        <button class="completedBtn">Done for the day!</button>
        <button id="editBtn" class="edit"><i class="fa-solid fa-pen-to-square"></i></button>
        <button id="deleteBtn" class="delete"><i class="far fa-trash-can"></i></button>
        
    `;

     //markerar den valda radioknappen för prioritet
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
        //uppdaterar streak i DOM
        let streakElement = li.querySelector('p:nth-of-type(2)');
        streakElement.innerText = "Streak: " + streak;
    
        //uppdaterar streak i habits[]
        let habitIndex = habits.findIndex(habit => habit.id === id);
        if (habitIndex !== -1) {
            habits[habitIndex].streak = streak;
            localStorage.setItem("habits", JSON.stringify(habits));
    
            //uppdaterar streak i currentUserObject.habits[]
            let currentUser = JSON.parse(localStorage.getItem("currentUser"));
            if (currentUser) {
                let currentUserHabits = currentUser.habits || [];
                let currentUserHabitIndex = currentUserHabits.findIndex(habit => habit.id === id);
                if (currentUserHabitIndex !== -1) {
                    currentUserHabits[currentUserHabitIndex].streak = streak;
                    localStorage.setItem("currentUser", JSON.stringify(currentUser));
                    
                    //uppdaterar streak i users[]
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
    

    let editBtn = li.querySelector('#editBtn');
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
    saveChangesBtn.setAttribute("id", "saveChangesBtn");
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
            selectedPriorityElement.innerText = "Priority: " + editedPriorityValue;
            streakNumberElement.innerText = "Streak: " + editedStreakCounter;

            //tar bort inputfältet för habit och saveChangesBtn
            editedHabitInput.remove();
            priorityContainer.remove();
            saveChangesBtn.remove();
            editedStreakInput.remove();
            editedStreakLabel.remove();

            //sparar uppdaterad habit till localStorage
            localStorage.setItem("habits", JSON.stringify(habits));
        
        //uppdaterar habit i currentUser och users om det finns
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



    let deleteBtn = li.querySelector('#deleteBtn');
    deleteBtn.addEventListener('click', () => {
        
        //hittar indexet för habit i habits[]
        let habitIndex = habits.findIndex(habit => habit.id === id);
        if (habitIndex !== -1) {
            //tar bort habit från habits[]
            habits.splice(habitIndex, 1);
            //uppdaterar localStorage för habits
            localStorage.setItem("habits", JSON.stringify(habits));
        }


        
    //uppdaterar currentUserObject i localStorage
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
        //hittar indexet för habit i currentUserObject.habits[]
        let currentUserHabitIndex = currentUser.habits.findIndex(habit => habit.id === id);
        if (currentUserHabitIndex !== -1) {
            currentUser.habits.splice(currentUserHabitIndex, 1);
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
        }
    }

    if (currentUser) {
        //hittar indexet för den aktuella användaren i users[]
        let currentUserIndex = users.findIndex(user => user.username === currentUser.username);
        if (currentUserIndex !== -1) {
            //tar bort habit från den aktuella användarens habits i users[]
            if (!users[currentUserIndex].habits) {
                users[currentUserIndex].habits = [];
            }
            let userHabitIndex = users[currentUserIndex].habits.findIndex(habit => habit.id === id);
            if (userHabitIndex !== -1) {
                users[currentUserIndex].habits.splice(userHabitIndex, 1);
                //uppdaterar localStorage för users
                localStorage.setItem("users", JSON.stringify(users));
            }
        }
    }

    //tar bort habit från DOM
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
        //uppdaterar currentUserObject med den nya vanan
        if (!currentUser.habits) {
            currentUser.habits = [];
        }
        currentUser.habits.push({ title, priority, streak, id });
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }

    if (users.length > 0) {
        //hittar indexet för den aktuella användaren i users[]
        let currentUserIndex = users.findIndex(user => user.username === currentUser.username);
        if (currentUserIndex !== -1) {
            //uppdaterar användarens habits med den nya vanan
            if (!users[currentUserIndex].habits) {
                users[currentUserIndex].habits = [];
            }
            users[currentUserIndex].habits.push({ title, priority, streak, id });
            localStorage.setItem("users", JSON.stringify(users));
        }
    }
};


let saveHabitToUser = (habit) => {
    let currentUserObject = JSON.parse(localStorage.getItem("currentUser")); //deklarerar currentUserObject baserat på localStorage
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

    let priority = document.querySelector("[name='priority']:checked").value; //implementerar logik för att få prioritet från användare
    let streak = 0; //implementerar logik för att sätta streak

    //skapar en unik ID för den nya vanan
    let id = Date.now().toString();

    //skapar en ny vana och lägg till den i listan samt spara den i localStorage
    createHabitListItem(title, priority, streak, id);

    //återställer inputfältet
    habitInput.value = "";

});

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

    //uppdaterar listan med de sorterade vanorna
    updateHabitList(currentUserStorageObject.habits);
}

habitList.addEventListener('click', function(event) {
    let target = event.target;
    if (target.classList.contains('completedBtn')) {
        //hanterar klick på completedBtn
        let li = target.closest('li');
        let titleElement = li.querySelector('h3');
        let streakElement = li.querySelector('p:nth-of-type(2)');
        let id = li.dataset.id;

        //uppdaterar streak i DOM
        let currentStreak = parseInt(streakElement.innerText.split(':')[1].trim());
        streakElement.innerText = "Streak: " + (currentStreak );

        //uppdaterar streak i localStorage
        let habitIndex = habits.findIndex(habit => habit.id === id);
        if (habitIndex !== -1) {
            habits[habitIndex].streak = currentStreak + 1;
            localStorage.setItem("habits", JSON.stringify(habits));
        }
    } else if (target.classList.contains('editBtn')) {
        //hanterar klick på editBtn
        //implementerar redigering av vana här
    } else if (target.classList.contains('deleteBtn')) {
        //hanterar klick på deleteBtn
        let li = target.closest('li');
        let id = li.dataset.id;

        //tar bort habit från DOM
        li.remove();

        //tar bort habit från habits[]
        let habitIndex = habits.findIndex(habit => habit.id === id);
        if (habitIndex !== -1) {
            habits.splice(habitIndex, 1);
            localStorage.setItem("habits", JSON.stringify(habits));
        }

        //uppdaterar currentUser och users i localStorage
        let currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser) {
            let currentUserHabits = currentUser.habits || [];
            let currentUserHabitIndex = currentUserHabits.findIndex(habit => habit.id === id);
            if (currentUserHabitIndex !== -1) {
                currentUserHabits.splice(currentUserHabitIndex, 1);
                localStorage.setItem("currentUser", JSON.stringify(currentUser));
            }
        }
        let users = JSON.parse(localStorage.getItem("users")) || [];
        let currentUserIndex = users.findIndex(user => user.username === currentUser.username);
        if (currentUserIndex !== -1) {
            if (!users[currentUserIndex].habits) {
                users[currentUserIndex].habits = [];
            }
            let userHabitIndex = users[currentUserIndex].habits.findIndex(habit => habit.id === id);
            if (userHabitIndex !== -1) {
                users[currentUserIndex].habits.splice(userHabitIndex, 1);
                localStorage.setItem("users", JSON.stringify(users));
            }
        }
    }
});


function updateHabitList(sortedHabits) {
    //rensar befintliga habits från listan
    habitList.innerHTML = '';

    //skapar nya listelement för varje habit i den sorterade listan
    sortedHabits.forEach(habit => {
        let {streak,title,priority,id} = habit
        let li = document.createElement('li');
        li.innerHTML = `
            <h3>${title}</h3>
            <p>Priority: ${priority}</p>
            <p>Streak: ${streak}</p>
            <button class="completedBtn">Done for the day!</button>
        <button id="editBtn" class="edit"><i class="fa-solid fa-pen-to-square"></i></button>
        <button id="deleteBtn" class="delete"><i class="far fa-trash-can"></i></button>
        `;

        let completedBtn = li.querySelector('.completedBtn');
    completedBtn.addEventListener('click', () => {
        streak++;
        habitStreakCounter++;
        //uppdaterar streak i DOM
        let streakElement = li.querySelector('p:nth-of-type(2)');
        streakElement.innerText = "Streak: " + streak;
    
        //uppdaterar streak i habits[]
        let habitIndex = habits.findIndex(habit => habit.id === id);
        if (habitIndex !== -1) {
            habits[habitIndex].streak = streak;
            localStorage.setItem("habits", JSON.stringify(habits));
    
            //uppdaterar streak i currentUserObject.habits[]
            let currentUser = JSON.parse(localStorage.getItem("currentUser"));
            if (currentUser) {
                let currentUserHabits = currentUser.habits || [];
                let currentUserHabitIndex = currentUserHabits.findIndex(habit => habit.id === id);
                if (currentUserHabitIndex !== -1) {
                    currentUserHabits[currentUserHabitIndex].streak = streak;
                    localStorage.setItem("currentUser", JSON.stringify(currentUser));
                    
                    //uppdaterar streak i users[]
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

    let editBtn = li.querySelector('#editBtn');
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
    saveChangesBtn.setAttribute("id", "saveChangesBtn");
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
            selectedPriorityElement.innerText = "Priority: " + editedPriorityValue;
            streakNumberElement.innerText = "Streak: " + editedStreakCounter;

            //tar bort inputfältet för habit och saveChangesBtn
            editedHabitInput.remove();
            priorityContainer.remove();
            saveChangesBtn.remove();
            editedStreakInput.remove();
            editedStreakLabel.remove();
    

            //sparar uppdaterad habit till localStorage
            localStorage.setItem("habits", JSON.stringify(habits));
        
        //uppdaterar habit i currentUser och users om det finns
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

    let deleteBtn = li.querySelector('#deleteBtn');
    deleteBtn.addEventListener('click', () => {
        
        //hittar indexet för habit i habits[]
        let habitIndex = habits.findIndex(habit => habit.id === id);
        if (habitIndex !== -1) {
            //tar bort habit från habits[]
            habits.splice(habitIndex, 1);
            //uppdaterar localStorage för habits
            localStorage.setItem("habits", JSON.stringify(habits));
        }


        
    //uppdaterar currentUserObject i localStorage
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
        //hittar indexet för habit i currentUserObject.habits[]
        let currentUserHabitIndex = currentUser.habits.findIndex(habit => habit.id === id);
        if (currentUserHabitIndex !== -1) {
            currentUser.habits.splice(currentUserHabitIndex, 1);
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
        }
    }

    if (currentUser) {
        //hittar indexet för den aktuella användaren i users[]
        let currentUserIndex = users.findIndex(user => user.username === currentUser.username);
        if (currentUserIndex !== -1) {
            //tar bort habit från den aktuella användarens habits i users[]
            if (!users[currentUserIndex].habits) {
                users[currentUserIndex].habits = [];
            }
            let userHabitIndex = users[currentUserIndex].habits.findIndex(habit => habit.id === id);
            if (userHabitIndex !== -1) {
                users[currentUserIndex].habits.splice(userHabitIndex, 1);
                //uppdaterar localStorage för users
                localStorage.setItem("users", JSON.stringify(users));
            }
        }
    }

    //tar bort habit från DOM
    li.remove();
    });

    //lägger till li-elementet i habitList
    habitList.appendChild(li);   

    });

    
}


let loadHabitsFromLocalStorage = () => {
    //rensar befintliga habits från currentUser
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
        currentUser.habits = [];
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }

    //rensar befintliga habits från users[]
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users.forEach(user => {
        user.habits = [];
    });
    localStorage.setItem("users", JSON.stringify(users));

    //lägger till habits från localstorage
    let habits = JSON.parse(localStorage.getItem('habits')) || [];
    habits.forEach(habit => {
        createHabitListItem(habit.title, habit.priority, habit.streak, habit.id);
    });
};

//kallar på funktionen när sidan laddas eller användaren loggar in
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

applyFiltersBtn.addEventListener("click", () => {
    let lowPriorityChecked = document.getElementById("low").checked;
    let mediumPriorityChecked = document.getElementById("medium").checked;
    let highPriorityChecked = document.getElementById("high").checked;

    let habits = document.getElementById("habitList").getElementsByTagName("li");

    for (let i = 0; i < habits.length; i++) {
        let habit = habits[i];
        let priority = habit.querySelector("p").innerText.split(": ")[1]; //hämtar prioritet från habit

        //kontrollerar om habit ska visas baserat på checkboxvalen
        let shouldBeDisplayed = 
            (lowPriorityChecked && priority === "Low") ||
            (mediumPriorityChecked && priority === "Medium") ||
            (highPriorityChecked && priority === "High");

        //visar eller döljer habit baserat på filtreringen
        if (shouldBeDisplayed) {
            habit.style.display = "block";
        } else {
            habit.style.display = "none";
        }
    }
});
