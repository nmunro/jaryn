const DateUtil = Object.freeze(Object.create({
  /**
   * Use this function for display purposes only.
   * @param Number offset Number of days to deduct from the current timestamp.
   */
  "getYYYYMMDD": function(offset) {
    const date = new Date();
    
    if(offset) date.setDate(date.getDate()-offset);
    
    return {
      "year": `${date.getFullYear()}`,
      "month": `${this.zeroPad(date.getMonth()+1)}`,
      "day": `${this.zeroPad(date.getDate())}`
    };
  },
  
  /**
   * If a value is in the single digits then it's prefixed with a zero.
   * @param Number num Number to prepend with 0 if < 10.
   */
  "zeroPad": function(num) {
    return (num < 10) ? `0${num}` : num;  
  },
  
  /**
   * Use this function for getting and calculating a date.
   */
  "getDate": function() {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  },
  
  "parse": function(obj) {
    const date = new Date(0);  
    date.setYear(obj.year);
    date.setMonth(parseInt(obj.month-1, 10));
    date.setDate(obj.day);
    return date;
  }
}));