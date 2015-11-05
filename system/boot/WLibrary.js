(function(){
  
  function WLibrary(){
    var self = this;
    var undefined;
    
    
    var identifier;
    var description;
    var script;
    
    var isLoading = false;
    var isLoaded = false;
    
    var worker;
    
    
    self.load = Load;
    
    self.isLoading = IsLoading;
    self.isLoaded = IsLoaded;
    
    self.getWorker = GetWorker;
    self.setWorker = SetWorker;
    
    self.getIdentifier = GetIdentifier;
    self.getDescription = GetDescription;
    self.getScript = GetScript;
    
    
    function Load(){
      WLogger.inform('Downloading WLibrary: ', identifier);
      
      if(isLoaded){
        WLogger.warn('Unable to load WLibrary twice: ', identifier);
        throw "Unable to load '"+identifier+"' Library twice.";
      }
      isLoading = true;
      
      var elem = document.createElement('script');
      elem.addEventListener('load', ScriptLoaded);
      elem.addEventListener('error', ScriptLoadError);
      elem.setAttribute('src', script);

      document.head.appendChild(elem);
    }
    function ScriptLoaded(){
      isLoading = false;
      isLoaded = true;
    }
    function ScriptLoadError(){
      WLogger.error('Failure to load library: ', identifier);
    }
    
    function IsLoading(){
      return isLoading;
    }
    function IsLoaded(){
      return isLoaded;
    }
    
    function GetWorker(){
      return worker;
    }
    function SetWorker(_worker){
      var old = worker;
      
      worker = _worker;
      worker.getLibrary = function GetLibrary(){
        return self;
      }
      
      return old;
    }
    
    function GetIdentifier(){
      return identifier;
    }
    function GetDescription(){
      return description;
    }
    function GetScript(){
      return script;
    }
    
    
    (function Constructor(obj){
      identifier = obj.identifier;
      description = obj.description;
      script = obj.script;
    }).apply(self, arguments);
  }
  
  window.WLibrary = WLibrary;
  
})();