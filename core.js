(function(){
  
  window.addEventListener('load', Init);
  
  function Init(){
    // return RunTests();
    
    
    
    
    
    // 5 bits for instruction 8 bits for data
    var instructions = [
       // ~((((((5 + 2 - 4) * 2 / 3 * 5 % 4) << 4) >> 1) + 5) & 27 | 46) ^ 78 == 142
       // Remember that the not is executed over 8 bits unsigned. So javascript will not
       // get the same answer as expected, but the CPU generates the right answer!!

       0b0001000000101,
       0b0001000000010,
       0b0001100000100,
       0b0010000000010,
       0b0010100000011,
       0b0010000000101,
       0b0011000000100,
       0b0100000000100,
       0b0100100000001,
       0b0001000000101,
       0b0101000011011,
       0b0101100101110,
       0b0110000000000,
       0b0110101001110,

       // Stores the current value into RAM address 10000000
       // And then loads it again

       0b0000110000000,
       0b0000010000000,

       // Jump over the end execution instruction

       0b0111000010010,
       0b1111100000000,

       // Add 5 (now value is 147)

       0b0001000000101,

       // Add 1 until == 155 (do while)
       // then jump to the final end execution line

       // add 1
       // compare to 155
       // if == 155 jump to line 23
       // jump to line 19

       0b0001000000001,
       0b0011110011011,
       0b1000000010111,
       0b0111000010011,

       0b1111100000000
     ];
   
    var instructions = [
      0b0001000000001,
      0b0011100010100,
      0b1000000000100,
      0b0111000000000,
      0b1111100000000
    ]
    
    
    
    
    
    var alwaysOn = new Wire();
    alwaysOn.on(window);
    
    var clockWire = new Wire();
    
    var control = new ControlUnit();
    control.CLOCK(clockWire);
    
    var dataBus = CreateBus(8);
    var instructionBus = CreateBus(5);
    
    
    
    
    
    
    
    var InstructionPointer = new Register(8);
    var TempInstructionPointer = new Register(8);
    var Incrementor = new IncrementUnit(8);
    
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
    
    
    
    
    
    
    
    var ram = new RAM(13, instructions);
    var MemoryAddress = new Register(8);
    
    ram.INPUT.connect(MemoryAddress.OUTPUT, CreateBus(5));
    ram.OUTPUT.connect(dataBus, instructionBus);
    
    MemoryAddress.INPUT.connect(dataBus);
    MemoryAddress.ENABLE(alwaysOn);
    
    control.SETMEM(MemoryAddress.SET);
    
    control.SETRAM(ram.SET);
    control.ENABLERAM(ram.ENABLE);
    
    
    
    
    
    
    var Instruction = new Register(5);
    
    Instruction.INPUT.connect(instructionBus);
    Instruction.OUTPUT.connect(control.INST);
    
    Instruction.SET(control.SETINST);
    Instruction.ENABLE(alwaysOn);
    
    
    
    
    
    
    
    var TempRegister = new Register(8);
    
    TempRegister.INPUT.connect(dataBus);
    TempRegister.ENABLE(alwaysOn);
    
    control.SETTMP(TempRegister.SET);
    
    
    
    
    
    var Accumulator = new Register(8);
    
    Accumulator.INPUT.connect(dataBus);
    Accumulator.ENABLE(alwaysOn);
    
    control.SETACC(Accumulator.SET);
    
    
    
    
    
    
    
    var FlagsRegister = new Register(6);
    
    FlagsRegister.ENABLE(alwaysOn);
    
    control.ALUFLAGS.connect(FlagsRegister.OUTPUT);
    control.SETFLAGS(FlagsRegister.SET);
    
    
    var ALU = new ArithmeticLogicUnit(8);
    
    ALU.A.connect(TempRegister.OUTPUT);
    ALU.B.connect(Accumulator.OUTPUT);
    ALU.FLAGS.connect(FlagsRegister.INPUT);
    
    control.ALUCTL.connect(ALU.CTL);
    
    
    




    var TempALUOutput = new Register(8);

    TempALUOutput.INPUT.connect(ALU.OUTPUT);
    TempALUOutput.OUTPUT.connect(dataBus);

    control.ALUTEMPSET(TempALUOutput.SET);
    control.ALUTEMPENABLE(TempALUOutput.ENABLE);


    
    
    
    
    
    
    function REPR(){
      console.log('IP      ~', InstructionPointer.repr());
      console.log('TMP IP  ~', TempInstructionPointer.repr());
      console.log('MEM AD  ~', MemoryAddress.repr());
      console.log('INST    ~', Instruction.repr());
      console.log('RAM     ~', ram.repr());
      console.log('TMP ALU ~', TempRegister.repr());
      console.log('ACCUM   ~', Accumulator.repr());
      console.log('FLAGS   ~', FlagsRegister.repr());
      console.log('ALU     ~', ALU.repr());
      console.log('ALU OUT ~', TempALUOutput.repr());
      console.log('INCR    ~', Incrementor.repr());
    }
    window.REPR = REPR;
    
    
    
    
    
    
    function Clock(){
      if(clockWire.status()) clockWire.off(window);
      else clockWire.on(window);
    }
    window.setInterval(Clock, 5);
    
  }
  function RunTests(){
    TestBus();
    console.log('---------');
    TestIncrementUnit();
    console.log('---------');
    TestRegister();
    console.log('---------');
    TestRAM();
    console.log('---------');
    TestArithmeticLogicUnit();
  }
  
})();