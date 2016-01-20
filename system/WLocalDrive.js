(function(){
  
  function WLocalDrive(){
    var self = this;
    var undefined;
    
    
    var driveRoot = new WDirectory(new WPath('/'));
    
    
    self.writeFile = WriteFile;
    self.makeDirectory = MakeDirectory;
    self.removeReference = RemoveReference;
    
    self.exists = Exists;
    self.isDirectory = IsDirectory;
    self.isFile = IsFile;
    
    self.locatePath = LocatePath;
    
    
    function WriteFile(wfile){
      var path = wfile.getPath();
      var enclosingPath = path.concat('..');
      
      if(!IsDirectory(enclosingPath)){
        WLogger.error('Not a directory:', enclosingPath.getPathAsString());
        throw 'Not a directory';
      }
      
      var dir = LocatePath(enclosingPath);
      dir.setChild(wfile.getFileBlob().getFileName(), wfile);
      
      SaveToLocalStorage();
      return wfile;
    }
    function MakeDirectory(wpath){
      var newDirName = wpath.getLastToken();
      
      if (!newDirName.match(/^[a-zA-Z\s\-_0-9]+$/)){
        WLogger.error('Invalid folder name. Fails to conform to expected pattern:', '^[a-zA-Z\\s\\-_0-9]+$');
        throw 'Invalid folder name. Fails to conform to expected pattern.';
      }
      
      var enclosingPath = wpath.concat('..');
      var enclosingDir = LocatePath(enclosingPath);
      
      if(enclosingDir.hasChild(newDirName)){
        WLogger.error('File exists:', wpath.getPathAsString());
        throw 'File exists';
      }
      
      var newDir = new WDirectory(wpath);
      enclosingDir.setChild(newDirName, newDir);
      
      SaveToLocalStorage();
      return newDir;
    }
    function RemoveReference(wpath){
      var endNodeName = wpath.getLastToken();
      var enclosingPath = wpath.concat('..');
      var enclosingDir = LocatePath(enclosingPath);
      
      enclosingDir.removeChild(endNodeName);
      
      SaveToLocalStorage();
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
    
    
    function LoadFromLocalStorage(){
      var rawmap = localStorage.getItem('fileSystem');
      if(!rawmap) return;
      var map = JSON.parse(rawmap);
      
      driveRoot = new WDirectory(new WPath('/'));
      RecurseLoadStorage(map, driveRoot);
    }
    function RecurseLoadStorage(node, cd){
      for(var key in node){
        var path = cd.getPath().concat(key);
        var newNode = node[key];
        if (newNode.constructor === String){
          var blob = new WFileBlob({
            'content': newNode,
            'name': key
          });
          var file = new WFile({
            blob: blob,
            path: path
          });
          cd.setChild(key, file);
        }else{
          var newDirectory = new WDirectory(path);
          cd.setChild(key, newDirectory);
          RecurseLoadStorage(newNode, newDirectory)
        }
      }
    }
    
    function SaveToLocalStorage(){
      var map = FormDriveMap();
      var json = JSON.stringify(map);
      localStorage.setItem('fileSystem', json);
    }
    function FormDriveMap(){
      var map = {}
      RecurseFormDriveMap(driveRoot, map);
      return map;
    }
    function RecurseFormDriveMap(node, map){
      var children = node.getChildren();
      for(var i=0,child; child=children[i++];){
        if(child instanceof WDirectory){
          var newNode = {};
          map[child.getDirectoryName()] = newNode;
          RecurseFormDriveMap(child, newNode);
        }else{
          var blob = child.getFileBlob();
          map[blob.getFileName()] = blob.getContent();
        }
      }
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
    
    
    (function Constructor(){
      LoadFromLocalStorage();
    }).apply(self, arguments);
  }
  
  BOOTLOADER.register({
    'identifier': 'WLocalDrive',
    'worker': new WLocalDrive()
  });
  
})();