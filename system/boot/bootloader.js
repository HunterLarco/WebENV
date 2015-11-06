(function(){
  
  window.BOOTLOADER = new (function(){
    var self = this;
    var undefined;
    
    
    var libmanager;
    
    
    self.launch = Launch;
    self.register = RegisterLib;
    
    self.getLibraryManager = GetLibraryManager;
    
    
    function Launch(dependencies){
      libmanager = new WLibraryManager();
      
      for(var i=0,lib; lib=dependencies[i++];)
        RequireLib(lib);
      
      LoadLibraryFromQueue();
    }
    function RegisterLib(lib){
      var identifier = lib.identifier;
      var worker = lib.worker;
      
      if(!libmanager.hasPendingByIdentifier(identifier)){
        WLogger.warn('Unknown library registered:', identifier);
        return;
      }
      
      var library = libmanager.getPendingByIdentifier(identifier);
      library.setWorker(worker);
      
      libmanager.register(library);
      WLogger.inform('BOOTLOADER registered WLibrary:', identifier);
      
      LoadLibraryFromQueue();
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
      var library = new WLibrary({
        'identifier': lib.identifier,
        'description': lib.description,
        'script': lib.script
      });
      
      libmanager.notify(library);
    }
    function DidFinishLaunch(){
      if(window.didBootLaunch !== undefined)
        setTimeout(window.didBootLaunch, 0);
    }
    
  })();
  
})();