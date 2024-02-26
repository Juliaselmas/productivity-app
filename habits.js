let habits = []
let habitList = document.getElementById("habitList");
let habitContainer = document.getElementById("habit-container");
let habitInput = document.getElementById("habitInput");
let addHabitBtn = document.getElementById("addHabitBtn");

addHabitBtn.addEventListener("click", () => {
    //if-sats för att säkerställa att prio är vald?

    //ny Habit
    let li = document.createElement("li");
    let newHabit = habitInput.value;
    li.innertext = newHabit;

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

    habitList.append("li");
    habitInput.value = "";

    //sparar värden i localStorage
    habits.push(newHabit);
    console.log(habits);
    localStorage.setItem("habits", JSON.stringify(habits));

});





//behövs detta?
//const fetchData = async (url) => {
    //let response = await fetch(url);
    //let json = await response.json();
    //return json;
  //};

