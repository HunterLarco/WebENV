(function(){
  
  function WLibrary(){
    var self = this;
    var undefined;
    
    
    var identifier;
    var description;
    var script;
    var requirements;
    
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
    self.getRequirements = GetRequirements;
    
    
    function Load(){
      LoadRequirements(function Callback(){
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
      });
    }
    function ScriptLoaded(){
      isLoading = false;
      isLoaded = true;
    }
    function ScriptLoadError(){
      WLogger.error('Failure to load library: ', identifier);
      throw 'Failure to load library';
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
    function GetRequirements(){
      return requirements;
    }
    
    
    function LoadRequirements(callback){
      if(requirements.length === 0) return callback();
      WLogger.inform('Downloading WLibrary requirements:', identifier);
      IterativelyLoadRequirements(0, callback);
    }
    function IterativelyLoadRequirements(index, callback){
      if(index === requirements.length)
        return callback();
      
      var requirement = requirements[index];
      var extensionIndex = requirement.indexOf('.');
      var extension = requirement.slice(extensionIndex + 1);
      
      if(extension === 'css'){
        var elem = document.createElement('style');
        elem.setAttribute('src', requirement);
      }else if(extension === 'js' || extension === 'json'){
        var elem = document.createElement('script');
        elem.setAttribute('src', requirement);
      }else{
        WLogger.error('Unknown requirement extension:', requirement);
        throw 'Unknown requirement extension';
      }
      
      elem.addEventListener('load', ScriptRequirementLoaded)
      elem.addEventListener('error', ScriptRequirementLoadError);
      document.head.appendChild(elem);
      
      function ScriptRequirementLoaded(){
        WLogger.inform('WLibrary requirement downloaded: ', requirement);
        IterativelyLoadRequirements(index + 1, callback);
      }
      function ScriptRequirementLoadError(){
        WLogger.error('Failure to load WLibrary requirement: ', requirement);
        throw 'Failure to load WLibrary requirement';
      }
    }
    
    
    (function Constructor(obj){
      identifier = obj.identifier;
      description = obj.description;
      script = obj.script;
      requirements = obj.requirements === undefined ? [] : obj.requirements;
    }).apply(self, arguments);
  }
  
  window.WLibrary = WLibrary;
  
})();