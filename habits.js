let habits = []
let habitUl = document.getElementById("habitList");
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

});

habitUl.append("li");
habitInput.value = "";



//behövs detta?
//const fetchData = async (url) => {
    //let response = await fetch(url);
    //let json = await response.json();
    //return json;
  //};

