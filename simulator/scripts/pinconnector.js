function PinConnector(){
  var self = this;
  var undefined;
  
  
  var pins;
  
  
  self.connect = Connect;
  self.size = Size;
  self.pins = Pins;
  
  
  function Connect(){
    var connectors = arguments;
    
    var pinsum = 0;
    for(var i=0; i<connectors.length; i++){
      var connector = connectors[i];
      if (! (connector instanceof PinConnector))
        throw 'PinConnector can only connect to other PinConnector instances';
      pinsum += connector.size();
    }
    
    if (pinsum != pins.length)
      throw 'PinConnector cannot connect. Too many or too few pins provided';
    
    var pinIndex = 0;
    for(var i=0; i<connectors.length; i++){
      var connector = connectors[i];
      var connectorPins = connector.pins();
      for(var j=0; j<connectorPins.length; j++){
        var connectorPin = connectorPins[j];
        var pin = pins[pinIndex++];
        pin(connectorPin);
      }
    }
  }
  function Size(){
    return pins.length;
  }
  function Pins(){
    return pins.concat([]);
  }
  
  
  (function Constructor(_pins){
    if(_pins === undefined)
      throw 'PinConnector requires pins to initialize';
    
    pins = _pins;
  }).apply(self, arguments);
}