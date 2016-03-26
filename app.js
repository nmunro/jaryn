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
  
  "setDate": function() {
    const text = [6, 0].map((n) => {
      const {year, month, day} = DateUtil.getYYYYMMDD(n);
      return `${day}/${month}/${year}`;
    });
    document.querySelector("#date").innerHTML = text.join("&nbsp;-&nbsp;");
  },
  
  "setMoodValue": function(value) {
    document.querySelector('#addMoodValue').innerHTML = value;
  },
  
  "setSevenDayAverageMood": function(val) {
    document.querySelector("#moodMeter").value = val*10;  
    document.querySelector("#moodMeterLbl").innerHTML = `${Math.floor(val*10)}%`;
  },
  
  "setupEventHandlers": function() {
     // Save button event handler.
    document.querySelector("#save").addEventListener("click", () => {
      const mood = document.querySelector("#addMood").value;
      const notes = document.querySelector("#addNotes").value;
      const nodes = document.querySelector("#addDiv").querySelectorAll(".emotion");
      const feelings = Array.from(nodes).filter((node) => node.checked);
      const now = DateUtil.getDate();
      const data = {};
      
      data.id = now.getTime();
      data.date = now;
      data.mood = parseInt(mood, 10);
      data.notes = notes;
      data.feelings = feelings.map((node) => node.getAttribute("data-name")); 
      
      // Have to use a function in this scope.
      VFS.updateDiary(data, () => this.init());
    });
    
    document.querySelector("#resave").addEventListener("click", () => {
      // Override object.
      // Return to dashboard.
      console.log("Re-saving!");  
    });
    
    document.querySelector("#cancel").addEventListener("click", () => {
      // Clear inut controls.
      // Return to dashboard.
      console.log("Cancelling!");  
    });

    // Add event handlers.
    document.querySelector("#addMood").addEventListener('change', (event) => {
      this.setMoodValue(event.target.value);
    });

    Array.from(document.querySelectorAll(".navLink")).forEach((nav) => {
      nav.addEventListener("click", (event) => {
        const target = nav.firstChild.getAttribute("data-target");
        
        this.hideDivAll();
        this.hideNavAll();
        this.showDiv(document.querySelector(`#${target}`));
        this.showNav(event.target.parentNode);
      });
    }); 
  },
  
  "editHistory": function(event) {
    const row = event.target.parentNode;
    const cells = Array.from(row.getElementsByTagName("td"));
    const es = Array.from(document.querySelector("#editDiv").querySelectorAll(".emotion"));
    
    this.hideDivAll();
    this.showDiv(document.querySelector("#editDiv"));
    
    cells.forEach((cell) => {
      switch(cell.getAttribute("data-name")) {
        case "date":
          document.getElementById("editDate").innerHTML = cell.innerHTML;
          break;   
          
        case "mood": 
          document.getElementById("editMoodValue").innerHTML = cell.innerHTML;
          document.getElementById("editMood").value = cell.innerHTML[0];
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
          document.getElementById("editNotes").innerHTML = cell.innerHTML;
          break;
      }
    });
  },
  
  "showHistory": function(data) {
    const moodObj = [];
    const tbody = document.querySelector("#historyTable");
    
    while(tbody.hasChildNodes()) tbody.removeChild(tbody.firstChild);
    
    Object.keys(data).forEach((obj) => {
      const row = document.createElement('tr');
      const date = document.createElement('td');
      const mood = document.createElement('td');
      const feelings = document.createElement('td');
      const notes = document.createElement('td');
      const dt = new Date(parseInt(obj, 10));
      const fn = (p, n) => `${p}, ${n}`;
      
      if(!data[obj]) {
        data[obj] = {
          "mood": 0,
          "feelings": ["-"],
          "notes": "-"
        };   
      }
      
      moodObj.push(data[obj].mood);
      
      mood.innerHTML = `${(data[obj].mood*10)}%`;
      feelings.innerHTML = data[obj].feelings.reduce(fn);
      notes.innerHTML = (data[obj].notes !== "") ? data[obj].notes : "-";
      date.innerHTML = `${dt.getDate()}/`;
      date.innerHTML += `${DateUtil.zeroPad(dt.getMonth()+1)}/`;
      date.innerHTML += `${dt.getFullYear()}`;
      
      date.setAttribute("data-name", "date");
      mood.setAttribute("data-name", "mood");
      feelings.setAttribute("data-name", "feelings");
      notes.setAttribute("data-name", "notes");

      row.appendChild(date);
      row.appendChild(mood);
      row.appendChild(feelings);
      row.appendChild(notes);
      tbody.appendChild(row);
      
      // Add event handler for the row.
      row.addEventListener("click", (event) => this.editHistory(event));
    });
    
    // Bail out if there's no data.
    if(moodObj.length === 0) return;
    this.setSevenDayAverageMood(moodObj.reduce((p, n) => p+n) / moodObj.length);
  },
  
  "init": function() {
    this.setDate();
    this.setMoodValue("5");
    this.hideDivAll();
    this.hideNavAll();
    this.showDiv(document.querySelector("#dashboardDiv"));
    this.showNav(document.querySelector("#dashboard").parentNode);
    
    VFS.loadConfig((conf) => {
      VFS.getSevenDayHistory((d) => this.showHistory(d));
    });
  } 
}));

App.setupEventHandlers();
App.init();