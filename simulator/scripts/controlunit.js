function ControlUnit(){
  var self = this;
  var undefined;
  
  
  self.reset = function Reset(){
    executionStack = [];
    JumpToNextInstruction();
    pins.writeAll(0);
  }
  
  
  var console = {
    groupEnd: window.console.groupEnd.bind(window.console),
    group: window.console.group.bind(window.console),
    info: window.console.info.bind(window.console)
  }
  
  var pins = new PinGroup(self);
  var instruction;
  var alucontrol;
  
  var catalog = {
    Load: [
      DoLoad,
      SetMemAddressToTemp,
      SetAccumulatorToMemAddress,
      CloseSetAccumulatorToMemAddress
    ],
    Store: [
      DoStore,
      SetMemAddressToTemp,
      LoadAccumulatorIntoRam,
      CloseStorage
    ],
    Add: [
      SetAddOperator
    ],
    Sub: [
      SetSubOperator
    ],
    Mul: [
      SetMulOperator
    ],
    Div: [
      SetDivOperator
    ],
    Mod: [
      SetModOperator
    ],
    CMP: [
      SetCMPOperator
    ],
    LShift: [
      SetLShiftOperator
    ],
    RShift: [
      SetRShiftOperator
    ],
    And: [
      SetAndOperator
    ],
    Or: [
      SetOrOperator
    ],
    Not: [
      SetNotOperator
    ],
    Xor: [
      SetXorOperator
    ],
    Jump: [
      SetInstructionPointerToTemp,
      DoCloseTempStorage,
      JumpToNextInstruction
    ],
    JumpGT: [
      DoJumpGT
    ],
    JumpEQ: [
      DoJumpEQ
    ],
    JumpLT: [
      DoJumpLT
    ],
    End: [
      DoEndExecution
    ]
  };
  var microPrograms = {
    IncrementInstructionPointer: [
      SetTempInstructionPointer,
      IncrementSetInstructionPointer,
      CloseIncrementInstructionPointer
    ],
    LoadInstruction: [
      SetMemAddress,
      SetInstruction,
      CloseSetInstruction
    ],
    ExecuteALU: [
      SaveALUResultToRegister,
      MoveALURegisterToAccumulator,
      CloseAccumulatorALUSet
    ],
    ExecuteInstruction: [
      InterpretInstruction
    ]
  };
  
  var executionStack = [];
  JumpToNextInstruction();
  
  function SetupPins(){
    self.CLOCK = pins.init('CLOCK', OnClock);
    
    self.SETMEM = pins.init('SETMEM', Update);
    
    self.SETRAM = pins.init('SETRAM', Update);
    self.ENABLERAM = pins.init('ENABLERAM', Update);
    
    self.SETINST = pins.init('SETINST', Update);
    
    self.SETIP = pins.init('SETIP', Update);
    self.ENABLEIP = pins.init('ENABLEIP', Update);
    self.SETINCR = pins.init('SETINCR', Update);
    self.ENABLEINCR = pins.init('ENABLEINCR', Update);
    
    self.SETFLAGS = pins.init('SETFLAGS', Update);
    
    self.ALUCTL0 = pins.init('ALUCTL0', Update);
    self.ALUCTL1 = pins.init('ALUCTL1', Update);
    self.ALUCTL2 = pins.init('ALUCTL2', Update);
    self.ALUCTL3 = pins.init('ALUCTL3', Update);
    self.ALUCTL  = new PinConnector([
      self.ALUCTL0,
      self.ALUCTL1,
      self.ALUCTL2,
      self.ALUCTL3
    ]);
    alucontrol = new BinaryPinGroup(pins, [
      'ALUCTL0',
      'ALUCTL1',
      'ALUCTL2',
      'ALUCTL3'
    ]);
    
    self.ALUTEMPSET = pins.init('ALUTEMPSET', Update);
    self.ALUTEMPENABLE = pins.init('ALUTEMPENABLE', Update);
    
    self.ALUFLAG0 = pins.init('ALUFLAG0', Update);
    self.ALUFLAG1 = pins.init('ALUFLAG1', Update);
    self.ALUFLAG2 = pins.init('ALUFLAG2', Update);
    self.ALUFLAG3 = pins.init('ALUFLAG3', Update);
    self.ALUFLAG4 = pins.init('ALUFLAG4', Update);
    self.ALUFLAG5 = pins.init('ALUFLAG5', Update);
    self.ALUFLAGS = new PinConnector([
      self.ALUFLAG0,
      self.ALUFLAG1,
      self.ALUFLAG2,
      self.ALUFLAG3,
      self.ALUFLAG4,
      self.ALUFLAG5
    ]);
        
    self.SETTMP = pins.init('SETTMP', Update);
    self.SETACC = pins.init('SETACC', Update);
    
    self.INST0 = pins.init('INST0', Update);
    self.INST1 = pins.init('INST1', Update);
    self.INST2 = pins.init('INST2', Update);
    self.INST3 = pins.init('INST3', Update);
    self.INST4 = pins.init('INST4', Update);
    self.INST  = new PinConnector([
      self.INST0,
      self.INST1,
      self.INST2,
      self.INST3,
      self.INST4
    ]);
    instruction = new BinaryPinGroup(pins, [
      'INST0',
      'INST1',
      'INST2',
      'INST3',
      'INST4'
    ]);
    
    alucontrol = new BinaryPinGroup(pins, ['ALUCTL0', 'ALUCTL1', 'ALUCTL2', 'ALUCTL3']);
    instruction = new BinaryPinGroup(pins, ['INST0', 'INST1', 'INST2', 'INST3', 'INST4']);
  }
  
  
  function Update(){}
  
  function OnClock(){
    var currentBlock = executionStack.shift();
    if (currentBlock !== undefined)
      currentBlock();
  }
  function IncrementToNextInstruction(){
    executionStack = executionStack.concat(microPrograms.IncrementInstructionPointer).concat(microPrograms.LoadInstruction).concat(microPrograms.ExecuteInstruction);
  }
  function JumpToNextInstruction(){
    executionStack = executionStack.concat(microPrograms.LoadInstruction).concat(microPrograms.ExecuteInstruction);
  }
  function ExecuteALUOperation(){
    executionStack = executionStack.concat(microPrograms.ExecuteALU);
    OnClock();
  }
  
  
  
  // Micro Program to Increment Instruction Pointer
  function SetTempInstructionPointer(){
    console.group('Increment Instruction Pointer');
    console.info('Set temporary instruction pointer');
    
    pins.write('ENABLEIP', 1);
    pins.write('SETINCR', 1);
  }
  function IncrementSetInstructionPointer(){
    console.info('Set instruction pointer to incremented value');
    
    pins.write('SETINCR', 0);
    pins.write('ENABLEIP', 0);
    pins.write('ENABLEINCR', 1);
    pins.write('SETIP', 1);
  }
  function CloseIncrementInstructionPointer(){
    console.info('Close instruction pointer incrementation connections');
    console.groupEnd();
    
    pins.write('SETIP', 0);
    pins.write('ENABLEINCR', 0);
  }
  
  // Micro Program to load current instruction using address in instruction pointer register
  function SetMemAddress(){
    console.group('Load Current Instruction');
    console.info('Set memory address register to instruction pointer');
    
    pins.write('ENABLEIP', 1);
    pins.write('SETMEM', 1);
  }
  function SetInstruction(){
    console.info('Load next instruction from ram (sets ALU temp register with data and instruction register)');
    
    pins.write('SETMEM', 0);
    pins.write('ENABLEIP', 0);
    pins.write('ENABLERAM', 1);
    pins.write('SETINST', 1);
    pins.write('SETTMP', 1);
  }
  function CloseSetInstruction(){
    console.info('Close instruction feed from RAM (already in register)');
    console.groupEnd();
    
    pins.write('SETTMP', 0);
    pins.write('SETINST', 0);
    pins.write('ENABLERAM', 0);
  }
  
  // Micro Program to execute ALU and save result in accumulator and save flags
  function SaveALUResultToRegister(){
    console.group('Execute ALU');
    console.info('Moving ALU result to temporary ALU output register (also saving flags to flags register)');
    
    pins.write('ALUTEMPSET', 1);
    pins.write('SETFLAGS', 1);
  }
  function MoveALURegisterToAccumulator(){
    console.info('Moving temporary ALU output register data to accumulator');
    
    pins.write('SETFLAGS', 0);
    pins.write('ALUTEMPSET', 0);
    pins.write('ALUTEMPENABLE', 1);
    pins.write('SETACC', 1);
  }
  function CloseAccumulatorALUSet(){
    console.info('Closing closing transaction to accumulator from ALU temp output');
    console.groupEnd();
    
    pins.write('SETACC', 0);
    pins.write('ALUTEMPENABLE', 0);
  }
  
  // Micro Program to interpret the current instruction
  function InterpretInstruction(){
    var action;
    
    switch(instruction.read()){
      case 0:  action = catalog.Load; break;
      case 1:  action = catalog.Store; break;
      case 2:  action = catalog.Add; break;
      case 3:  action = catalog.Sub; break;
      case 4:  action = catalog.Mul; break;
      case 5:  action = catalog.Div; break;
      case 6:  action = catalog.Mod; break;
      case 7:  action = catalog.CMP; break;
      case 8:  action = catalog.LShift; break;
      case 9:  action = catalog.RShift; break;
      case 10: action = catalog.And; break;
      case 11: action = catalog.Or; break;
      case 12: action = catalog.Not; break;
      case 13: action = catalog.Xor; break;
      case 14: action = catalog.Jump; break;
      case 15: action = catalog.JumpGT; break;
      case 16: action = catalog.JumpEQ; break;
      case 17: action = catalog.JumpLT; break;
      case 31: action = catalog.End; break;
      default: action = [];
    }
    
    executionStack = executionStack.concat(action);
    OnClock();
  }
  
  // LOAD command
  function DoLoad(){
    console.group('cmd: LOAD');
    OnClock();
  }
  function SetMemAddressToTemp(){
    console.info('Moving temp register to Memory Address register');
    
    // feed temp through (data from current instruction)
    alucontrol.write(13);
    pins.write('ALUTEMPENABLE', 1);
    pins.write('ALUTEMPSET', 1);
    pins.write('SETMEM', 1);
  }
  function SetAccumulatorToMemAddress(){
    console.info('Set accumulator to memory at the memory address register');
    
    pins.write('SETMEM', 0);
    pins.write('ALUTEMPSET', 0);
    pins.write('ALUTEMPENABLE', 0);
    pins.write('ENABLERAM', 1);
    pins.write('SETACC', 1);
  }
  function CloseSetAccumulatorToMemAddress(){
    console.info('Close data feed from RAM');
    console.groupEnd();

    pins.write('SETACC', 0);
    pins.write('ENABLERAM', 0);
    
    
    IncrementToNextInstruction();
  }
  
  // STORE command
  function DoStore(){
    console.group('cmd: STORE');
    OnClock();
  }
  function LoadAccumulatorIntoRam(){
    console.info('Moving accumulator value onto the bus and setting RAM');
    
    pins.write('SETMEM', 0);
    
    // feed accumulator through
    alucontrol.write(12);
    
    pins.write('SETRAM', 1);
  }
  function CloseStorage(){
    console.info('Closing storage -> Removing accumulator from bus and set flag on RAM');
    console.groupEnd();
    
    pins.write('SETRAM', 0);
    pins.write('ALUTEMPSET', 0);
    pins.write('ALUTEMPENABLE', 0);
    
    IncrementToNextInstruction();
  }
  
  // ADD command
  function SetAddOperator(){
    console.group('cmd: ADD');
    console.info('Set ALU operator');
    console.groupEnd();
    
    alucontrol.write(0);
    
    ExecuteALUOperation();
    IncrementToNextInstruction();
  }
  
  // SUB command
  function SetSubOperator(){
    console.group('cmd: SUB');
    console.info('Set ALU operator');
    console.groupEnd();
    
    alucontrol.write(1);
    
    ExecuteALUOperation();
    IncrementToNextInstruction();
  }
  
  // MUL command
  function SetMulOperator(){
    console.group('cmd: MUL');
    console.info('Set ALU operator');
    console.groupEnd();
    
    alucontrol.write(2);
    
    ExecuteALUOperation();
    IncrementToNextInstruction();
  }
  
  // DIV command
  function SetDivOperator(){
    console.group('cmd: DIV');
    console.info('Set ALU operator');
    console.groupEnd();
    
    alucontrol.write(3);
    
    ExecuteALUOperation();
    IncrementToNextInstruction();
  }
  
  // MOD command
  function SetModOperator(){
    console.group('cmd: MOD');
    console.info('Set ALU operator');
    console.groupEnd();
    
    alucontrol.write(4);
    
    ExecuteALUOperation();
    IncrementToNextInstruction();
  }
  
  // CMP command
  function SetCMPOperator(){
    console.group('cmd: CMP');
    console.info('Update ALU flags using new ALU input without changing the accumulator');
    console.groupEnd();
    
    alucontrol.write(5);
    pins.write('SETFLAGS', 1);
    pins.write('SETFLAGS', 0);

    IncrementToNextInstruction();
  }
  
  // LShift command
  function SetLShiftOperator(){
    console.group('cmd: LSHIFT');
    console.info('Set ALU operator');
    console.groupEnd();
    
    alucontrol.write(6);
    
    ExecuteALUOperation();
    IncrementToNextInstruction();
  }
  
  // RShift command
  function SetRShiftOperator(){
    console.group('cmd: RSHIFT');
    console.info('Set ALU operator');
    console.groupEnd();
    
    alucontrol.write(7);
    
    ExecuteALUOperation();
    IncrementToNextInstruction();
  }
  
  // AND command
  function SetAndOperator(){
    console.group('cmd: AND');
    console.info('Set ALU operator');
    console.groupEnd();
    
    alucontrol.write(8);
    
    ExecuteALUOperation();
    IncrementToNextInstruction();
  }
  
  // OR command
  function SetOrOperator(){
    console.group('cmd: OR');
    console.info('Set ALU operator');
    console.groupEnd();
    
    alucontrol.write(9);
    
    ExecuteALUOperation();
    IncrementToNextInstruction();
  }
  
  // NOT command
  function SetNotOperator(){
    console.group('cmd: NOT');
    console.info('Set ALU operator');
    console.groupEnd();
    
    alucontrol.write(10);
    
    ExecuteALUOperation();
    IncrementToNextInstruction();
  }
  
  // XOR command
  function SetXorOperator(){
    console.group('cmd: XOR');
    console.info('Set ALU operator');
    console.groupEnd();
    
    alucontrol.write(11);
    
    ExecuteALUOperation();
    IncrementToNextInstruction();
  }
  
  // Jump Command
  function SetInstructionPointerToTemp(){
    console.group('cmd: JUMP');
    console.info('Moving temp register to instruction pointer register');
    
    // feed temp through (data from current instruction)
    alucontrol.write(13);
    pins.write('ALUTEMPENABLE', 1);
    pins.write('ALUTEMPSET', 1);
    pins.write('SETIP', 1);
  }
  function DoCloseTempStorage(){
    console.info('Closing move to instruction pointer register');
    console.groupEnd();
    
    pins.write('SETIP', 0);
    pins.write('ALUTEMPSET', 0);
    pins.write('ALUTEMPENABLE', 0);
  }
  
  // DoJumpGT
  function DoJumpGT(){
    console.group('cmd: JumpGT');
    console.info('If comparison flags show A > B then execute jump command');
    console.groupEnd();
    
    if (pins.read('ALUFLAG5')){
      executionStack = executionStack.concat(catalog.Jump);
      OnClock();
    }else{
      IncrementToNextInstruction();
    }
  }
  
  // DoJumpEQ
  function DoJumpEQ(){
    console.group('cmd: JumpEQ');
    console.info('If comparison flags show A == B then execute jump command');
    console.groupEnd();
    
    if (pins.read('ALUFLAG4')){
      executionStack = executionStack.concat(catalog.Jump);
      OnClock();
    }else{
      IncrementToNextInstruction();
    }
  }
  
  // DoJumpLT
  function DoJumpLT(){
    console.group('cmd: JumpLT');
    console.info('If comparison flags show A < B then execute jump command');
    console.groupEnd();
    
    if (! pins.read('ALUFLAG5') && ! pins.read('ALUFLAG4')){
      executionStack = executionStack.concat(catalog.Jump);
      OnClock();
    }else{
      IncrementToNextInstruction();
    }
  }
  
  // END Command
  function DoEndExecution(){
    console.group('cmd: END');
    console.info('Ending execution');
    console.groupEnd();
  }
  
  
  (function Constructor(verbose){
    if(!verbose){
      console.groupEnd = new Function();
      console.group = new Function();
      console.info = new Function();
    }
    
    SetupPins();
  }).apply(self, arguments);
}