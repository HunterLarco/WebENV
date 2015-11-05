(function(){
  
  function WPath(){
    var self = this;
    var undefined;
    
    
    var path;
    var pathString;
    
    
    self.concat = Concat;
    
    self.getPathAsString = GetPathAsString;
    
    
    function Concat(relativePath){
      return new WPath(pathString + '/' + relativePath);
    }
    
    function GetPathAsString(){
      return pathString;
    }
    
    
    (function Constructor(_pathString){
      pathString = _pathString;
    }).apply(self, arguments);
  }
  
  BOOTLOADER.register({
    'identifier': 'WPath',
    'worker': WPath
  });
  
})();