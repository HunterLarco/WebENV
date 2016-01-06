function CreateBus(width){
  var wires = [];
  for(var i=0; i<width; i++)
    wires.push(new Wire);
  return new PinConnector(wires);
}
function TestBus(){
  var reg1 = new Register(4);
  var reg2 = new Register(4);
  var reg3 = new Register(4);
  
  var bus = CreateBus(4);
  
  reg1.INPUT.connect(bus);
  reg2.INPUT.connect(bus);
  reg3.OUTPUT.connect(bus);
  
  var alwaysOn = new Wire();
  alwaysOn.on(window);
  
  reg3.IN2(alwaysOn);
  reg3.SET(alwaysOn);
  reg3.ENABLE(alwaysOn);
  
  console.log('reg1', reg1.repr());
  console.log('reg2', reg2.repr());
  console.log('reg3', reg3.repr());
}