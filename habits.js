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


let createHabitListItem = (habitText, index) => {
    let priorityBtn = document.querySelector("input[name='priority']:checked").value;

    let li = document.createElement("li");
    li.innerHTML = ` <h3>${habitText}</h3> `;

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

    let editedHabitInput = document.createElement("input");
    editedHabitInput.type = "text";
    editedHabitInput.value = habitTextElement.innerText;
    li.insertBefore(editedHabitInput, habitTextElement);
    habitTextElement.remove();

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
    li.insertBefore(priorityContainer, selectedPriorityElement);
    selectedPriorityElement.remove();

    let saveChangesBtn = document.createElement("button");
    saveChangesBtn.innerText = "Save Changes";
    li.append(saveChangesBtn);

    saveChangesBtn.addEventListener("click", () => {
        let editedHabitText = editedHabitInput.value;
        let editedPriorityBtn = document.querySelector('input[name="editPriority"]:checked').value;

        //uppdaterar titel och prioritet
        habitTextElement.innerText = editedHabitText;
        selectedPriorityElement.innerText = editedPriorityBtn + " Priority";

        //tar bort inputfältet för habit och saveChangesBtn
        editedHabitInput.remove();
        priorityContainer.remove();
        saveChangesBtn.remove();
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
        let habitIndex = habits.indexOf(habitText);
        habits.splice(habitIndex, 1);
        localStorage.setItem("habits", JSON.stringify(habits));
    });

    habitList.append(li);

    return li;
};



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


addHabitBtn.addEventListener("click", () => {
    
    //säkerställer att prio är vald
    let priorityBtn = document.querySelectorAll('input[name="priority"]');
    let prioritySelected = false;
    priorityBtn.forEach(radio => {
        if (radio.checked) {
            prioritySelected = true;
        }
    });

    if (!prioritySelected) {
        alert("Please select a priority for your new habit.");
        return;
    };

    let newHabit = habitInput.value;
    let li = createHabitListItem(newHabit, 0);
    habitList.append(li);

    //sparar värden i localStorage
    habits.push(newHabit);
    
    localStorage.setItem("habits", JSON.stringify(habits));
    habitInput.value = "";

});

onRender();