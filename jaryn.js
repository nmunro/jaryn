const Jaryn = function() { return(this === window) ? new Jaryn() : this; };

Jaryn.prototype.UI = {
  "loadRecords": () => Jaryn.prototype.DB.getRecords((appData) => Jaryn.prototype.UI.addRecord(appData)),
  "addRecord": (record) => {
    const tb = document.getElementById('tb');
    const tr = document.createElement('tr');
    const id = document.createElement('td');
    const date = document.createElement('td');
    const data = document.createElement('td');
    
    id.innerHTML = record.id;
    date.innerHTML = record.date;
    data.innerHTML = "No score recorded!";
    
    tr.appendChild(id);
    tr.appendChild(date);
    tr.appendChild(data);
    tb.appendChild(tr);
  },
  
  "removeRecord": (record) => console.log("Unimplemented!"),
  
  "removeAllRecords": () => {
    const tb = document.getElementById('tb');
    while(tb.hasChildNodes()) tb.removeChild(tb.firstChild);
  },
  
  "setMood": () => {
    document.getElementById("moodValue").innerHTML = document.getElementById("mood").value + "0%";
  },
  
  "submitStatus": () => {
    const mood = Number(document.getElementById("mood").value);
    const nodes = Array.from(document.getElementsByClassName("feeling"));
    const feelings = nodes.filter((element) => element.checked).map((element) => element.getAttribute("id"));
    
    Jaryn.prototype.DB.saveRecord({ "mood": mood, "feelings": feelings });
  },
  
  "init": () => {
    Jaryn.prototype.DB.init();
    Jaryn.prototype.UI.setMood();
    Jaryn.prototype.UI.loadRecords();
  }
};

Jaryn.prototype.DB = {
  "appData": {},
  
  "init": () => {
    console.log("Loading!");    
    Jaryn.prototype.DB.getRecords((appData) => {
      if(appData.updated === undefined) {
        console.log("Initial set up.");
        console.dir(Jaryn.prototype.DB.appData);
      } 
      else {
        console.log("Loading saved app data.");
        console.dir(Jaryn.prototype.DB.appData);
        document.getElementById("data").setAttribute("class", "visible");
      }
    });
  },
  
  "getRecords": (cb) => {
    chrome.storage.local.get(null, (appData) => {
      console.log("Testing appData:");
      console.dir(appData);
      var err = chrome.runtime.lastError;
      if(err) {
        console.log(err);
      }
      else {
        cb(appData);
      }
    });   
  },
  
  "saveRecord": (record) => {
    const date = new Date();
    record.id = date.getTime();
    record.date = date.toString();
    
    Jaryn.prototype.DB.appData.updated = new Date();
    
    if(Jaryn.prototype.DB.appData.records === undefined) {
      Jaryn.prototype.DB.appData.records = [record];
    }
    else {
      Jaryn.prototype.DB.appData.records.push(record);
    }
    
    chrome.storage.local.set(Jaryn.prototype.DB.appData, (err) => {
      Jaryn.prototype.DB.getRecords((appData) => {
        console.log("Testing!");
        console.dir(appData);    
      });
    });
  }
};