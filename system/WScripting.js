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
      
      var worker = funcSpec.worker;
      var args = funcSpec.args;
      var argdefaults = funcSpec.argdefaults;
      var usableArgs = args.concat([]);
      var kwargs = funcSpec.kwargs;
      var flags = funcSpec.flags;
      
      var parameters = {}
      
      // flags default to false
      for(var i=0,flag; flag=flags[i++];)
        parameters[flag] = false;
      
      // kwargs are optional and default to null
      for(var i=0,kwarg; kwarg=kwargs[i++];)
        parameters[kwarg] = null;
      
      for(var i=1,part; part=partsList[i++];){
        if(part[0] === '-'){
          if(part.slice(0,2) === '--') part = part.slice(2);
          else part = part.slice(1);
          
          if(kwargs.indexOf(part) !== -1){
            if(parameters[part] !== null){
              WLogger.warn('Dupicate keyword arguments cannot be resolved:', part);
              throw 'Dupicate keyword arguments cannot be resolved';
            }
            
            if(i >= partsList.length || partsList[i][0] === '-'){
              WLogger.warn('Keyword argument must preceed value pair:', part);
              throw 'Keyword argument must preceed value pair';
            }
            
            parameters[part] = partsList[i++];
          }else if(flags.indexOf(part) !== -1){
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
      
      return worker(parameters);
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
        var command = func.command;
        
        if(indexedFuncSpec[command] !== undefined){
          WLogger.warn('Unable to index duplicate command:', command);
          throw 'Unable to index duplicate command.';
        }
        
        var args = func.args.length == 0 ? [] : func.args.split(' ');
        var argdefaults = {};
        var kwargs = func.kwargs.length == 0 ? [] : func.kwargs.split(' ');
        var flags = func.flags.length == 0 ? [] : func.flags.split(' ');
        var worker = func.worker;
        
        args = args.map(function(arg){
          var argMap = arg.match(/([^\[]+)(?:\[([^\]]+)\])?/);
          var argName = argMap[1];
          var argDefault = argMap[2];
          argdefaults[argName] = argDefault;
          return argName;
        });
        
        funcList.push(command);
        indexedFuncSpec[command] = {
          args: args,
          argdefaults: argdefaults,
          flags: flags,
          kwargs: kwargs,
          worker: worker
        }
      }
    }
    
    
    (function Constructor(funcmap){
      SaveIndexedFunctions(funcmap);
    }).apply(self, arguments);
  }
  
  BOOTLOADER.register({
    'identifier': 'WScripting',
    'worker': WScripting
  });
  
})();