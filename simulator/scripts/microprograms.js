function MicroProgram(){
  var self = this;
  
  
  var stack = [];
  
  
  self.next = Next;
  self.when = When;
  
  self.concat = Concat;
  self.clone = Clone;
  
  self.stack = GetStack;
  
  
  function Next(){}
  function When(){}
  
  function Concat(){}
  function Clone(){}
  
  function GetStack(){}
  
  
  (function Constructor(){}).apply(self, arguments);
}

/*
new MicroProgram()
.next(DoLoad)
.next(IncrementInstruction)
.next(LoadInstruction)

new MicroProgram()
.next(DoJumpGT)
.when(ShouldJumpGT)
.next(JumpGT)
.else(new Function())
.endWhen()
*/



MICRO = {
  Load: [
    DoLoad,
    SetMemAddressToTemp,
    SetAccumulatorToMemAddress,
    CloseSetAccumulatorToMemAddress,
    IncrementInstructionPointer,
    LoadInstruction,
    ExecuteInstruction
  ],
  Store: [
    DoStore,
    SetMemAddressToTemp,
    LoadAccumulatorIntoRam,
    CloseStorage,
    IncrementInstructionPointer,
    LoadInstruction,
    ExecuteInstruction
  ],
  Add: [
    SetAddOperator,
    ExecuteALU,
    IncrementInstructionPointer,
    LoadInstruction,
    ExecuteInstruction
  ],
  Sub: [
    SetSubOperator,
    ExecuteALU,
    IncrementInstructionPointer,
    LoadInstruction,
    ExecuteInstruction
  ],
  Mul: [
    SetMulOperator,
    ExecuteALU,
    IncrementInstructionPointer,
    LoadInstruction,
    ExecuteInstruction
  ],
  Div: [
    SetDivOperator,
    ExecuteALU,
    IncrementInstructionPointer,
    LoadInstruction,
    ExecuteInstruction
  ],
  Mod: [
    SetModOperator,
    ExecuteALU,
    IncrementInstructionPointer,
    LoadInstruction,
    ExecuteInstruction
  ],
  CMP: [
    SetCMPOperator,
    ExecuteALU,
    IncrementInstructionPointer,
    LoadInstruction,
    ExecuteInstruction
  ],
  LShift: [
    SetLShiftOperator,
    ExecuteALU,
    IncrementInstructionPointer,
    LoadInstruction,
    ExecuteInstruction
  ],
  RShift: [
    SetRShiftOperator,
    ExecuteALU,
    IncrementInstructionPointer,
    LoadInstruction,
    ExecuteInstruction
  ],
  And: [
    SetAndOperator,
    ExecuteALU,
    IncrementInstructionPointer,
    LoadInstruction,
    ExecuteInstruction
  ],
  Or: [
    SetOrOperator,
    ExecuteALU,
    IncrementInstructionPointer,
    LoadInstruction,
    ExecuteInstruction
  ],
  Not: [
    SetNotOperator,
    ExecuteALU,
    IncrementInstructionPointer,
    LoadInstruction,
    ExecuteInstruction
  ],
  Xor: [
    SetXorOperator,
    ExecuteALU,
    IncrementInstructionPointer,
    LoadInstruction,
    ExecuteInstruction
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
}