let habits = []
let habitList = document.getElementById("habitList");
let habitContainer = document.getElementById("habit-container");
let habitInput = document.getElementById("habitInput");
let addHabitBtn = document.getElementById("addHabitBtn");
let priorityBtn = document.querySelectorAll('input[name="priority"]');
let priorityBtnChecked = document.querySelectorAll('input[name="priority"]:checked');


let createHabitListItem = (habitText, index) => {
    let li = document.createElement("li");
    li.innerHTML = `
    <h3>${habitText}</h3>
    <p>${priorityBtnChecked.value} Priority</p>
    `;


    //skapar ny completedknapp
    let completedHabitBtn = document.createElement("button");
    completedHabitBtn.innerText = "Mark as Completed";
    li.append(completedHabitBtn);

    //skapar ny deleteknapp
    let deleteHabitBtn = document.createElement("button");
    deleteHabitBtn.innerText = "Delete Habit";
    li.append(deleteHabitBtn);


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
    let li = createHabitListItem(newHabit);
    habitList.append(li);

    //sparar värden i localStorage
    habits.push(newHabit);
    
    localStorage.setItem("habits", JSON.stringify(habits));
    habitInput.value = "";

});

onRender();
