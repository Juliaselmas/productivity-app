let habits = []
let habitList = document.getElementById("habitList");
let habitContainer = document.getElementById("habit-container");
let habitInput = document.getElementById("habitInput");
let addHabitBtn = document.getElementById("addHabitBtn");
let habitStreakCounter = 0;
let id = Date.now().toString(); // Generera ett unikt ID baserat på aktuell tid


/*Att göra:
varför visas id som placeholder till streak i redigeringsläget??
påbygga completedknappen
curentUser och user!!
*/


let createHabitListItem = (title, streak) => {
    //lägger till index som argument för att säkerställa att habitStreakCounter får rätt värde
    //habitStreakCounter = streak;

    let priorityBtn = document.querySelector("input[name='priority']:checked").value;

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
    completedHabitBtn.innerText = "Mark as Completed";
    li.append(completedHabitBtn);

    //funktion för att öka index på streak
    completedHabitBtn.addEventListener("click", () => {
        streak++;
        habitStreakCounter++;
        streakNumber.innerText = "Streak: " + habitStreakCounter;

          // Uppdatera streaken i localStorage för den specifika vanan
          updateStreakInLocalStorage(title, streak);

          saveToLocalStorage(title, priorityBtn, habitStreakCounter, id);
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
        //let editedStreakCounter = parseInt(editedStreakInput.value);

        if (!editedPriorityBtn) {
            alert("Please select a priority for the edited habit.");
            return;
        }
        let editedPriorityValue = editedPriorityBtn.value;
        let editedStreakCounter = parseInt(editedStreakInput.value);

        // Hitta habiten baserat på habitText
        let habitIndex = habits.findIndex(habit => habit.Habit === title);
        if (habitIndex !== -1) {

        // Uppdatera habiten med nya värden
        habits[habitIndex].Habit= editedHabitText;
        habits[habitIndex].Priority = editedPriorityValue;
        habitStreakCounter = editedStreakCounter;

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

let updateStreakInLocalStorage = (title, streak) => {
    let existingHabits = JSON.parse(localStorage.getItem('habits')) || [];

    // Hitta den specifika vanan och uppdatera streaken
    let habitToUpdate = existingHabits.find(habit => habit.Title === title);
    if (habitToUpdate) {
        habitToUpdate.streak = streak;
    }

    // Spara den uppdaterade listan till localStorage
    localStorage.setItem('habits', JSON.stringify(existingHabits));
};

let saveToLocalStorage = (title, priority, streak, id) => {
    let existingHabits = JSON.parse(localStorage.getItem('habits')) || [];

    /// Hitta befintlig habit med samma ID
    let existingHabit = existingHabits.find(habit => habit.id === id);
    
    if (existingHabit) {
        // Uppdatera den befintliga habiten
        existingHabit.title = title;
        existingHabit.priority = priority;
        existingHabit.streak = streak;
    } else {
        // Skapa en ny habit om ingen matchande hittades
        let latestHabit = {
            title: title, 
            priority: priority,
            streak: streak,
            id: id,
            deleted: false
        };
        existingHabits.push(latestHabit);
    }

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
    let priorityBtn = document.querySelectorAll('input[name="priority"]:checked');
    let prioritySelected = false;
    let priorityValue = "Medium"; // Standardprioritet om ingen väljs
    //let id = Date.now().toString(); // Generera ett unikt ID baserat på aktuell tid

    if (priorityBtn.length > 0) {
        prioritySelected = true;
        priorityValue = priorityBtn[0].value; // Hämta det första valda värdet
    }

    if (!prioritySelected) {
        alert("Please select a priority for your new habit. Defaulting to Medium.");
    }

    let newHabitText = habitInput.value.trim();

    if (newHabitText === "") {
        alert("Please enter a habit.");
        return;
    }

    // Spara den nya vanan till local storage
    saveToLocalStorage(newHabitText, priorityValue, 0, id);

    let newHabit = {
        Habit: newHabitText,
        Priority: priorityValue,
        streak: 0
    };

    habits.push(newHabit);
    createHabitListItem(newHabitText, id); // Skicka med id till createHabitListItem
    habitInput.value = "";
});