function Simulator(){
  var self = this;
  
  
  var instructions;
  
  var InstructionPointer;
  var TempInstructionPointer;
  var MemoryAddress;
  var Instruction;
  var ram;
  var TempRegister;
  var Accumulator;
  var FlagsRegister;
  var ALU;
  var TempALUOutput;
  var Incrementor;
  var control;
  
  var clockWire;
  var dataBus;
  var instructionBus;
  
  
  var clockInterval;
  
  var listeners = {};
  var gui;
  var imageStack;
  
  
  self.addEventListener = AddEventListener;
  self.removeEventListener = RemoveEventListener;
  
  self.step = Step;
  self.run = Run;
  self.stop = Stop;
  self.reset = Reset;
  
  self.repr = REPR;
  self.getExecutionLine = GetExecutionLine;
  self.getAccumulator   = GetAccumulator;
  

  function AddEventListener(event_name, funct){
    event_name = 'on'+event_name;
    if(typeof funct != 'function') return;
    if(!listeners[event_name]) listeners[event_name] = [];
    if(listeners[event_name].indexOf(funct) > -1) return;
    listeners[event_name].push(funct);
  }
  function RemoveEventListener(event_name, funct){
    event_name = 'on'+event_name;
    if(!listeners[event_name]) return;
    listeners[event_name].splice(listeners[event_name].indexOf(funct), 1);
  }
  
  function Step(){
    if(clockWire.status()) clockWire.off(window);
    else clockWire.on(window);
    TriggerEvent('clock', {
      target: self
    });
  }
  function Run(delay){
    Stop();
    clockInterval = setInterval(Step, delay);
    Step();
  }
  function Stop(){
    clearInterval(clockInterval);
  }
  function Reset(){
    control.reset();
    InstructionPointer.reset();
    Accumulator.reset();
    FlagsRegister.reset();
    TempRegister.reset();
    TempInstructionPointer.reset();
    TempALUOutput.reset();
    ALU.reset();
    Instruction.reset();
    MemoryAddress.reset();
  }
  
  function REPR(){
    var repr = '';
    repr += 'IP      ~ ' + InstructionPointer.repr() + '\n';
    repr += 'TMP IP  ~ ' + TempInstructionPointer.repr() + '\n';
    repr += 'MEM AD  ~ ' + MemoryAddress.repr() + '\n';
    repr += 'INST    ~ ' + Instruction.repr() + '\n';
    repr += 'RAM     ~ ' + ram.repr() + '\n';
    repr += 'TMP ALU ~ ' + TempRegister.repr() + '\n';
    repr += 'ACCUM   ~ ' + Accumulator.repr() + '\n';
    repr += 'FLAGS   ~ ' + FlagsRegister.repr() + '\n';
    repr += 'ALU     ~ ' + ALU.repr() + '\n';
    repr += 'ALU OUT ~ ' + TempALUOutput.repr() + '\n';
    repr += 'INCR    ~ ' + Incrementor.repr();
    return repr;
  }
  function GetExecutionLine(){
    return InstructionPointer.value();
  }
  function GetAccumulator(){
    return Accumulator.value();
  }
  
  
  function TriggerEvent(event_name, event){
    event_name = 'on'+event_name;
    var listener_array = listeners[event_name];
    if(!listener_array) return;
    for(var i=0,listener; listener=listener_array[i++];)
      listener(event);
  }
  
  function ConnectParts(){
    var alwaysOn = new Wire();
    alwaysOn.on(self);
  
    // Clock
    clockWire = new Wire();
    
    // Control Unit
    control = new ControlUnit(true);
    control.CLOCK(clockWire);
    
    // Bus
    dataBus = CreateBus(8);
    instructionBus = CreateBus(5);
    
    // Instruction Pointer setup (with incrementor and register)
    InstructionPointer = new Register(8);
    TempInstructionPointer = new Register(8);
    Incrementor = new IncrementUnit(8);
    
    InstructionPointer.INPUT.connect(dataBus);
    InstructionPointer.OUTPUT.connect(dataBus);
    
    TempInstructionPointer.INPUT.connect(dataBus);
    TempInstructionPointer.OUTPUT.connect(Incrementor.INPUT);
    
    Incrementor.OUTPUT.connect(dataBus);
    
    control.SETIP(InstructionPointer.SET);
    control.ENABLEIP(InstructionPointer.ENABLE);
    
    control.SETINCR(TempInstructionPointer.SET);
    control.ENABLEINCR(Incrementor.ENABLE);
    
    TempInstructionPointer.ENABLE(alwaysOn);
    
    // RAM and Memory Address register
    ram = new RAM(13, instructions);
    MemoryAddress = new Register(8);
    
    ram.INPUT.connect(MemoryAddress.OUTPUT, CreateBus(5));
    ram.OUTPUT.connect(dataBus, instructionBus);
    
    MemoryAddress.INPUT.connect(dataBus);
    MemoryAddress.ENABLE(alwaysOn);
    
    control.SETMEM(MemoryAddress.SET);
    
    control.SETRAM(ram.SET);
    control.ENABLERAM(ram.ENABLE);
    
    // Instruction register
    Instruction = new Register(5);
    
    Instruction.INPUT.connect(instructionBus);
    Instruction.OUTPUT.connect(control.INST);
    
    Instruction.SET(control.SETINST);
    Instruction.ENABLE(alwaysOn);
    
    // Temporary ALU register
    TempRegister = new Register(8);
    
    TempRegister.INPUT.connect(dataBus);
    TempRegister.ENABLE(alwaysOn);
    
    control.SETTMP(TempRegister.SET);
    
    // Accumulator
    Accumulator = new Register(8);
    
    Accumulator.INPUT.connect(dataBus);
    Accumulator.ENABLE(alwaysOn);
    
    control.SETACC(Accumulator.SET);
    
    // ALU Flags register
    FlagsRegister = new Register(6);
    
    FlagsRegister.ENABLE(alwaysOn);
    
    control.ALUFLAGS.connect(FlagsRegister.OUTPUT);
    control.SETFLAGS(FlagsRegister.SET);
    
    // ALU
    ALU = new ArithmeticLogicUnit(8);
    
    ALU.A.connect(TempRegister.OUTPUT);
    ALU.B.connect(Accumulator.OUTPUT);
    ALU.FLAGS.connect(FlagsRegister.INPUT);
    
    control.ALUCTL.connect(ALU.CTL);
    
    // Temporary ALU Output
    TempALUOutput = new Register(8);

    TempALUOutput.INPUT.connect(ALU.OUTPUT);
    TempALUOutput.OUTPUT.connect(dataBus);

    control.ALUTEMPSET(TempALUOutput.SET);
    control.ALUTEMPENABLE(TempALUOutput.ENABLE);
  }
  function ConnectGUI(){
    var pins = dataBus.pins();
    pins[0].listen(SetGuiImageClosure(gui.databus1  , pins[0]));
    pins[1].listen(SetGuiImageClosure(gui.databus2  , pins[1]));
    pins[2].listen(SetGuiImageClosure(gui.databus4  , pins[2]));
    pins[3].listen(SetGuiImageClosure(gui.databus8  , pins[3]));
    pins[4].listen(SetGuiImageClosure(gui.databus16 , pins[4]));
    pins[5].listen(SetGuiImageClosure(gui.databus32 , pins[5]));
    pins[6].listen(SetGuiImageClosure(gui.databus64 , pins[6]));
    pins[7].listen(SetGuiImageClosure(gui.databus128, pins[7]));
    
    var pins = instructionBus.pins();
    pins[0].listen(SetGuiImageClosure(gui.instbus1  , pins[0]));
    pins[1].listen(SetGuiImageClosure(gui.instbus2  , pins[1]));
    pins[2].listen(SetGuiImageClosure(gui.instbus4  , pins[2]));
    pins[3].listen(SetGuiImageClosure(gui.instbus8  , pins[3]));
    pins[4].listen(SetGuiImageClosure(gui.instbus16 , pins[4]));
    
    ConnectGuiToPinGroup(MemoryAddress.OUTPUT, [
      'ramadd1'  ,
      'ramadd2'  ,
      'ramadd4'  ,
      'ramadd8'  ,
      'ramadd16' ,
      'ramadd32' ,
      'ramadd64' ,
      'ramadd128'
    ]);
    
    ConnectGuiToPinGroup(Instruction.OUTPUT, [
      'instruction1'  ,
      'instruction2'  ,
      'instruction4'  ,
      'instruction8'  ,
      'instruction16' 
    ]);
    
    ConnectGuiToPinGroup(ALU.OUTPUT, [
      'aluout1'  ,
      'aluout2'  ,
      'aluout4'  ,
      'aluout8'  ,
      'aluout16' ,
      'aluout32' ,
      'aluout64' ,
      'aluout128'
    ]);
    
    ConnectGuiToPinGroup(Accumulator.OUTPUT, [
      'acc1'   ,
      'acc2'   ,
      'acc4'   ,
      'acc8'   ,
      'acc16'  ,
      'acc32'  ,
      'acc64'  ,
      'acc128' 
    ]);
    
    ConnectGuiToPinGroup(TempRegister.OUTPUT, [
      'temp1'   ,
      'temp2'   ,
      'temp4'   ,
      'temp8'   ,
      'temp16'  ,
      'temp32'  ,
      'temp64'  ,
      'temp128' 
    ]);
    
    ConnectGuiToPinGroup(ALU.CTL, [
      'alucontrol1',
      'alucontrol2',
      'alucontrol4',
      'alucontrol8'
    ]);
    
    ConnectGuiToPinGroup(ALU.FLAGS, [
      'aluflags1' ,
      'aluflags2' ,
      'aluflags4' ,
      'aluflags8' ,
      'aluflags16',
      'aluflags32'
    ]);
    
    ConnectGuiToPinGroup(FlagsRegister.OUTPUT, [
      'flagsregister1' ,
      'flagsregister2' ,
      'flagsregister4' ,
      'flagsregister8' ,
      'flagsregister16',
      'flagsregister32'
    ]);
    
    ConnectGuiToPinGroup(TempInstructionPointer.OUTPUT, [
      'incr1'   ,
      'incr2'   ,
      'incr4'   ,
      'incr8'   ,
      'incr16'  ,
      'incr32'  ,
      'incr64'  ,
      'incr128' 
    ]);
    
    ConnectPinToGui(Incrementor.ENABLE, 'increnable');
    ConnectPinToGui(TempInstructionPointer.SET, 'tempipset');
    ConnectPinToGui(InstructionPointer.SET, 'ipset');
    ConnectPinToGui(InstructionPointer.ENABLE, 'ipenable');
    ConnectPinToGui(TempRegister.SET, 'tempset');
    ConnectPinToGui(Accumulator.SET, 'accset');
    ConnectPinToGui(TempALUOutput.SET, 'aluoutset');
    ConnectPinToGui(TempALUOutput.ENABLE, 'aluoutenable');
    ConnectPinToGui(FlagsRegister.SET, 'flagsset');
    ConnectPinToGui(Instruction.SET, 'instructionset');
    ConnectPinToGui(MemoryAddress.SET, 'ramaddset');
    ConnectPinToGui(ram.SET, 'ramset');
    ConnectPinToGui(ram.ENABLE, 'ramenable');
  }
  function ConnectPinToGui(pin, guiWire){
    var wire = pin.getWire();
    wire.listen(SetGuiImageClosure(gui[guiWire], wire));
  }
  function ConnectGuiToPinGroup(group, guiWires){
    var pins = group.pins();
    for(var i=0,guiWire; guiWire=guiWires[i++];){
      var wire = pins[i-1].getWire();
      wire.listen(SetGuiImageClosure(gui[guiWire], wire));
    }
  }
  function SetGuiImageClosure(){
    var args = arguments;
    return function(){
      return SetGuiImage.apply(this, args);
    }
  }
  function SetGuiImage(imageObj, wire){
    var stat = wire.status();
    if(stat) imageObj.on();
    else imageObj.off();
  }
  
  
  (function Constructor(code, guiWires, _imageStack){
    instructions = GetMachineCode(code);
    gui = guiWires;
    imageStack = _imageStack;
    ConnectParts();
    ConnectGUI();
  }).apply(self, arguments);
}