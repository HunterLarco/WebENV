(function(){
  
  window.WLogger = new (function(){
    var self = this;
    var undefined;
    
    
    var verbose = true;
    var groupHeight = 0;
    
    var listeners = {};
    
    
    const SYSTEMSTRING = 'WebENV:system$';
    const SYSTEMCOLOR = 'rgb(160,160,160)';
    
    
    self.inform = LogInform;
    self.warn = LogWarn;
    self.error = LogError;
    
    self.group = MakeGroup;
    self.closeGroup = CloseGroup;
    
    self.try = Try;
    self.listen = Listen;
    
    
    function LogInform(){
      var message = arguments[0];
      var extras = Array.prototype.slice.call(arguments, 1);
      
      RunEvent('inform', {
        'message': message,
        'extras': extras,
        'handle': SYSTEMSTRING
      });
      
      LogMessage('INFO', message, extras, {
        'handle': 'rgb(96,125,139)',
        'extras': 'rgb(0,0,255)'
      });
    }
    function LogWarn(){
      var message = arguments[0];
      var extras = Array.prototype.slice.call(arguments, 1);
      
      RunEvent('warn', {
        'message': message,
        'extras': extras,
        'handle': SYSTEMSTRING
      });
      
      LogMessage('WARN', message, extras, {
        'handle': 'rgb(255,152,0)',
        'extras': 'rgb(0,0,255)'
      });
    }
    function LogError(){
      var message = arguments[0];
      var extras = Array.prototype.slice.call(arguments, 1);
      
      RunEvent('error', {
        'message': message,
        'extras': extras,
        'handle': SYSTEMSTRING
      });
      
      LogMessage('ERRO', message, extras, {
        'handle': 'rgb(255,0,0)',
        'extras': 'rgb(0,0,255)'
      });
    }
    
    function MakeGroup(){
      groupHeight++;
    }
    function CloseGroup(){
      groupHeight = Math.max(0, groupHeight-1);
    }
    
    function Try(func){
      verbose = false;
      result = func();
      verbose = true;
      return result;
    }
    function Listen(eventName, func){
      var listenDict = listeners[eventName];
      if(listenDict === undefined)
        listenDict = listeners[eventName] = [];
      listenDict.push(func);
    }
    function RunEvent(eventName, event){
      if(!verbose) return;
      var funcList = listeners[eventName];
      if(funcList === undefined) return;
      for(var i=0,func; func=funcList[i++];)
        func(event);
    }
    
    
    function LogMessage(handle, message, extras, colors){
      if(!verbose) return;
      
      if(message === undefined) message = '';
      if(extras === undefined) extras = '';
      if(extras instanceof Array) extras = extras.join(' ');
      
      var handlecolor = colors.handle || 'rgb(0,0,0)';
      var messagecolor = colors.message || 'rgb(0,0,0)';
      var extrascolor = colors.extras || 'rgb(0,0,0)';
      
      console.log(
        GetGroupTabs() + '%c' + handle + ' %c' + SYSTEMSTRING + ' %c' + message + ' %c' + extras,
        'color:' + handlecolor,
        'color:' + SYSTEMCOLOR,
        'color:' + messagecolor,
        'color:' + extrascolor
      );
    }
    function GetGroupTabs(){
      var tabs = '';
      
      for(var i=0; i<groupHeight; i++)
        tabs += '\t';
      
      return tabs;
    }
    
  })();
  
})();