function InterpretLine(line, cb){
  var invalidChar = line.match(/[^a-zA-Z0-9\s]/);
  if(!!invalidChar){
    var char = invalidChar[0];
    var index = invalidChar.index+1;
    return cb('Unexpected character \''+char+'\' at position '+index);
  }
  
  // remove leading and trailing spaces
  var stripped = line.replace(/^\s*(.*[^\s])\s*$/g, '$1');
  // convert duplicate spaces into single spaces
  stripped = stripped.replace(/\s+/g, ' ');
  
  // check that we have content by splitting into tokens
  var tokens = stripped.split(' ');
  if(tokens.length === 0) return;
  
  // split tokens into function name and parameters
  var funct = tokens[0];
  var params = tokens.slice(1);
  
  // check function exists
  var definition = CATALOG[funct];
  if (!definition)
    return cb('Cannot interpret undefined function \''+funct+'\'');
  
  // check we have right amount of params
  if(definition.param && params.length !== 1)
    return cb('Expected 1 parameter but received '+params.length);
  else if(!definition.param && params.length !== 0)
    return cb('Expected 0 parameters but received '+params.length);
  
  // if param needed check it is a number that is an integer
  // and fits in one unsigned byte
  var param = 0;
  if(definition.param){
    if(!IsNumeric(params[0]))
      return cb('Parameter must be numeric');
    if(parseFloat(params[0]) !== parseInt(params[0]))
      return cb('Parameter must be an integer');
    param = parseInt(params[0]);
    if(param > 0b11111111)
      return cb('Parameter value may not exceed one byte');
  }
  
  // convert command into bytecode
  var machineCode = (definition.code << 8) + param;
  return cb(null, machineCode);
}
function IsNumeric(n){
  return !isNaN(parseFloat(n)) && isFinite(n);
}


function FormCodeSnippet(){
  
}


function CodeSnippet(){
  var undefined;
  var self = this;
  
  
  self.run = Run;
  self.step = Step;
  
  
  function Run(){
    
  }
  function Step(){
    
  }
  
  
  (function Constructor(code){
    
  }).apply(self, arguments);
}