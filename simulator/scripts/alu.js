function ArithmeticLogicUnit(){
  var self = this;
  
  
  var refBitSize;
  var pins = new PinGroup(self);
  var inputA, inputB, output;
  // controlPins will be replaced with a BinaryPinGroup
  var controlPins = ['CTL0', 'CTL1', 'CTL2', 'CTL3'];
  
  
  self.reset = function Reset(){
    pins.writeAll(0);
  }
  
  
  self.FLAG0 = pins.init('FLAG0', new Function());
  self.FLAG1 = pins.init('FLAG1', new Function());
  self.FLAG2 = pins.init('FLAG2', new Function());
  self.FLAG3 = pins.init('FLAG3', new Function());
  self.FLAG4 = pins.init('FLAG4', new Function());
  self.FLAG5 = pins.init('FLAG5', new Function());
  self.FLAGS = new PinConnector([
    self.FLAG0,
    self.FLAG1,
    self.FLAG2,
    self.FLAG3,
    self.FLAG4,
    self.FLAG5
  ]);
  
  
  self.repr = Repr;
  
  
  function Repr(){
    return 'ALU(A: '+inputA.read()+'; B: '+inputB.read()+'; OUT: '+output.read()+'; F0: '+pins.read('FLAG0')+'; F1: '+pins.read('FLAG1')+'; F2: '+pins.read('FLAG2')+'; F3: '+pins.read('FLAG3')+'; F4: '+pins.read('FLAG4')+'; F5: '+pins.read('FLAG5')+'; CTL: '+controlPins.read()+')';
  }
  
  
  function Update(){
    ClearFlags();
    
    switch(controlPins.read()){
      case  0: DoAdd(); break;
      case  1: DoSub(); break;
      case  2: DoMul(); break;
      case  3: DoDiv(); break;
      case  4: DoMod(); break;
      case  5: DoCMP(); break;
      case  6: DoLShift(); break;
      case  7: DoRShift(); break;
      case  8: DoAnd(); break;
      case  9: DoOr(); break;
      case 10: DoNot(); break;
      case 11: DoXor(); break;
      case 12: DoAccPass(); break;
      case 13: DoTMPPass(); break;
      case 14: break;
      case 15: break;
    }
    
    CalculateIndependentFlags();
  }
  function ClearFlags(){
    pins.write('FLAG0', 0);
    pins.write('FLAG1', 0);
    pins.write('FLAG2', 0);
    pins.write('FLAG3', 0);
    pins.write('FLAG4', 0);
    pins.write('FLAG5', 0);
  }
  function CalculateIndependentFlags(){
    var A = inputA.read();
    var B = inputB.read();
    var O = output.read();
    
    if (O === 0) pins.write('FLAG1', 1);
    if (A  >  B) pins.write('FLAG5', 1);
    if (A === B) pins.write('FLAG4', 1);
  }
  function WriteOutput(out){
    if (output.write(out))
      pins.write('FLAG0', 1);
  }
  
  function DoAdd(){
    var A = inputA.read();
    var B = inputB.read();
    var out = B + A;
    
    WriteOutput(out);
  }
  function DoSub(){
    var A = inputA.read();
    var B = inputB.read();
    var out = Math.abs(B - A);
    
    if (B - A < 0) pins.write('FLAG2', 1);
    
    WriteOutput(out);
  }
  function DoMul(){
    var A = inputA.read();
    var B = inputB.read();
    var out = B * A;
    
    WriteOutput(out);
  }
  function DoDiv(){
    var A = inputA.read();
    var B = inputB.read();
    
    if (A === 0){
      output.write(0);
      pins.write('FLAG3', 1);
      return;
    }
    
    var out = Math.floor(B / A);
    WriteOutput(out);
  }
  function DoMod(){
    var A = inputA.read();
    var B = inputB.read();
    
    if (A === 0){
      output.write(0);
      pins.write('FLAG3', 1);
      return;
    }
    
    var out = B % A;
    WriteOutput(out);
  }
  function DoCMP(){
    output.write(0);
  }
  function DoLShift(){
    var A = inputA.read();
    var B = inputB.read();
    var out = B << A;
    
    WriteOutput(out);
  }
  function DoRShift(){
    var A = inputA.read();
    var B = inputB.read();
    var out = B >> A;
    
    WriteOutput(out);
  }
  function DoAnd(){
    var A = inputA.read();
    var B = inputB.read();
    var out = B & A;
    
    WriteOutput(out);
  }
  function DoOr(){
    var A = inputA.read();
    var B = inputB.read();
    var out = B | A;
    
    WriteOutput(out);
  }
  function DoNot(){
    var B = inputB.read();
    var filled = (1 << refBitSize) - 1;
    var out = B ^ filled;
    
    WriteOutput(out);
  }
  function DoXor(){
    var A = inputA.read();
    var B = inputB.read();
    var out = B ^ A;
    
    WriteOutput(out);
  }
  function DoAccPass(){
    var B = inputB.read();
    WriteOutput(B);
  }
  function DoTMPPass(){
    var A = inputA.read();
    WriteOutput(A);
  }
  
  
  (function Constructor(_refBitSize){
    if(_refBitSize === undefined)
      throw 'refBitSize required for ALU initialization';
    
    refBitSize = _refBitSize;
    
    inputA = [];
    inputB = [];
    output = [];
    
    var inputAConnector = [];
    var inputBConnector = [];
    var outputConnector = [];
    
    for(var i=0; i<refBitSize; i++){
      self['A'+i] = pins.init('A'+i, Update);
      self['B'+i] = pins.init('B'+i, Update);
      self['OUT'+i] = pins.init('OUT'+i, Update);
      inputA.push('A'+i);
      inputB.push('B'+i);
      output.push('OUT'+i);
      inputAConnector.push(self['A'+i]);
      inputBConnector.push(self['B'+i]);
      outputConnector.push(self['OUT'+i]);
    }
    
    inputA = new BinaryPinGroup(pins, inputA);
    inputB = new BinaryPinGroup(pins, inputB);
    output = new BinaryPinGroup(pins, output);
    
    self.A = new PinConnector(inputAConnector);
    self.B = new PinConnector(inputBConnector);
    self.OUTPUT = new PinConnector(outputConnector);
    
    var controlPinsConnector = [];
    for(var i=0,controlPin; controlPin=controlPins[i++];){
      self[controlPin] = pins.init(controlPin, Update);
      controlPinsConnector.push(self[controlPin]);
    }
    controlPins = new BinaryPinGroup(pins, controlPins);
    self.CTL = new PinConnector(controlPinsConnector);
    
    Update();
  }).apply(self, arguments);
}


function TestArithmeticLogicUnit(){
  var alu = new ArithmeticLogicUnit(3);
  
  var a0 = new Wire();
  var a1 = new Wire();
  var a2 = new Wire();
  
  var b0 = new Wire();
  var b1 = new Wire();
  var b2 = new Wire();
  
  var c0 = new Wire();
  var c1 = new Wire();
  var c2 = new Wire();
  var c3 = new Wire();
  
  var A = new PinConnector([a0, a1, a2]);
  var B = new PinConnector([b0, b1, b2]);
  var CTL = new PinConnector([c0, c1, c2, c3]);
  
  alu.A.connect(A);
  alu.B.connect(B);
  alu.CTL.connect(CTL);
  
  console.log(alu.repr());
  
  // write 3 to CTL
  c0.on(window);
  c1.on(window);
  
  // write 5 to A
  a0.on(window);
  a2.on(window);
  
  // write 2 to B
  b1.on(window);
  
  console.log(alu.repr());
  
  return;
  // past this point haven't made necessary changes
  
  CTL.write(8);
  B.write(3);
  
  console.log(alu.repr());
  
  CTL.write(13);
  
  console.log(alu.repr());
}