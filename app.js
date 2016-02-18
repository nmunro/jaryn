const Jaryn = function() { return(this === window) ? new Jaryn() : this; };

Jaryn.prototype.UI = {
  "loadRecords": () => Jaryn.prototype.DB.getRecords().forEach(Jaryn.prototype.UI.addRecord),
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
    
    const feelingScore = nodes.map((element) => {
      return (element.checked) ? Number(element.getAttribute("data-mood")) : 0;
    }).reduce((prev, cur) => {
      return prev + cur;
    });
    
    console.log("Score: " + (mood + feelingScore));
  }
};

Jaryn.prototype.DB = {
  "indexTable": "indexTable",
  
  "getTable": (name) => JSON.parse(localStorage.getItem(name)) || [],
  
  "getRecord": (id) => JSON.parse(localStorage.getItem(id)),
  
  "getRecords": () => Jaryn.prototype.DB.getTable(Jaryn.prototype.DB.indexTable).map((id) => JSON.parse(localStorage.getItem(id))),
  
  "deleteRecord": (id) => localStorage.removeItem(id),
  
  "deleteAll": () => { localStorage.clear(); },
  
  "setRecord": (record) => {
    const date = new Date();
    const indexTable = Jaryn.prototype.DB.getTable(Jaryn.prototype.DB.indexTable);
    
    record.id = date.getTime();
    record.date = date.toDateString();
    indexTable.push(date.getTime());
    localStorage.setItem(date.getTime(), JSON.stringify(record));
    localStorage.setItem("indexTable", JSON.stringify(indexTable));
    Jaryn.prototype.UI.addRecord(record);
    
    return date.getTime();
  },
  
  "toJSON": () => console.log("Unimplemented!"),
  "syncRecords": () => console.log("Unimplemented!") 
};