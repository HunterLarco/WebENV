function Register(){
  var self = this;
  var undefined;
  
  
  var savedValue = 0;
  
  var pins = new PinGroup(self);
  var inputGroup;
  var outputGroup;
  
  
  self.SET = pins.init('SET', Update);
  self.ENABLE = pins.init('ENABLE', Update);
  
  self.reset = Reset;
  
  self.repr = Repr;
  self.value = GetValue;
  
  
  function Reset(){
    savedValue = 0;
    pins.writeAll(0);
  }
  
  function Repr(){
    var input = inputGroup.read();
    var output = outputGroup.read();
    var saved = savedValue;
    return 'Register(in: '+input+'; out: '+output+'; saved: '+saved+'; enabled: '+pins.read('ENABLE')+')';
  }
  function GetValue(){
    return savedValue;
  }
  
  
  function Update(){
    if(pins.read('SET'))
      DoSetValue();
    if(pins.read('ENABLE'))
      DoEnableValue();
    else
      DoClearValue();
  }
  function DoSetValue(){
    savedValue = inputGroup.read();
  }
  function DoEnableValue(){
    outputGroup.write(savedValue);
  }
  function DoClearValue(){
    outputGroup.write(0);
  }
  
  
  (function Constructor(refBitSize){
    if(refBitSize === undefined)
      throw 'refBitSize required for Register initialization';
    
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


function TestRegister(){
  var register = new Register(4);
  
  var in0 = new Wire();
  var in1 = new Wire();
  var in2 = new Wire();
  var in3 = new Wire();
  
  var out0 = new Wire();
  var out1 = new Wire();
  var out2 = new Wire();
  var out3 = new Wire();
  
  var wset = new Wire();
  var wenable = new Wire();
  
  var input = new PinConnector([in0, in1, in2, in3]);
  var output = new PinConnector([out0, out1, out2, out3]);
  
  register.INPUT.connect(input);
  register.OUTPUT.connect(output);
  
  register.SET(wset);
  register.ENABLE(wenable);
  
  // in: 0000; out: 0000; saved: 0000
  console.log(register.repr());
  
  in0.on(window);
  in2.on(window);
  
  // in: 1010; out: 0000; saved: 0000
  console.log(register.repr());
  
  wenable.on(window);
  
  // in: 1010; out: 0000; saved: 0000
  console.log(register.repr());
  
  wset.on(window);
  
  // in: 1010; out: 1010; saved: 1010
  console.log(register.repr());
  
  wset.off(window);
  in0.off(window);
  in3.on(window);
  
  // in: 0011; out: 1010; saved: 1010
  console.log(register.repr());
  
  wenable.off(window);
  
  // in: 0011; out: 0000; saved: 1010
  console.log(register.repr());
}