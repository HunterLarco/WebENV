function Wire(){
  var self = this;
  
  
  var stat = [];
  var listeners = [];
  
  
  self.on = On;
  self.off = Off;
  self.status = Status;
  
  self.listen = Listen;
  self.unlisten = Unlisten;
  
  
  function On(parent){
    if(stat.indexOf(parent) !== -1)
      return;
    var oldStatus = Status();
    stat.push(parent);
    if (oldStatus != Status())
      PropogateChange();
  }
  function Off(parent){
    var index = stat.indexOf(parent);
    if(index === -1)
      return;
    var oldStatus = Status();
    stat.splice(index, 1);
    if (oldStatus != Status())
      PropogateChange();
  }
  function Status(){
    return stat.length > 0 ? 1 : 0;
  }
  
  function Listen(funct){
    if(listeners.indexOf(funct) !== -1) return;
    listeners.push(funct);
  }
  function Unlisten(funct){
    var index = listeners.indexOf(funct);
    if(index === -1) return;
    listeners.splice(index, 1);
  }
  function PropogateChange(){
    for(var i=0; i<listeners.length; i++)
      listeners[i]();
  }
  
  
  (function Constructor(){}).apply(self, arguments);
}