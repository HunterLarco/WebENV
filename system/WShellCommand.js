(function(){
  
  function WShellCommand(){
    var self = this;
    var undefined;
    
    
    var command;
    var args;
    var argDefaults = {};
    var flags;
    var description;
    var worker;
    
    var helpString;
    
    
    self.getCommandName = GetCommandName;
    self.getArguments = GetArguments;
    self.getDefaultArguments = GetDefaultArguments;
    self.getFlags = GetFlags;
    self.getDescription = GetDescription;
    
    self.getWorker = GetWorker;
    self.callWorker = CallWorker;
    
    self.getHelpString = GetHelpString;
    
    
    function GetCommandName(){
      return command;
    }
    function GetArguments(){
      return args.concat([]);
    }
    function GetDefaultArguments(){
      return argDefaults;
    }
    function GetFlags(){
      return flags.concat([]);
    }
    function GetDescription(){
      return description;
    }
    
    function GetWorker(){
      return worker;
    }
    function CallWorker(){
      return worker.apply(window, arguments);
    }
    
    function GetHelpString(){
      var response = '';
      
      response += 'Description\n';
      response += '\t' + description;
      response += '\n\n';
      
      response += 'Arguments\n';
      for(var i=0,arg; arg=args[i++];){
        response += '\t' + arg;
        var defaultarg = argDefaults[arg];
        if(defaultarg !== undefined) response += '\n\t\tdefault_value = "' + defaultarg + '"';
        else response += '\n\t\trequired';
        response += '\n';
      }
      if(args.length === 0)
        response += '\tNo required arguments\n';
      response += '\n';
      
      response += 'Flags\n';
      for(var i=0,flag; flag=flags[i++];){
        response += '\t' + flag;
        response += '\n';
      }
      if(flags.length === 0)
        response += '\tNo flags\n';
      
      return response;
    }
    
    
    function ExtractArgDefaults(){
      if(args.length === 0) return;
      args = args.map(function(arg){
        var argMap = arg.match(/([^\[]+)(?:\[([^\]]*)\])?/);
        var argName = argMap[1];
        var argDefault = argMap[2];
        argDefaults[argName] = argDefault;
        return argName;
      });
    }
    
    
    (function Constructor(obj){
      command = obj.command;
      args = !obj.args ? [] : obj.args.split(' ');
      flags = !obj.flags ? [] : obj.flags.split(' ');
      description = !obj.description ? 'Description missing' : obj.description;
      worker = obj.worker;
      
      ExtractArgDefaults();
    }).apply(self, arguments);
  }
  
  BOOTLOADER.register({
    'identifier': 'WShellCommand',
    'worker': WShellCommand
  });
  
})();