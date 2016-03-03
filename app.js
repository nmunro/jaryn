// If it touches the DOM it belongs here, don't pass any DOM
// manipulation into Jaryn.js, callbacks are ok thought.
(function() {
  const jaryn = Jaryn();
  const showNav = (nav) => nav.classList.add("active");
  const hideNav = (nav) => nav.classList.remove("active");
  const showDiv = (div) => div.classList.remove("invisible");
  const hideDiv = (div) => div.classList.add("invisible");
  const toggleDiv = (div) => {
    Array.from(document.querySelectorAll(".contentDiv")).forEach(hideDiv);
    showDiv(div);
  };
  const setDate = () => {
    const now = new Date();
    const date = document.querySelector("#date");
    const month = ((now.getMonth() +1)< 10) ? "" + 0 + (now.getMonth()+1) : now.getMonth()+1;
    const day = (now.getDate() < 10) ? "" + 0 + now.getDate() : now.getDate();
      
    date.innerHTML = day + "/" + month + "/" + now.getFullYear();
  };
  
  // Update mood value.
  const setMoodValue = (value) => {
    document.getElementById('moodValue').innerHTML = value;
  };

  // Add event handlers.
  Array.from(document.querySelectorAll(".contentDiv")).forEach((div) => {
    div.addEventListener("click", (e) => toggleDiv(div));
  });
  
  document.getElementById('mood').addEventListener('change', (event) => {
    setMoodValue(event.target.value);
  });

  Array.from(document.getElementsByClassName("navLink")).forEach((nav) => {
    nav.addEventListener("click", (e) => {
      Array.from(document.querySelectorAll(".contentDiv")).forEach(hideDiv);
      Array.from(document.querySelectorAll(".navLink")).forEach(hideNav);
      showDiv(document.querySelector("#" + nav.firstChild.getAttribute("data-target")));
      showNav(e.target.parentNode);
    });
  });
  
  setDate();
  setMoodValue("5");

  // Populate history table.
  jaryn.vfs.readJSON("jaryn.json", (data) => {
    const tbody = document.querySelector("#historyTable");
    const moods = document.querySelector("#averageMood");
    const emotions = document.querySelector("#averageEmotions");
    var averageMood = 0;
    var averageEmotions = {};
    
    data.forEach((obj) => {
      const row = document.createElement('tr');
      const id = document.createElement('td');
      const date = document.createElement('td');
      const mood = document.createElement('td');
      const feelings = document.createElement('td');
      const notes = document.createElement('td');
      const dt = new Date(obj.date);
      const year = dt.getFullYear();
      const month = (dt.getMonth() + 1 < 10) ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1;
      const day = (dt.getDate() < 10) ? "0" + dt.getDate() : dt.getDate();

      id.innerHTML = obj.id;
      date.innerHTML = day + "/" + month + "/" + year;
      mood.innerHTML = obj.mood;
      averageMood += obj.mood;
      obj.feelings.forEach((emotion) => {
        if(averageEmotions[emotion] !== undefined)
          averageEmotions[emotion] = averageEmotions[emotion] + 1;
        else
          averageEmotions[emotion] = 1;
      });
      feelings.innerHTML = obj.feelings.reduce((prev, current) => prev + ", " + current);
      notes.innerHTML = obj.notes;

      row.appendChild(id);
      row.appendChild(date);
      row.appendChild(mood);
      row.appendChild(feelings);
      row.appendChild(notes);
      tbody.appendChild(row);
    });
    
    averageMood /= data.length;
    moods.innerHTML = averageMood;
    Object.keys(averageEmotions).forEach((emotion) => {
      console.log(emotion + ": " + averageEmotions[emotion]);  
    });
  });
}());
