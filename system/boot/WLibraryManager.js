(function(){
  
  function WLibraryManager(){
    var self = this;
    var undefined;
    
    
    var pendingLibraries = {};
    var pendingLibList = [];
    
    var libraries = {};
    var liblist = [];
    
    
    self.getByIdentifier = GetByIdentifier;
    self.hasByIdentifier = HasByIdentifier;
    
    self.countLibraries = CountLibraries;
    
    self.getPendingByIdentifier = GetPendingByIdentifier;
    self.hasPendingByIdentifier = HasPendingByIdentifier;
    
    self.countPending = CountPending;
    self.hasPending = HasPending;
    
    self.notify = Notify;
    self.register = Register;
    
    self.getLibraries = GetLibraries;
    self.getPendingLibraries = GetPendingLibraries;
    self.getIdentifierList = GetIdentifierList;
    
    
    function GetByIdentifier(identifier){
      return libraries[identifier];
    }
    function HasByIdentifier(identifier){
      return GetByIdentifier(identifier) !== undefined;
    }
    
    function CountLibraries(){
      return liblist.length;
    }
    
    function GetPendingByIdentifier(identifier){
      return pendingLibraries[identifier];
    }
    function HasPendingByIdentifier(identifier){
      return GetPendingByIdentifier(identifier) !== undefined;
    }
    
    function CountPending(){
      return pendingLibList.length;
    }
    function HasPending(){
      return CountPending() != 0;
    }
    
    function Notify(lib){
      var identifier = lib.getIdentifier();
      pendingLibraries[identifier] = lib;
      pendingLibList.push(lib);
    }
    function Register(lib){
      var identifier = lib.getIdentifier();
      
      liblist.push(lib);
      libraries[identifier] = lib;
      window[identifier] = lib.getWorker();
      delete pendingLibraries[identifier];
      
      var index = pendingLibList.indexOf(lib);
      if(index != -1) pendingLibList.splice(index, 1);
    }
    
    function GetLibraries(){
      return liblist.concat([]);
    }
    function GetPendingLibraries(){
      return pendingLibList.concat([]);
    }
    function GetIdentifierList(){
      return liblist.map(function(value){
        return value.getIdentifier();
      });
    }
    
    
    (function Constructor(libs){
      if(libs === undefined) return;
      for(var i=0,lib; lib=libs[i++];)
        LoadLib(lib);
    }).apply(self, arguments);
  }
  
  window.WLibraryManager = WLibraryManager;
  
})();