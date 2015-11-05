(function(){
  
  window.WLogger = new (function(){
    var self = this;
    var undefined;
    
    
    var verbose = true;
    
    
    const SYSTEMSTRING = 'WebENV:system$';
    const SYSTEMCOLOR = 'rgb(160,160,160)';
    
    
    self.inform = LogInform;
    self.warn = LogWarn;
    self.error = LogError;
    
    self.try = Try;
    
    
    function LogInform(){
      var message = arguments[0];
      var extras = Array.prototype.slice.call(arguments, 1);
      
      LogMessage('INFO', message, extras, {
        'handle': 'rgb(96,125,139)',
        'extras': 'rgb(0,0,255)'
      });
    }
    function LogWarn(){
      var message = arguments[0];
      var extras = Array.prototype.slice.call(arguments, 1);
      
      LogMessage('WARN', message, extras, {
        'handle': 'rgb(255,152,0)',
        'extras': 'rgb(0,0,255)'
      });
    }
    function LogError(){
      var message = arguments[0];
      var extras = Array.prototype.slice.call(arguments, 1);
      
      LogMessage('ERRO', message, extras, {
        'handle': 'rgb(255,0,0)',
        'extras': 'rgb(0,0,255)'
      });
    }
    
    function Try(func){
      verbose = false;
      result = func();
      verbose = true;
      return result;
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
        '%c' + handle + ' %c' + SYSTEMSTRING + ' %c' + message + ' %c' + extras,
        'color:' + handlecolor,
        'color:' + SYSTEMCOLOR,
        'color:' + messagecolor,
        'color:' + extrascolor
      );
    }
    
  })();
  
})();