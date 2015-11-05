(function(){
  
  function WLocalDrive(){
    var self = this;
    var undefined;
    
    
    var localDrive = {}
    
    
    self.writeFile = WriteFile;
    self.makeDirectory = MakeDirectory;
    
    self.exists = Exists;
    self.isDirectory = IsDirectory;
    self.isFile = IsFile;
    
    self.locatePath = LocatePath;
    
    self.saveToLocalStorage = SaveToLocalStorage;
    self.loadFromLocalStorage = LoadFromLocalStorage;
    
    
    function WriteFile(wfile){
      var wpath = wfile.getPath();
      var fileBlob = wfile.getFileBlob();
      
      if(!Exists(wpath)){
        WLogger.error('No such directory:', wpath.getPathAsString());
        throw 'No such directory';
      }
      
      var fileName = fileBlob.getFileName();
      var filePath = wpath.concat(fileName);
      
      if(Exists(filePath)){
        WLogger.error('File exists:', filePath.getPathAsString());
        throw 'File exists';
      }
      
      var rawdir = LocateRawPath(wpath);
      rawdir.dir[fileName] = fileBlob;
      
      return filePath;
    }
    function MakeDirectory(wpath){
      var decomposedPath = wpath.getDecomposedPath();
      var newFolderName = decomposedPath[decomposedPath.length-1];
      
      var enclosingPath = new WPath(decomposedPath.slice(0, -1).join('/'));
      
      if (!newFolderName.match(/^[a-zA-Z\s\-_0-9]+$/)){
        WLogger.error('Invalid folder name. Fails to conform to expected pattern:', '^[a-zA-Z\\s\\-_0-9]+$');
        throw 'Invalid folder name. Fails to conform to expected pattern.';
      }
      
      if(Exists(wpath)){
        WLogger.error('File exists:', wpath.getPathAsString());
        throw 'File exists';
      }
      
      var rawpath = LocateRawPath(enclosingPath);
      rawpath.dir[newFolderName] = {};
      
      return wpath;
    }
    
    function Exists(wpath){
      return WLogger.try(function(){
        try{
          LocateRawPath(wpath);
          return true;
        }catch(e){
          return false;
        }
      });
    }
    function IsDirectory(wpath){
      return LocatePath(wpath) instanceof WPath;
    }
    function IsFile(wpath){
      return LocatePath(wpath) instanceof WFile;
    }
    
    function LocatePath(wpath){
      var rawpath = LocateRawPath(wpath);
      
      if(rawpath.file !== undefined) return rawpath.file;
      else return rawpath.path;
    }
    
    function SaveToLocalStorage(){
      var index = IterativeSaveFiles(localDrive, '/');
      localStorage.setItem('localDriveIndex', index.join('~'));
    }
    function LoadFromLocalStorage(){
      var index = localStorage.getItem('localDriveIndex').split('~');
      localDrive = InterativeLoadFiles(index);
      WLogger.inform('Replaced local drive LocalStorage data:', index.length + ' end files/folders');
    }
    
    
    function LocateRawPath(wpath){
      var path = wpath.getDecomposedPath();
      var currentdirectory = localDrive;
      var travelStack = [currentdirectory];
      var shortenedPath = [];
      
      for(var i=0,part; part=path[i++];){
        if(part == '.') continue;
        if(part == '..'){
          if (travelStack.length == 0){
            WLogger.error('Unable to locate path below root folder:', wpath.getPathAsString());
            throw 'Unable to locate path below root folder.';
          }
          travelStack = travelStack.slice(0, -1);
          shortenedPath = shortenedPath.slice(0, -1);
          currentdirectory = travelStack[travelStack.length-1];
          continue;
        }
        
        var nextdirectory = currentdirectory[part];
        var islast = i == path.length;
        
        if (nextdirectory == undefined){
          shortenedPath.push(part);
          var currentPath = new WPath(shortenedPath.join('/'));
          WLogger.error('No such file or directory:', currentPath.getPathAsString());
          throw 'No such file or directory';
        }else if(nextdirectory instanceof WFileBlob && !islast){
          shortenedPath.push(part);
          var currentPath = new WPath(shortenedPath.join('/'));
          WLogger.error('Not a directory:', currentPath.getPathAsString());
          throw 'Not a directory';
        }
        
        currentdirectory = nextdirectory;
        travelStack.push(nextdirectory);
        shortenedPath.push(part);
      }
      
      shortenedPath = new WPath(shortenedPath.join('/'));
      
      return {
        'file': currentdirectory instanceof WFileBlob ? new WFile({ blob:currentdirectory, path:shortenedPath }) : undefined,
        'path': shortenedPath,
        'dir': currentdirectory
      };
    }
    
    function IterativeSaveFiles(dir, path){
      var savedPaths = [];
      
      for(var key in dir){
        var item = dir[key];
        if (item instanceof WFileBlob){
          var fileName = item.getFileName();
          var content = item.getContent();
          var filePath = path + fileName;
          localStorage.setItem('localDrive:'+filePath, content);
          savedPaths.push(filePath);
        }else{
          var newPaths = IterativeSaveFiles(item, path + key + '/');
          if (newPaths.length == 0) savedPaths.push(path + key + '/');
          savedPaths = savedPaths.concat(newPaths);
        }
      }
      
      return savedPaths;
    }
    function InterativeLoadFiles(index){
      var drive = {};
      
      for(var i=0,path; path=index[i++];){
        var currentDrive = drive;
        var wpath = new WPath(path);
        var decomposedPath = wpath.getDecomposedPath();
        for(var j=0,part; part=decomposedPath[j++];){
          var isLast = j == decomposedPath.length;
          if (isLast) {
            var content = localStorage.getItem('localDrive:' + wpath.getPathAsString());
            currentDrive[part] = new WFileBlob({ 'name':part, 'content':content })
          }else{
            if(currentDrive[part] === undefined) currentDrive[part] = {};
            currentDrive = currentDrive[part]
          }
        }
      }
      
      return drive;
    }
    
    
    (function Constructor(){}).apply(self, arguments);
  }
  
  BOOTLOADER.register({
    'identifier': 'WLocalDrive',
    'worker': new WLocalDrive()
  });
  
})();