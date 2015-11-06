(function(){
  
  function WShell(){
    var self = this;
    var undefined;
    
    
    var parser;
    var frame;
    
    
    function LoadGUI(){
      var shellWindow = CreateElement('div', { 'class': 'wshell' });
      frame.appendChild(shellWindow);
    }
    function CreateElement(elemType, attributes){
      var elem = document.createElement(elemType);
      
      for(var key in attributes){
        var attributeValue = attributes[key];
        elem.setAttribute(key, attributeValue);
      }
      
      return elem;
    }
    
    
    (function Constructor(obj){
      parser = obj.parser;
      
      if(obj.frame !== undefined && frame !== null) frame = obj.frame;
      else frame = document.body;
      
      LoadGUI();
    }).apply(self, arguments);
  }
  
  BOOTLOADER.register({
    'identifier': 'WShell',
    'worker': WShell
  });
  
})();