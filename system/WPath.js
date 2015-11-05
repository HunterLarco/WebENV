(function(){
  
  function WPath(){
    var self = this;
    var undefined;
    
    
    var decomposedPath;
    var pathString;
    
    
    self.concat = Concat;
    
    self.getPathAsString = GetPathAsString;
    self.getDecomposedPath = GetDecomposedPath;
    
    
    function Concat(relativePath){
      return new WPath(pathString + '/' + relativePath);
    }
    
    function GetPathAsString(){
      return pathString;
    }
    function GetDecomposedPath(){
      return decomposedPath;
    }
    
    
    function DecomposePath(path){
      if (path[0] != '/') path = '/' + path;
      path = path.replace(/\/+/g, '/');
      return path.split('/').slice(1);
    }
    
    
    (function Constructor(_pathString){
      decomposedPath = DecomposePath(_pathString);
      pathString = '/' + decomposedPath.join('/');
    }).apply(self, arguments);
  }
  
  BOOTLOADER.register({
    'identifier': 'WPath',
    'worker': WPath
  });
  
})();