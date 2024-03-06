let habits = []
let habitList = document.getElementById("habitList");
let habitContainer = document.getElementById("habit-container");
let habitInput = document.getElementById("habitInput");
let addHabitBtn = document.getElementById("addHabitBtn");
let habitStreakCounter = 0;

/*Att göra:
funktion till editknappen. Appenda uppdateringar?
påbygga completedknappen
curentUser
*/


let createHabitListItem = (title, index) => {
    let priorityBtn = document.querySelector("input[name='priority']:checked").value;

    let li = document.createElement("li");
    li.innerHTML = ` <h3>${title}</h3> `;

    let selectedPriority = document.createElement("p");
    selectedPriority.innerText = priorityBtn + " Priority";
    li.append(selectedPriority);

    let streakNumber = document.createElement("p");
    streakNumber.innerText = "Streak: " + index;
    li.append(streakNumber);


    //skapar ny completedknapp
    let completedHabitBtn = document.createElement("button");
    completedHabitBtn.innerText = "Mark as Completed";
    li.append(completedHabitBtn);

    //funktion för att öka index på streak
    completedHabitBtn.addEventListener("click", () => {
        habitStreakCounter++;
        streakNumber.innerText = "Streak: " + habitStreakCounter;

        saveToLocalStorage();

        //lägga till att knappen ändrar text eller hela habit ändrar utseende?
    });


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
    editedStreakInput.value = habitStreakCounter;
    li.insertBefore(editedStreakInput, editedStreakLabel.nextSibling);

    let saveChangesBtn = document.createElement("button");
    saveChangesBtn.innerText = "Save Changes";
    li.append(saveChangesBtn);

    saveChangesBtn.addEventListener("click", () => {
        let editedHabitText = editedHabitInput.value;
        let editedPriorityBtn = document.querySelector('input[name="editPriority"]:checked').value;
        let editedStreakCounter = parseInt(editedStreakInput.value);

        // Hitta habiten baserat på habitText
        let habitIndex = habits.findIndex(habit => habit.Habit === title);
        if (habitIndex !== -1) {

        // Uppdatera habiten med nya värden
        habits[habitIndex].Habit= editedHabitText;
        habits[habitIndex].Priority = editedPriorityBtn;
        habitStreakCounter = editedStreakCounter;

        // Uppdatera DOM med de nya värdena
        habitTextElement.innerText = editedHabitText;
        selectedPriorityElement.innerText = editedPriorityBtn + " Priority";
        streakNumberElement.innerText = "Streak: " + editedStreakCounter;

        // Ta bort inputfältet för habit och saveChangesBtn
        editedHabitInput.remove();
        priorityContainer.remove();
        saveChangesBtn.remove();
        editedStreakInput.remove();
        editedStreakLabel.remove();

        // Spara den uppdaterade habiten till local storage
        saveToLocalStorage();

    } else {
        console.error("Habit not found in habits array.");
    }

    });

    });


    //skapar ny deleteknapp
    let deleteHabitBtn = document.createElement("button");
    deleteHabitBtn.innerText = "Delete Habit";
    li.append(deleteHabitBtn);

    //funktion för att ta bort habit
    deleteHabitBtn.addEventListener("click", () => {
        li.remove();

        //tar bort habit med rätt index från arrayen
        /*let habitIndex = habits.indexOf(habitText);
        habits.splice(habitIndex, 1);
        localStorage.setItem("habits", JSON.stringify(habits));
        */
        let habitIndex = habits.findIndex(habit => habit.Title === title);
        if (habitIndex !== -1) {
            habits.splice(habitIndex, 1);
            saveToLocalStorage();
        }
    });

    habitList.append(li);

    saveToLocalStorage();

    return li;

    
};

let saveToLocalStorage = () => {
    //localStorage.setItem('habits', JSON.stringify(habits));
    let existingHabits = JSON.parse(localStorage.getItem('habits')) || [];

    let latestHabit = {
        title: habitInput.value, 
        priority: document.querySelector("input[name='priority']:checked").value,
        streak: habitStreakCounter,
        deleted: false
    };

    //Kan man lägga in ett nytt objekt för de uppdaterade habits här?
    //Hur får jag habitStreakCounter att uppdateras även i localStorage?

    existingHabits.push(latestHabit);

    // Filtrera bort raderade uppgifter innan du sparar till localStorage
    let habitsToSave = existingHabits.filter(habit => !habit.deleted);

    localStorage.setItem('habits', JSON.stringify(habitsToSave));
};

/*
let onRender = () => {
    //kollar om det finns data i localStorage
    if (localStorage.getItem("habits")) {
        habits = JSON.parse(localStorage.getItem("habits"));
        //skapar li för varje habit

        habits.forEach((habit, i) => {
           
            let li = createHabitListItem(habit);
            habitList.append(li);

        });
    };
};
*/

addHabitBtn.addEventListener("click", () => {
    
    //säkerställer att prio är vald
    let priorityBtn = document.querySelectorAll('input[name="priority"]');
    let prioritySelected = false;
    if (!priorityBtn) {
        alert("Please select a priority for your new habit.");
        return;
    }

    let newHabitText = habitInput.value;
    if (newHabitText.trim() === "") {
        alert("Please enter a habit.");
        return;
    }

    let newHabit = {
        Habit: newHabitText,
        Priority: priorityBtn.value,
        streak: 0
    };

    habits.push(newHabit);
    createHabitListItem(newHabitText, 0);
    //saveToLocalStorage();

    habitInput.value = "";
});

// Funktion för att initialisera habitStreakCounter från localStorage när sidan laddas
let initStreakCounterFromLocalStorage = () => {
    let storedStreakCounter = localStorage.getItem("habitStreakCounter");
    if (storedStreakCounter) {
        habitStreakCounter = parseInt(storedStreakCounter);
    }
};

// Kör funktionen när sidan laddas
initStreakCounterFromLocalStorage();


/*
// Funktion för att initialisera habits från localStorage när sidan laddas
let initHabitsFromLocalStorage = () => {
    let storedHabits = localStorage.getItem("habits");
    if (storedHabits) {
        habits = JSON.parse(storedHabits);
        habits.forEach(habit => {
            createHabitListItem(habit.habitText, habit.streak);
        });
    }
};

// Ladda habits från localStorage när sidan laddas
initHabitsFromLocalStorage();
//onRender()
*/

