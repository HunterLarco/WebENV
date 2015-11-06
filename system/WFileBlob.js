(function(){
  
  function WFileBlob(){
    var self = this;
    var undefined;
    
    
    var title;
    var extension;
    var content;
    
    
    self.getBasicName = GetBasicName;
    self.getContent = GetContent;
    self.getExtension = GetExtension;
    self.getFileName = GetFileName;
    
    
    function GetBasicName(){
      return title;
    }
    function GetContent(){
      return content;
    }
    function GetExtension(){
      return extension;
    }
    function GetFileName(){
      return title + '.' + extension;
    }
    
    
    // name and content
    (function Constructor(obj){
      if(!obj.name.match(/^[a-zA-Z\s\-_0-9\.]+$/)){
        WLogger.error('Invalid file name. Fails to conform to expected pattern:', '^[a-zA-Z\\s\\-_0-9\\.]+$');
        throw 'Invalid file name. Fails to conform to expected pattern.';
      }
      
      var extensionIndex = obj.name.indexOf('.');
      
      title = obj.name.slice(0, extensionIndex);
      extension = obj.name.slice(extensionIndex+1);
      content = obj.content;
    }).apply(self, arguments);
  }
  
  BOOTLOADER.register({
    'identifier': 'WFileBlob',
    'worker': WFileBlob
  });
  
})();