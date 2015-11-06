(function(){
  
  function WDirectory(){
    var self = this;
    var undefined;
    
    
    var path;
    
    var children = {}
    var parentDir;
    
    
    self.getPath = GetPath;
    
    self.getChildren = GetChildren;
    
    self.getParent = GetParent;
    self.setParent = SetParent;
    
    self.getChild = GetChild;
    self.setChild = SetChild;
    self.hasChild = HasChild;
    
    self.getDirectoryName = GetDirectoryName;
    
    
    function GetPath(){
      return path;
    }
    
    function GetChildren(){
      var list = [];
      for(var key in children)
        list.push(children[key]);
      return list;
    }
    
    function GetParent(){
      if(parentDir === undefined){
        WLogger.error('Unable to locate path below root folder');
        throw 'Unable to locate path below root folder.';
      }
      return parentDir;
    }
    function SetParent(_parentDir){
      parentDir = _parentDir;
    }
    
    function GetChild(name){
      if(children[name] === undefined){
        WLogger.error('No such file or directory:', path.concat(name).getPathAsString());
        throw 'No such file or directory';
      }
      return children[name];
    }
    function SetChild(name, obj){
      obj.setParent(self);
      children[name] = obj;
    }
    function HasChild(name){
      return WLogger.try(function(){
        try{
          GetChild(name);
          return true;
        }catch(e){
          return false;
        }
      });
    }
    
    function GetDirectoryName(){
      return path.getDecomposedPath().slice(-1)[0];
    }
    
    
    (function Constructor(wpath){
      path = wpath;
    }).apply(self, arguments);
  }
  
  BOOTLOADER.register({
    'identifier': 'WDirectory',
    'worker': WDirectory
  });
  
})();