(function(){
  
  window.BOOTLOADER = new (function(){
    var self = this;
    var undefined;
    
    
    var packages = [];
    var libmanager = new WLibraryManager();
    
    var preloadCallbacks = {};
    var hasLaunched = false;
    
    
    self.setPackages = SetPackages;
    self.preload = PreloadLibrary;
    
    self.launch = Launch;
    self.register = RegisterLib;
    
    self.getLibraryManager = GetLibraryManager;
    
    
    function SetPackages(_packages){
      packages = _packages;
    }
    function PreloadLibrary(identifier, callback){
      for(var i=0,lib; lib=packages[i++];)
        if(lib.identifier === identifier){
          preloadCallbacks[identifier] = callback;
          RequireLib(lib).load();
          return;
        }
      
      WLogger.error('Unknown WLibrary preload attempt:', identifier);
      throw 'Unknown WLibrary preload attempt';
    }
    
    function Launch(){
      if(hasLaunched){
        WLogger.error('BOOTLOADER cannot launch twice');
        throw 'BOOTLOADER cannot launch twice';
      }
      hasLaunched = true;
      
      WLogger.inform('Launching BOOTLOADER');
      
      for(var i=0,lib; lib=packages[i++];)
        RequireLib(lib);
      
      LoadLibraryFromQueue();
    }
    function RegisterLib(lib){
      var identifier = lib.identifier;
      var worker = lib.worker;
      
      if(!libmanager.hasPendingByIdentifier(identifier)){
        WLogger.warn('Unknown WLibrary registered:', identifier);
        return;
      }
      
      var library = libmanager.getPendingByIdentifier(identifier);
      library.setWorker(worker);
      
      libmanager.register(library);
      WLogger.inform('BOOTLOADER registered WLibrary:', identifier);
      
      if(hasLaunched){
        LoadLibraryFromQueue();
      }else{
        var callback = preloadCallbacks[identifier];
        if (callback !== undefined){
          delete preloadCallbacks[identifier];
          callback();
        }
      }
    }
    
    function GetLibraryManager(){
      return libmanager;
    }
    
    
    function LoadLibraryFromQueue(){
      var pendingLib = libmanager.getPendingLibraries();
      if (pendingLib.length == 0) return DidFinishLaunch();
      pendingLib[0].load();
    }
    function RequireLib(lib){
      if(libmanager.hasByIdentifier(lib.identifier)){
        WLogger.warn('WLibrary already loaded. Skipping:', lib.identifier);
        return;
      }
      
      var library = new WLibrary({
        'identifier': lib.identifier,
        'description': lib.description,
        'script': lib.script,
        'requirements': lib.requires
      });
      
      libmanager.notify(library);
      return library;
    }
    function DidFinishLaunch(){
      if(window.didBootLaunch !== undefined)
        setTimeout(window.didBootLaunch, 0);
    }
    
  })();
  
})();