const Jaryn = function() {
  return(this === window) ? new Jaryn() : this;
};

Jaryn.prototype.io = Object.freeze({
  "operation": ((cb) => {
    const name = "jaryn.json";
    const permissions = { "create": true };
    const fail = ((error) => console.log(`Error: ${error}`));

    chrome.syncFileSystem.requestFileSystem((fs) => {
      fs.root.getFile(name, permissions, cb, fail);
    });
  }),

  "readHistory": (cb) => {
    Jaryn.prototype.io.operation((fileEntry) => {
      fileEntry.file((file) => {
        const fileReader = new FileReader();
        fileReader.onload = function(e) {
          cb(JSON.parse(fileReader.result));
        };
        fileReader.readAsText(file);
      });
    });
  },

  "writeHistory": (data) => {
    Jaryn.prototype.io.operation((file) => {
      chrome.syncFileSystem.requestFileSystem((fs) => {
        file.createWriter((writer) => {
          const blob = new Blob([JSON.stringify(data)], {"type": "text/plain"});
          writer.write(blob);
        }, fail);
      });
    });
  }
});

// This only returns dummy data right now.
Jaryn.prototype.getHistory = function() {
  const today = new Date();
  var yesterday = new Date();
  yesterday.setDate(today.getDate() -1);

  return Object.freeze([{
    "id": today.getTime(),
    "date": today,
    "mood": 5,
    "feelings": [
      "ok/fine"
    ],
    "notes": "Lorim ipsom"
  },
  {
    "id": yesterday.getTime(),
    "date": yesterday,
    "mood": 5,
    "feelings": [
      "ok/fine",
      "tired"
    ],
    "notes": "Lorim ipsom"
  }]);
};
