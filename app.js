// If it touches the DOM it belongs here, don't pass any DOM
// manipulation into Jaryn.js, callbacks are ok though.

const App = Object.create({
  "showNav": function(nav) { nav.classList.add("active"); },
  "hideNav": function(nav) { nav.classList.remove("active"); },
  "showDiv": function(div) { div.classList.remove("invisible"); },
  "hideDiv": function(div) { div.classList.add("invisible"); },
  "toggleDiv": function(div) {
    const nodes = Array.from(document.querySelectorAll(".contentDiv"));
    nodes.forEach(this.hideDiv);
    this.showDiv(div);
  },
  "setDate": function() {
    const now = new Date();
    const date = document.querySelector("#date");
    const month = ((now.getMonth() +1)< 10) ? "" + 0 + (now.getMonth()+1) : now.getMonth()+1;
    const day = (now.getDate() < 10) ? "" + 0 + now.getDate() : now.getDate();
      
    date.innerHTML = day + "/" + month + "/" + now.getFullYear();
  },
  "setMoodValue": function(value) {
    document.getElementById('moodValue').innerHTML = value;
  },
  "connectEventHandlers": function() {
     // Save button event handler.
    document.getElementById("save").addEventListener("click", () => {
      const jaryn = Jaryn();
      const now = new Date();
      const mood = document.getElementById("mood").value;
      const notes = document.getElementById("notes").value;
      const nodes = document.getElementsByClassName("emotion");
      const emotions = Array.from(nodes).filter((node) => node.checked);
      const data = {
        "id": now.getTime(),
        "date": now,
        "mood": "",
        "feelings": [], 
        "notes": ""
      };
      
      data.mood = mood;
      data.notes = notes;
      data.emotions = emotions.map((node) => node.id); 
      
      jaryn.vfs.updateJSON(data, (obj) => {
        console.log(`Wrote ${obj}.`);
        this.loadHistory();
      });
    });

    // Add event handlers.
    Array.from(document.querySelectorAll(".contentDiv")).forEach((div) => {
      div.addEventListener("click", (e) => this.toggleDiv(div));
    });
  
    document.getElementById('mood').addEventListener('change', (event) => {
      this.setMoodValue(event.target.value);
    });

    Array.from(document.getElementsByClassName("navLink")).forEach((nav) => {
      nav.addEventListener("click", (e) => {
        const contentNodes = Array.from(document.querySelectorAll(".contentDiv"));
        const navNodes = Array.from(document.querySelectorAll(".navLink"));
        const target = nav.firstChild.getAttribute("data-target");
        
        contentNodes.forEach(this.hideDiv);
        navNodes.forEach(this.hideNav);
        
        this.showDiv(document.querySelector("#" + target));
        this.showNav(e.target.parentNode);
      });
    }); 
  },
  
  "loadHistory": function() {
    const jaryn = Jaryn();
    const tbody = document.querySelector("#historyTable");
    
    while(tbody.hasChildNodes()) {
      tbody.removeChild(tbody.firstChild);
    }
    
    jaryn.vfs.readJSON((data) => {
      const moods = document.querySelector("#averageMood");
      const emotions = document.querySelector("#averageEmotions");
      var averageMood = 0;
      var averageEmotions = {};
      
      console.dir(data);
      
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
  } 
});

App.setDate();
App.setMoodValue("5");
App.connectEventHandlers();
App.loadHistory();