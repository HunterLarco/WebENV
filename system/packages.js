PACKAGES = [
  
  {
    'identifier': 'WFileBlob',
    'script': 'system/WFileBlob.js',
    'description': 'Holds raw file content in a blob format.'
  },
  
  {
    'identifier': 'WFile',
    'script': 'system/WFile.js',
    'description': 'Reads/writes files for the virtual environment'
  },
  
  {
    'identifier': 'WDirectory',
    'script': 'system/WDirectory.js',
    'description': 'Wraps drive directories to provide inspection methods'
  },
  
  {
    'identifier': 'WPath',
    'script': 'system/WPath.js',
    'description': 'Forms file paths used to reference directories and files.'
  },
  
  {
    'identifier': 'WLocalDrive',
    'script': 'system/WLocalDrive.js',
    'description': 'The equivalent of a C drive for WebENV. Uses LocalSession.'
  },
  
  {
    'identifier': 'WScripting',
    'script': 'system/WScripting.js',
    'description': 'Lexigraphic interpreter for unix commands'
  },
  
  {
    'identifier': 'WShell',
    'script': 'system/WShell.js',
    'description': 'A shell interface for WScripting',
    'requires': ['system/WShell.css']
  },
  
  {
    'identifier': 'WShellCommand',
    'script': 'system/WShellCommand.js',
    'description': 'A wrapper for WShell commands'
  }
  
]