(function(){
  
  function WShell(){
    var self = this;
    var undefined;
    
    
    var parser;
    var frame;
    
    
    function LoadGUI(){}
    
    
    (function Constructor(obj){
      parser = obj.parser;
      
      if(obj.frame !== undefined) frame = obj.frame;
      else frame = document.body;
      
      LoadGUI();
    }).apply(self, arguments);
  }
  
  BOOTLOADER.register({
    'identifier': 'WShell',
    'worker': WShell
  });
  
})();