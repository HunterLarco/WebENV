(function(){
  
  function WFileManager(){
    var self = this;
    
    
    var path;
    
    
    function DeconstructFilePath(){
      return WPath({ 'path': path });
    }
    
    
    (function Constructor(obj){
      path = obj.path;
    }).apply(self, arguments);
  }
  
  BOOTLOADER.register({
    'identifier': 'WFileManager',
    'worker': WFileManager
  });
  
})();