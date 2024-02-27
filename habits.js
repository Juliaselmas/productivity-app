let habits = []
let habitList = document.getElementById("habitList");
let habitContainer = document.getElementById("habit-container");
let habitInput = document.getElementById("habitInput");
let addHabitBtn = document.getElementById("addHabitBtn");


let onRender = () => {
    //kollar om det finns data i localStorage
    if (localStorage.getItem("habits")) {
        habits = JSON.parse(localStorage.getItem("habits"));
        //skapar li för varje habit

        habits.forEach((habit, i) => {
            let li = document.createElement("li");
            li.innerHTML = `
            <h3>${habit}</h3>
            `;
            habitList.append(li);
            //deleteknapp
            let deleteHabitBtn = document.createElement("button");
            deleteHabitBtn.innerText = "Delete Task";
            li.append(deleteHabitBtn);

            //Hitta och ta bort index för denna habit i array

            deleteHabitBtn.addEventListener("click", () => {
                li.remove();
                let newHabitList = habits.filter((habit, index) => i !== index);
                habits = [...newHabitList];
                localStorage.setItem("habits", JSON.stringify(habits));
                console.log("Det verkar funka!", localStorage.getItem("habits"));
            });
        });
    };
};

addHabitBtn.addEventListener("click", () => {
    //if-sats för att säkerställa att prio är vald?

    //ny Habit
    let li = document.createElement("li");
    let newHabit = habitInput.value;
    li.innerText = newHabit;

    //ny completedknapp
    let completedHabitBtn = document.createElement("button");
    completedHabitBtn.innerText = "Mark as Completed";
    li.append(completedHabitBtn);

    //ny deleteknapp
    let deleteHabitBtn = document.createElement("button");
    deleteHabitBtn.innerText = "Delete Habit";
    li.append(deleteHabitBtn);

    //hittar och tar bort index för habit i array
    let currentIndex = habits.length;

    deleteHabitBtn.addEventListener("click", () => {
        li.remove();
        let newHabitList = todos.filter((habit, i) => i !== currentIndex);
        habits = [...newHabitList];
        localStorage.setItem("habit", JSON.stringify(habits));
    });

    habitList.append(li);
    habitInput.value = "";

    //sparar värden i localStorage
    habits.push(newHabit);
    console.log(habits);
    localStorage.setItem("habits", JSON.stringify(habits));

});

onRender();





//behövs detta?
//const fetchData = async (url) => {
    //let response = await fetch(url);
    //let json = await response.json();
    //return json;
  //};

