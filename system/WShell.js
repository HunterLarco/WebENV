(function(){
  
  function WShell(){
    var self = this;
    var undefined;
    
    
    var frame;
    var shellWindow;
    
    
    
    
    function BindLogger(){
      WLogger.listen('inform', OnInform);
      WLogger.listen('warn', OnWarn);
      WLogger.listen('error', OnError);
    }
    
    function OnInform(event){
      // console.info(event);
    }
    function OnWarn(event){
      // console.warn(event);
    }
    function OnError(event){
      // console.error(event);
    }
    
    function LoadGUI(){
      shellWindow = CreateElement('div', { 'class': 'wshell' });
      frame.appendChild(shellWindow);
    }
    function CreateElement(elemType, attributes, innerHTML){
      var elem = document.createElement(elemType);
      
      for(var key in attributes){
        var attributeValue = attributes[key];
        elem.setAttribute(key, attributeValue);
      }
      
      if(innerHTML !== undefined)
        elem.innerHTML = innerHTML;
      
      return elem;
    }
    
    
    (function Constructor(_frame){
      if(_frame !== undefined && _frame !== null) frame = _frame;
      else frame = document.body;
      
      LoadGUI();
      BindLogger();
    }).apply(self, arguments);
  }
  
  BOOTLOADER.register({
    'identifier': 'WShell',
    'worker': WShell
  });
  
})();