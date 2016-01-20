(function(){
  
  function WFile(){
    var self = this;
    var undefined;
    
    
    var path;
    var parentDir;
    var blob;
    
    
    self.getPath = GetPath;
    
    self.getParent = GetParent;
    self.setParent = SetParent;
    self.removeParent = RemoveParent;
    
    self.getFileBlob = GetFileBlob;
    
    
    function GetPath(){
      return path;
    }
    
    function GetParent(){
      if(parentDir === undefined){
        WLogger.error('Unsaved file has no parent directory:', blob.getFileName());
        throw 'Unsaved file has no parent directory';
      }
      return parentDir;
    }
    function SetParent(_parentDir){
      parentDir = _parentDir;
    }
    function RemoveParent(){
      parentDir = undefined;
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