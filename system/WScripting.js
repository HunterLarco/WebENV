(function(){
  
  function WScripting(){
    var self = this;
    var undefined;
    
    
    var funcList = [];
    var indexedFuncSpec = {};
    
    
    self.getCommands = GetCommands;
    self.getCommandSpec = GetCommandSpec;
    
    self.execute = Execute;
    
    
    function GetCommands(){
      return funcList.concat([]);
    }
    function GetCommandSpec(command){
      var funcSpec = indexedFuncSpec[command];
      
      if (funcSpec === undefined){
        WLogger.warn('Command not found:', command);
        throw 'Command not found';
      }
      
      return funcSpec;
    }
    
    // args are all required
    // can be explicitly specified by their name
    // kwargs are optional
    // flags default to false, their precense changes to true
    
    function Execute(sequence){
      var strippedSequence = sequence;
      strippedSequence = strippedSequence.replace(/\s+/g, ' ');
      strippedSequence = strippedSequence.replace(/^\s*/g, '');
      strippedSequence = strippedSequence.replace(/\s*$/g, '');
      
      if(strippedSequence.length == 0) return;
      
      var partsList = SplitSequence(strippedSequence);
      var command = partsList[0];
      
      var funcSpec = GetCommandSpec(command);
      
      var args = funcSpec.getArguments();
      var argdefaults = funcSpec.getDefaultArguments();
      var usableArgs = args.concat([]);
      var flags = funcSpec.getFlags();
      
      var parameters = {}
      
      // flags default to false
      for(var i=0,flag; flag=flags[i++];)
        parameters[flag] = false;
      
      for(var i=1; i<partsList.length; i++){
        var part = partsList[i];
        if(part[0] === '-'){
          if(part.slice(0,2) === '--') part = part.slice(2);
          else part = part.slice(1);
          
          if(flags.indexOf(part) !== -1){
            parameters[part] = true;
          }else if(args.indexOf(part) !== -1){
            var flaggedArgIndex = args.indexOf(part);
            var flaggedArg = args[flaggedArgIndex];
            
            var usableIndex = usableArgs.indexOf(part);
            if (usableArgs !== -1) usableArgs.slice(usableIndex, 1);
            
            if(parameters[flaggedArg] !== undefined){
              WLogger.warn('Dupicate keyword arguments cannot be resolved:', flaggedArg);
              throw 'Dupicate keyword arguments cannot be resolved';
            }
            
            parameters[flaggedArg] = part
          }else{
            WLogger.warn('Received unexpected keyword argument:', part);
            throw 'Received unexpected argument';
          }
          
        }else{
          if(usableArgs.length == 0){
            WLogger.warn('Received arguments exceeded expected for command:', command);
            throw 'Received arguments exceeded expected';
          }
          
          parameters[usableArgs[0]] = part
          usableArgs = usableArgs.slice(1);
        }
        
      }
      
      if(usableArgs.length !== 0){
        for(var i=0,leftoverArg; leftoverArg=usableArgs[i++];){
          var defaultArg = argdefaults[leftoverArg];
          if(defaultArg === undefined){
            WLogger.warn('Missing arguments for command:', command);
            throw 'Missing arguments for command';
          }
          parameters[leftoverArg] = defaultArg;
        }
      }
      
      return funcSpec.callWorker(parameters);
    }
    
    
    
    function SplitSequence(sequence){
      var split = [];
      
      var isInString = false;
      var lastSection = '';
      
      for(var i=0,character; character=sequence[i++];){
        if(character === '"'){
          var prevString = sequence.slice(0, i-1);
          var prevEscapes = prevString.replace(/^.*[^\\]/, '');
          if(prevEscapes.length % 2 == 0){
            isInString = !isInString;
            continue;
          }
        }
        
        if(character === ' ' && !isInString){
          split.push(lastSection);
          lastSection = '';
        }else{
          lastSection += character;
        }
      }
      
      if(isInString){
        WLogger.warn('Unexpected end of string:', sequence);
        throw 'Unexpected end of string';
      }
      
      if(lastSection.length !== 0)
        split.push(lastSection);
    
      return split;
    }
    
    function SaveIndexedFunctions(funcmap){
      for(var i=0,func; func=funcmap[i++];){
        try{
          var command = new WShellCommand(func);
        }catch(e){
          WLogger.error('Unknown error loading WShellCommand:', func.command);
          throw 'Unknown error loading WShellCommand';
        }
        
        var commandName = command.getCommandName();
        indexedFuncSpec[commandName] = command;
        funcList.push(commandName)
      }
    }
    
    
    (function Constructor(funcmap){
      SaveIndexedFunctions(funcmap);
      WLogger.inform('WScripting initialized with commands:', funcList.join(', '));
    }).apply(self, arguments);
  }
  
  BOOTLOADER.register({
    'identifier': 'WScripting',
    'worker': WScripting
  });
  
})();