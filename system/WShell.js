(function(){
  
  function WShell(){
    var self = this;
    var undefined;
    
    
    var MOUNTSTRING = 'console:/ guest$ ';
    
    var frame;
    var shellWindow;
    var lineWindow;
    var inFocusLabel;
    
    var parser;
    
    var currentLineValue;
    var inputLine;
    var inputTextSpan;
    
    const CURSORWIDTH = 9;
    const CURSORFLASH = 500;
    var cursorFlashState = false;
    var cursorInterval;
    var cursorIndex;
    var cursorElem;
    
    
    var commandMemory = [];
    var memoryIndex = 0;
    var originalMemoryValue;
    
    
    self.setMountString = SetMountString;
    self.getMountString = GetMountString;
    
    self.setParser = SetParser;
    self.getParser = GetParser;
    
    self.clear = Clear;
    self.start = Start;
    
    
    function SetMountString(wpath){
      MOUNTSTRING = 'console:' + (wpath.getLastToken() || '/') + ' guest$ ';
    }
    function GetMountString(){
      return MOUNTSTRING;
    }
    
    function SetParser(_parser){
      var old = parser;
      parser = _parser;
      return old;
    }
    function GetParser(){
      return parser;
    }
    
    function Clear(){
      lineWindow.innerHTML = '';
    }
    function Start(){
      ShowMountMessage();
      CreateInputBindings();
      CreateNewInputLine();
      
      shellWindow.focus();
    }
    
    
    // initialize input functions
    function ShowMountMessage(){
      var line = CreateElement('div', { 'class':'line' });
      
      line.appendChild(CreateElement('br'));
      line.appendChild(CreateElement('span', { 'class':'systemmount' }, '----------------------------------------------------------------------'));
      line.appendChild(CreateElement('br'));
      
      var mountString = document.createTextNode('Welcome to WebENV! If you haven\'t been here type \'help\' to get started');
      line.appendChild(mountString);
      
      line.appendChild(CreateElement('br'));
      line.appendChild(CreateElement('span', { 'class':'systemmount' }, '----------------------------------------------------------------------'));
      line.appendChild(CreateElement('br'));
      line.appendChild(CreateElement('br'));
      
      AddLine(line);
    }
    function CreateInputBindings(){
      shellWindow.addEventListener('focus', OnFocus);
      shellWindow.addEventListener('blur', OnBlur);
      shellWindow.addEventListener('keydown', KeyDown);
      shellWindow.addEventListener('keypress', KeyPressed);
      shellWindow.setAttribute('tabindex', '0');
    }
    
    // focus listeners
    function OnFocus(){
      inFocusLabel.innerHTML = 'in focus';
      ShowCursor();
    }
    function OnBlur(){
      inFocusLabel.innerHTML = 'out of focus';
      HideCursor();
    }
    
    // dealing with input
    function KeyDown(event){
      // WLogger.inform('key down:', event.keyCode);
      
      var keycode = event.which || event.keyCode;
      const specialCharacters = [8, 37, 38, 39, 40, 13];
      
      ScrollToBottom();
    
      if(specialCharacters.indexOf(keycode) == -1) return true;
    
      ProcessSpecialCharacter(keycode);
      event.preventDefault();
      return false;
    }
    function ProcessSpecialCharacter(keycode){
      if(keycode === 8) RemoveLetter();
      else if(keycode === 13) ExecuteInput();
      else if(keycode === 38) SetCommandFromMemory( 1);
      else if(keycode === 40) SetCommandFromMemory(-1);
      else if(keycode === 37) MoveCursor( 1);
      else if(keycode === 39) MoveCursor(-1);
    }
    function KeyPressed(event){
      // WLogger.inform('key pressed event', event.keyCode);
      var keycode = event.which || event.keyCode;
      var character = String.fromCharCode(keycode);
    
      // force unicode
      if(character.match(/^[\u0020-\u007e\u00a0-\u00ff]*$/) === null)
        return
      
      AddLetter(character);
    }
    
    function RemoveLetter(){
      var cursor = currentLineValue.length - cursorIndex;
      if(cursor === 0) return;
      currentLineValue = currentLineValue.slice(0, cursor - 1) + currentLineValue.slice(cursor);
      UpdateInputText();
    }
    function AddLetter(character){
      var cursor = currentLineValue.length - cursorIndex;
      currentLineValue = currentLineValue.slice(0, cursor) + character + currentLineValue.slice(cursor);
      UpdateInputText();
    }
    
    // cursor things
    function MoveCursor(direction){
      if(cursorElem === undefined) return;
      
      var newCursorIndex = cursorIndex + direction;
      
      if(newCursorIndex < 0) return;
      if(newCursorIndex > currentLineValue.length) return;
      
      cursorIndex = newCursorIndex;
      UpdateCursorPosition();
    }
    function UpdateCursorPosition(){
      if(cursorElem === undefined) return;
      
      var cursor = currentLineValue.length - cursorIndex;
      var position = MOUNTSTRING.length + cursor;
      cursorElem.style.left = CURSORWIDTH * position;
      ResetCursorFlash();
    }
    function ResetCursorFlash(){
      if(cursorElem === undefined) return;
      
      clearInterval(cursorInterval);
      cursorFlashState = false;
      cursorInterval = setInterval(FlashCursor, CURSORFLASH);
      FlashCursor();
    }
    function FlashCursor(){
      if(cursorElem === undefined) return;
      
      cursorFlashState = !cursorFlashState;
      cursorElem.style.display = cursorFlashState ? 'block' : 'none';
    }
    function RemoveCursor(){
      if(cursorElem === undefined) return;
      cursorElem.parentElement.removeChild(cursorElem);
    }
    function ShowCursor(){
      if(cursorElem === undefined) return;
      ResetCursorFlash();
    }
    function HideCursor(){
      if(cursorElem === undefined) return;
      
      clearInterval(cursorInterval);
      cursorFlashState = true;
      FlashCursor();
    }
    
    function SetCommandFromMemory(direction){
      var newMemoryIndex = memoryIndex + direction;
      
      if(newMemoryIndex > commandMemory.length) return;
      if(newMemoryIndex < 0) return;
      
      if(newMemoryIndex == 0 && memoryIndex != 0){
        memoryIndex = 0;
        currentLineValue = originalMemoryValue;
        UpdateInputText();
        return;
      } 
      
      if(memoryIndex == 0)
        originalMemoryValue = currentLineValue;
      memoryIndex = newMemoryIndex;
      
      var shiftedIndex = memoryIndex - 1;
      var flippedIndex = commandMemory.length - 1 - shiftedIndex;
      var oldCommand = commandMemory[flippedIndex];
      currentLineValue = oldCommand;
      UpdateInputText();
    }
    
    function CreateNewInputLine(){
      currentLineValue = '';
      memoryIndex = 0;
      cursorIndex = 0;
      
      inputLine = CreateElement('div', { 'class':'line' });
      
      var handleElem = CreateElement('span', { 'class':'mount' }, MOUNTSTRING);
      inputLine.appendChild(handleElem);
      
      inputTextSpan = CreateElement('span');
      inputLine.appendChild(inputTextSpan);
      
      cursorElem = CreateElement('cursor');
      inputLine.appendChild(cursorElem);

      AddLine(inputLine);
      UpdateCursorPosition();
    }
    function MayType(){
      return inputLine !== undefined;
    }
    function UpdateInputText(){
      if(!MayType()) return false;
      inputTextSpan.innerHTML = FormatTextForHTML(currentLineValue);
      UpdateCursorPosition();
      return true;
    }
    function ExecuteInput(){
      RemoveCursor();
      
      try{
        if(currentLineValue.replace(/\s|\n/g, '').length !== 0)
          commandMemory.push(currentLineValue);
        
        var response = parser.execute(currentLineValue);
        if(response !== undefined) PrintOutput(response);
      }catch(e){
        console.warn('Execution threw:', e);
      }
      CreateNewInputLine();
    }
    function PrintOutput(text){
      var line = CreateElement('div', { 'class':'line' }, FormatTextForHTML(text));
      AddLine(line);
    }
    
    // dealing with WLogger output
    function BindLogger(){
      WLogger.listen('inform', OnInform);
      WLogger.listen('warn', OnWarn);
      WLogger.listen('error', OnError);
    }
    function OnInform(event){
      ShowLogMessage('INFO', event.handle, event.message, event.extras);
    }
    function OnWarn(event){
      ShowLogMessage('WARN', event.handle, event.message, event.extras);
    }
    function OnError(event){
      ShowLogMessage('ERRO', event.handle, event.message, event.extras);
    }
    function ShowLogMessage(level, handle, message, extras){
      var line = CreateElement('div', { 'class':'line' });
      
      var levelElem = CreateElement('span', { 'class':'level '+level }, level);
      line.appendChild(levelElem);
      
      line.appendChild(document.createTextNode(' '));
      
      var handleElem = CreateElement('span', { 'class':'systemmount' }, handle);
      line.appendChild(handleElem);
      
      line.appendChild(document.createTextNode(' ' + message));
      
      var extraString = ' ' + extras.join(' ');
      var extraElem = CreateElement('span', { 'class':'colored' }, extraString);
      line.appendChild(extraElem);
      
      AddLine(line);
    }
    
    // adds lines to view
    function FormatTextForHTML(text){
      text = text.replace(/\t/g, '  ');
      text = text.replace(/ /g, '&nbsp;');
      text = text.replace(/\n/g, '<br/>');
      return text;
    }
    function AddLine(line){
      var wasAtBottom = IsAtBottom();
      lineWindow.appendChild(line);
      if(wasAtBottom) ScrollToBottom();
    }
    function IsAtBottom(){
      return shellWindow.parentElement.offsetHeight + shellWindow.scrollTop >= lineWindow.offsetHeight;
    }
    function ScrollToBottom(){
      shellWindow.scrollTop = lineWindow.offsetHeight;
    }
    
    // basic setup
    function LoadGUI(){
      shellWindow = CreateElement('div', { 'class':'wshell' });
      lineWindow = CreateElement('div', { 'class':'padding' });
      
      inFocusLabel = CreateElement('div', { 'class':'infocus' });
      OnBlur();
      
      shellWindow.appendChild(lineWindow);
      shellWindow.appendChild(inFocusLabel);
      frame.appendChild(shellWindow);
    }
    function CreateElement(elemType, attributes, innerHTML){
      var elem = document.createElement(elemType);
      
      for(var key in attributes){
        var attributeValue = attributes[key];
        elem.setAttribute(key, attributeValue);
      }
      
      if(innerHTML !== undefined)
        elem.innerHTML = innerHTML;
      
      return elem;
    }
    
    
    (function Constructor(_frame){
      if(_frame !== undefined && _frame !== null) frame = _frame;
      else frame = document.body;
      
      LoadGUI();
      BindLogger();
      
      WLogger.inform('WShell bound to WLogger.');
    }).apply(self, arguments);
  }
  
  BOOTLOADER.register({
    'identifier': 'WShell',
    'worker': WShell
  });
  
})();