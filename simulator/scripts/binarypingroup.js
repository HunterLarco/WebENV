function BinaryPinGroup(){
  var self = this;
  var undefined;
  
  
  var pinGroup;
  var pins;
  
  
  self.pins = Pins;
  
  self.read = Read;
  self.write = Write;
  
  
  function Pins(){
    return pins;
  }
  function Read(){
    var groupValue = 0;
    
    for(var i=0; i<pins.length; i++){
      var pin = pins[i];
      var pinValue = pinGroup.read(pin);
      groupValue |= pinValue << i;
    }
    
    return groupValue;
  }
  // returns bool (true if overflow)
  function Write(value){
    if (value === undefined || typeof value != 'number' || value % 1 != 0 || value < 0)
      throw 'BinaryPinGroup Write method requires a positive integer value';
    
    for(var i=0; i<pins.length; i++){
      var pin = pins[i];
      var pinValue = value & (1 << i);
      pinGroup.write(pin, pinValue);
    }
    
    return value >= (1 << pins.length);
  }
  
  
  (function Constructor(_pinGroup, _pins){
    if(_pinGroup === undefined)
      throw 'PinGroup required for BinaryPinGroup initialization.';
    if(_pins === undefined)
      throw 'Pins Array required for BinaryPinGroup initialization.';
    
    pinGroup = _pinGroup;
    pins = _pins;
  }).apply(self, arguments);
}