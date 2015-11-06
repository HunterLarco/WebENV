(function(){
  
  function WPath(){
    var self = this;
    var undefined;
    
    
    var decomposedPath;
    var pathString;
    
    
    self.concat = Concat;
    self.getSubPaths = GetSubPaths;
    
    self.getPathAsString = GetPathAsString;
    self.getDecomposedPath = GetDecomposedPath;
    
    self.getLastToken = GetLastToken;
    
    
    function Concat(relativePath){
      return new WPath(pathString + '/' + relativePath);
    }
    function GetSubPaths(){
      var subpaths = [new WPath('/')];
      
      for(var i=0,part; part=decomposedPath[i++];)
        subpaths.push(subpaths[subpaths.length - 1].concat(part));
      
      return subpaths;
    }
    
    function GetPathAsString(){
      return pathString;
    }
    function GetDecomposedPath(){
      return decomposedPath;
    }
    
    function GetLastToken(){
      return decomposedPath[decomposedPath.length-1];
    }
    
    
    function DecomposePath(path){
      if (path[0] != '/') path = '/' + path;
      path = path.replace(/\/+/g, '/');
      return path.split('/').slice(1);
    }
    function CollapsePath(pathString){
      var decomposedPath = DecomposePath(pathString);
      var shortenedPath = [];
      
      for(var i=0,part; part=decomposedPath[i++];){
        if(part == '.') continue;
        if(part == '..'){
          if (shortenedPath.length == 0){
            WLogger.error('Unable to locate path below root folder:', pathString);
            throw 'Unable to locate path below root folder.';
          }
          shortenedPath = shortenedPath.slice(0, -1);
          continue;
        }
        
        shortenedPath.push(part);
      }
      
      return '/' + shortenedPath.join('/');
    }
    
    
    (function Constructor(_pathString){
      pathString = CollapsePath(_pathString);
      decomposedPath = DecomposePath(pathString);
    }).apply(self, arguments);
  }
  
  BOOTLOADER.register({
    'identifier': 'WPath',
    'worker': WPath
  });
  
})();