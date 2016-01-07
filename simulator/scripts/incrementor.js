function IncrementUnit(){
  var self = this;
  var undefined;
  
  
  var pins = new PinGroup(self);
  var inputGroup;
  var outputGroup;
  
  
  self.ENABLE = pins.init('ENABLE', Update);
  
  self.repr = Repr;
  
  
  function Repr(){
    var input = inputGroup.read();
    var output = outputGroup.read();
    return 'IncrementUnit(in: '+input+'; out: '+output+'; enabled: '+pins.read('ENABLE')+')';
  }
  
  
  function Update(){
    if(pins.read('ENABLE'))
      outputGroup.write(inputGroup.read() + 1);
    else
      outputGroup.write(0);
  }
  
  
  (function Constructor(refBitSize){
    if(refBitSize === undefined)
      throw 'refBitSize required for IncrementUnit initialization';
    
    inputGroup = [];
    outputGroup = [];
    
    var inputConnector = [];
    var outputConnector = [];
    
    for(var i=0; i<refBitSize; i++){
      self['IN'+i] = pins.init('IN'+i, Update);
      self['OUT'+i] = pins.init('OUT'+i, Update);
      inputConnector.push(self['IN'+i]);
      outputConnector.push(self['OUT'+i]);
      inputGroup.push('IN'+i);
      outputGroup.push('OUT'+i);
    }
    
    inputGroup = new BinaryPinGroup(pins, inputGroup);
    outputGroup = new BinaryPinGroup(pins, outputGroup);
    
    self.INPUT = new PinConnector(inputConnector);
    self.OUTPUT = new PinConnector(outputConnector);
  }).apply(self, arguments);
}


function TestIncrementUnit(){
  var inc = new IncrementUnit(4);
  
  var in0 = new Wire();
  var in1 = new Wire();
  var in2 = new Wire();
  var in3 = new Wire();
  
  var out0 = new Wire();
  var out1 = new Wire();
  var out2 = new Wire();
  var out3 = new Wire();
  
  var wenable = new Wire();
  wenable.on(window);
  
  var input = new PinConnector([in0, in1, in2, in3]);
  var output = new PinConnector([out0, out1, out2, out3]);
  
  inc.INPUT.connect(input);
  inc.OUTPUT.connect(output);
  
  inc.ENABLE(wenable);
  
  console.log(inc.repr());
  
  in0.on(window);
  in3.on(window);
  
  console.log(inc.repr());
  
  in1.on(window);
  in2.on(window);
  
  console.log(inc.repr());
}