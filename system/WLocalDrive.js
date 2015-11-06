(function(){
  
  function WLocalDrive(){
    var self = this;
    var undefined;
    
    
    var driveRoot = new WDirectory(new WPath('/'));
    
    
    self.writeFile = WriteFile;
    
    self.makeDirectory = MakeDirectory;
    self.makeDirectoryWithFillin = MakeDirectoryWithFillin;
    
    self.exists = Exists;
    self.isDirectory = IsDirectory;
    self.isFile = IsFile;
    
    self.locatePath = LocatePath;
    
    // self.saveToLocalStorage = SaveToLocalStorage;
    // self.loadFromLocalStorage = LoadFromLocalStorage;
    
    
    function WriteFile(wfile){
      var path = wfile.getPath();
      
      if(!IsDirectory(path)){
        WLogger.error('Not a directory:', path.getPathAsString());
        throw 'Not a directory';
      }
      
      var dir = LocatePath(path);
      dir.setChild(wfile.getFileBlob().getFileName(), wfile);
      
      return wfile;
    }
    
    function MakeDirectory(wpath){
      var newDirName = wpath.getLastToken();
      var enclosingPath = wpath.concat('..');
      var enclosingDir = LocatePath(enclosingPath);
      
      if(enclosingDir.hasChild(newDirName)){
        WLogger.error('File exists:', wpath.getPathAsString());
        throw 'File exists';
      }
      
      var newDir = new WDirectory(wpath);
      enclosingDir.setChild(newDirName, newDir);
      
      return newDir;
    }
    function MakeDirectoryWithFillin(wpath){
      var lastDir;
      
      var subpaths = wpath.getSubPaths();
      for(var i=0,path; path=subpaths[i++];){
        if(!Exists(path))
          lastDir = MakeDirectory(path);
      }

      if(lastDir == undefined) lastDir = LocatePath(wpath);
      return lastDir;
    }
    
    function Exists(wpath){
      return WLogger.try(function(){
        try{
          LocatePath(wpath);
          return true;
        }catch(e){
          return false;
        }
      });
    }
    function IsDirectory(wpath){
      var dir = QuietlyLocatePath(wpath);
      if(dir == null) return false;
      return dir instanceof WDirectory;
    }
    function IsFile(wpath){
      var dir = QuietlyLocatePath(wpath);
      if(dir == null) return false;
      return dir instanceof WFile;
    }
    
    function LocatePath(wpath){
      var decomposedPath = wpath.getDecomposedPath();
      var currentDir = driveRoot;
      
      for(var i=0,subdir; subdir=decomposedPath[i++];){
        if(currentDir instanceof WFile){
          WLogger.error('Not a directory:', currentDir.getPath().getPathAsString());
          throw 'Not a directory';
        }
        currentDir = currentDir.getChild(subdir);
      }
      
      return currentDir;
    }
    
    
    function QuietlyLocatePath(wpath){
      return WLogger.try(function(){
        try{
          return LocatePath(wpath);
        }catch(e){
          return null;
        }
      });
    }
    
    
    (function Constructor(){}).apply(self, arguments);
  }
  
  BOOTLOADER.register({
    'identifier': 'WLocalDrive',
    'worker': new WLocalDrive()
  });
  
})();