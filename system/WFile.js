(function(){
  
  function WFile(){
    var self = this;
    
    
    var path;
    var blob;
    
    
    self.getPath = GetPath;
    self.getFileBlob = GetFileBlob;
    
    
    function GetPath(){
      return path;
    }
    function GetFileBlob(){
      return blob;
    }
    
    
    // path is enclosing path
    (function Constructor(obj){
      path = obj.path;
      blob = obj.blob;
    }).apply(self, arguments);
  }
  
  BOOTLOADER.register({
    'identifier': 'WFile',
    'worker': WFile
  });
  
})();