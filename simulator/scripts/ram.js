function RAM(){
  var self = this;
  var undefined;
  
  
  var mem = {};
  
  var pins = new PinGroup(self);
  var inputGroup;
  var outputGroup;
  
  
  self.SET = pins.init('SET', Update);
  self.ENABLE = pins.init('ENABLE', Update);
  
  self.repr = Repr;
  
  
  function Repr(){
    return 'RAM(in: '+inputGroup.read()+'; out: '+outputGroup.read()+'; enabled: '+pins.read('ENABLE')+')';
  }
  
  
  function Update(){
    if(! pins.read('ENABLE'))
      DoClearValue();
    
    if(pins.read('SET'))
      DoSet();
    else if(pins.read('ENABLE'))
      DoEnable();
  }
  function DoEnable(){
    var savedValue = mem[inputGroup.read()];
    if (savedValue === undefined)
      savedValue = 0;
    
    outputGroup.write(savedValue);
  }
  function DoSet(){
    mem[inputGroup.read()] = outputGroup.read();
  }
  function DoClearValue(){
    outputGroup.write(0);
  }
  
  
  (function Constructor(refBitSize, instructions){
    if(refBitSize === undefined)
      throw 'refBitSize required for Register initialization';
    if(instructions === undefined)
      instructions = [];
    
    for(var i=0; i<instructions.length; i++)
      mem[i] = instructions[i];
    
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


function TestRAM(){
  var ram = new RAM(4);
  
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
  
  ram.INPUT.connect(input);
  ram.OUTPUT.connect(output);
  
  ram.SET(wset);
  ram.ENABLE(wenable);
  
  // in: 0000; out: 0000
  console.log(ram.repr());
  
  in0.on(window);
  in2.on(window);
  wenable.on(window);
  
  // in: 1010; out: 0000
  console.log(ram.repr());
  
  out0.on(window);
  out1.on(window);
  out2.on(window);
  
  // in: 1010; out: 1110
  console.log(ram.repr());
  
  wset.on(window);
  wset.off(window);
  
  out0.off(window);
  out1.off(window);
  out2.off(window);
  
  // in: 1010; out: 1110
  console.log(ram.repr());
  
  in3.on(window);
  
  // in: 1010; out: 0000
  console.log(ram.repr());
  
  in3.off(window);
  
  // in: 1010; out: 1110
  console.log(ram.repr());
}