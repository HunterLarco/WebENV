function PinGroup(){
  var self = this;
  var undefined;
  
  
  var pins = {}
  var device;
  
  
  self.write = Write;
  self.read = Read;
  self.init = Init;
  
  self.writeAll = WriteAll;
  
  self.list = List;
  self.repr = Repr;
  self.print = Print;
  
  
  function Write(label, value){
    if(label === undefined) throw 'PinGroup Write requires label';
    value = parseInt(value);
    
    ThrowExists(label);
    var old = pins[label].status();
    
    if (value > 0) pins[label].on(device);
    else pins[label].off(device);
    
    return old;
  }
  function Read(label){
    if(label === undefined) throw 'PinGroup Read requires label';
    
    ThrowExists(label);
    return pins[label].status();
  }
  function Init(label, listener){
    if(listener === undefined) throw 'PinGroup Init requires listener';
    if(label === undefined) throw 'PinGroup Init requires label';
    
    pins[label] = new Wire();
  
    function SetPin(obj){
      if(obj instanceof Wire) return ConnectWire(obj);
      else if(typeof obj === 'function') return ConnectPin(obj);
      throw 'Unknown obj tried to connected to pin';
    }
    SetPin.getWire = function GetWire(){
      return pins[label];
    }
    
    return SetPin;
    
    function ConnectWire(wire){
      var oldWire = pins[label];
      
      pins[label].unlisten(listener);
      pins[label] = wire;
      pins[label].listen(listener);
      
      if(oldWire.status() != wire.status())
        listener();
    }
    function ConnectPin(pin){
      var wire = new Wire();
      pin(wire);
      ConnectWire(wire);
    }
  }
  
  function WriteAll(value){
    for(var label in pins)
      Write(label, value);
  }
  
  function List(){
    var list = [];
    
    for(var pin in pins)
      list.push(pin);
    
    return list;
  }
  function Repr(){
    var output = [];
    
    for(var pin in pins){
      var value = pins[pin].status();
      output.push('PIN '+pin+' = '+value);
    }
    
    output.sort();
    return output.join('\n');
  }
  function Print(){
    console.groupCollapsed('PIN Group');
    
    var lines = Repr().split('\n');
    for(var i=0; i<lines.length; i++){
      var line = lines[i];
      console.log(line);
    }
    
    console.groupEnd();
  }
  
  
  function ThrowExists(label){
    if(Exists(label)) return true;
    throw 'PIN \''+label+'\' does not exists on device.';
  }
  function Exists(label){
    return pins[label] !== undefined;
  }
  
  
  (function Constructor(_device){
    if(_device === undefined)
      throw 'Device required for PinGroup initialization.';
    device = _device;
  }).apply(self, arguments);
}