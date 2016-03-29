const App = Object.freeze(Object.create({
  "showNav": function(nav) {
    nav.classList.add("active");
  },
  
  "hideNav": function(nav) {
    nav.classList.remove("active");
  },
  
  "hideNavAll": function() {
    Array.from(document.querySelectorAll(".navLink")).forEach(this.hideNav);
  },
  
  "showDiv": function(div) {
    div.classList.remove("invisible");
  },
  
  "hideDiv": function(div) {
    div.classList.add("invisible");
  },
  
  "hideDivAll": function() {
    Array.from(document.querySelectorAll(".contentDiv")).forEach(this.hideDiv);
  },
  
  "toggleDiv": function(div) {
    this.hideDivAll();
    this.showDiv(div);
  },
  
  "showDefaultDashboard": function() {
    this.hideDivAll();
    this.hideNavAll();
    this.showDiv(document.querySelector("#dashboardDiv"));
    this.showNav(document.querySelector("#dashboardNav").parentNode);
  },
  
  "setDate": function() {
    const text = [6, 0].map((n) => {
      const {year, month, day} = DateUtil.getYYYYMMDD(n);
      return `${day}/${month}/${year}`;
    });
    document.querySelector("#date").innerHTML = text.join("&nbsp;-&nbsp;");
  },
  
  "setMoodValue": function(value) {
    document.querySelector('#moodValue').innerHTML = value;
  },
  
  "setSevenDayAverageMood": function(val) {
    document.querySelector("#moodMeter").value = val*10;  
    document.querySelector("#moodMeterLbl").innerHTML = `${Math.floor(val*10)}%`;
  },
  
  "setSevenDayAverageEmotions": function(emotions) {
    const obj = {};
    emotions.forEach((day, c1, a1) => {
      day.forEach((emotion, c2, a2) => {
        if(obj[emotion] === undefined) obj[emotion] = { "count": 1, "percent": 0 };
        else obj[emotion].count++;
        
        // This is the end of both inner and outer loops.
        if(c1 === a1.length-1 && c2 === a2.length-1) {
          const total = Object.keys(obj).map((elm) => obj[elm]).reduce((p, n) => p + n.count, 0);
          const emotions = document.querySelector("#averageEmotions");
          const exercise = document.querySelector("#exercise");
          
          emotions.innerHTML = "";
          Object.keys(obj).map((emotion) => {
            const percent = Math.round((obj[emotion].count / total) * 100);
            obj[emotion].percent = percent;
            emotions.innerHTML += `${emotion}: ${percent}%&nbsp;|&nbsp;`;  
          });
        }
      });
    });
  },
  
  "clearHistoryEntry": function() {
    Array.from(document.querySelectorAll(".emotion")).forEach((e) => e.checked = false);    
    document.querySelector("#notes").innerHTML = "";
    document.querySelector("#mood").value = "0";
    document.querySelector("#moodValue").innerHTML = "0%";
  },
  
  "setupEventHandlers": function() {
     // Save button event handler.
    document.querySelector("#saveRecord").addEventListener("click", () => {
      const mood = document.querySelector("#mood").value;
      const notes = document.querySelector("#notes").value;
      const nodes = document.querySelector("#editDiv").querySelectorAll(".emotion");
      const feelings = Array.from(nodes).filter((node) => node.checked);
      const exercise = document.querySelector("#exercise").checked;
      const now = DateUtil.getDate();
      const data = {
        "id": now.getTime(),
        "date": now,
        "mood": parseInt(mood, 10),
        "notes": notes,
        "feelings": feelings.map((node) => node.getAttribute("data-name")),
        "exercise": exercise
      };
      
      // Have to use a function in this scope.
      VFS.updateDiary(data, () => {
        this.init();
        this.clearHistoryEntry();
      });
    });
    
    document.querySelector("#cancelRecord").addEventListener("click", () => {
      this.clearHistoryEntry();
      this.showDefaultDashboard();
    });

    // Add event handlers.
    document.querySelector("#mood").addEventListener('change', (event) => {
      this.setMoodValue(`${event.target.value}0%`);
    });

    Array.from(document.querySelectorAll(".navLink")).forEach((nav) => {
      nav.addEventListener("click", (event) => {
        const target = nav.firstChild.getAttribute("data-target");
        
        this.hideDivAll();
        this.hideNavAll();
        this.showDiv(document.querySelector(`#${target}`));
        this.showNav(event.target.parentNode);
        this.clearHistoryEntry();
      });
    }); 
  },
  
  "editHistory": function(event) {
    const row = event.target.parentNode;
    const cells = Array.from(row.querySelectorAll("td"));
    const es = Array.from(document.querySelectorAll(".emotion"));
    
    this.hideDivAll();
    this.hideNavAll();
    this.showDiv(document.querySelector("#editDiv"));
    this.showNav(document.querySelector("#editNav").parentNode);
    
    cells.forEach((cell) => {
      switch(cell.getAttribute("data-name")) {
        case "date":
          document.querySelector("#editDate").innerHTML = cell.innerHTML;
          break;   
          
        case "mood": 
          document.querySelector("#moodValue").innerHTML = cell.innerHTML;
          document.querySelector("#mood").value = cell.innerHTML[0];
          if(cell.innerHTML === "100%") document.querySelector("#mood").value += "0";
          break;
          
        case "feelings":
          cell.innerHTML.split(" ").forEach((text) => {
            if(text.endsWith(",")) text = text.slice(0, -1);
            es.forEach((e) => {
              if(e.getAttribute("data-name") === text) e.checked = true;  
            });  
          });
          break;
          
        case "notes":
          document.querySelector("#notes").innerHTML = cell.innerHTML;
          break;
      }
    });
  },
  
  "showHistory": function(data) {
    const moodObj = [];
    const emotionObj = [];
    const tbody = document.querySelector("#historyTable");
    
    
    while(tbody.hasChildNodes()) tbody.removeChild(tbody.firstChild);
    
    data.forEach((obj) => {
      const row = document.createElement('tr');
      const date = document.createElement('td');
      const mood = document.createElement('td');
      const feelings = document.createElement('td');
      const notes = document.createElement('td');
      const exercise = document.createElement('td');
      const dt = new Date(obj.date);
      const fn = (p, n) => `${p}, ${n}`;
      
      moodObj.push(obj.mood);
      emotionObj.push(obj.feelings);
      
      mood.innerHTML = `${obj.mood*10}%`;
      feelings.innerHTML = obj.feelings.reduce(fn);
      notes.innerHTML = (obj.notes !== "") ? obj.notes : "-";
      date.innerHTML = `${dt.getDate()}/`;
      date.innerHTML += `${DateUtil.zeroPad(dt.getMonth()+1)}/`;
      date.innerHTML += `${dt.getFullYear()}`;
      exercise.innerHTML = obj.exercise ? "Yes" : "No";
      
      date.setAttribute("data-name", "date");
      mood.setAttribute("data-name", "mood");
      feelings.setAttribute("data-name", "feelings");
      notes.setAttribute("data-name", "notes");
      exercise.setAttribute("data-name", "exercise");

      row.appendChild(date);
      row.appendChild(mood);
      row.appendChild(feelings);
      row.appendChild(notes);
      row.appendChild(exercise);
      tbody.appendChild(row);
      
      // Add event handler for the row.
      row.addEventListener("click", (event) => this.editHistory(event));
    });
    
    // Bail out if there's no data.
    if(moodObj.length === 0) return;
    this.setSevenDayAverageMood(moodObj.reduce((p, n) => p+n) / moodObj.length);
    this.setSevenDayAverageEmotions(emotionObj);
  },
  
  "init": function() {
    this.setDate();
    this.setMoodValue("5");
    this.hideDivAll();
    this.hideNavAll();
    this.showDiv(document.querySelector("#dashboardDiv"));
    this.showNav(document.querySelector("#dashboardNav").parentNode);
    
    VFS.loadConfig((conf) => VFS.getSevenDayHistory((d) => this.showHistory(d)));
  } 
}));

App.setupEventHandlers();
App.init();