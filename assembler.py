instBits = 5
dataBits = 8
instructions = [
  ('LOAD'  ,   0, True ),
  ('STORE' ,   1, True ),
  ('ADD'   ,   2, True ),
  ('SUB'   ,   3, True ),
  ('MUL'   ,   4, True ),
  ('DIV'   ,   5, True ),
  ('MOD'   ,   6, True ),
  ('CMP'   ,   7, True ),
  ('LSHIFT',   8, True ),
  ('RSHIFT',   9, True ),
  ('AND'   ,  10, True ),
  ('OR'    ,  11, True ),
  ('NOT'   ,  12, False),
  ('XOR'   ,  13, True ),
  ('JUMP'  ,  14, True ),
  ('JUMPGT',  15, True ),
  ('JUMPEQ',  16, True ),
  ('JUMPLT',  17, True ),
  ('END'   , 31, False)
]

def ConvertAssemblyToByteCode(line):
  currentInst = ''
  
  for instruction in instructions:
    try:
      line.index(instruction[0])
      if not line.split(' ')[0] == instruction[0]:
        continue
      currentInst = instruction
      break
    except:
      continue
  else:
    try: 
      number = int(line)
    except:
      raise Exception('Unknown Command')
      
    if number >= 1 << dataBits:
      raise Exception('Number overflow')
    if number < 0:
      raise Exception('Positive integer required')
    
    return '{0:0{1}b}'.format(number, dataBits + instBits)
  
  _, code, hasparam = currentInst
  
  number = 0
  if hasparam:
    inst, number, *rest = line.split(' ')
    if len(rest) > 0:
      raise Exception('Unknown characters')
    number = int(number)
    if number >= 1 << dataBits:
      raise Exception('Parameter overflow')
    if number < 0:
      raise Exception('Positive integer required')
  
  return '{0:0{1}b}'.format((code << dataBits) | number, dataBits + instBits)




with open('bytecode.txt', 'w') as bytecode:
  output = []
  
  with open('assembly.txt', 'r') as programf:
    program = programf.read()
    lines = program.split('\n')

    for lineNumber, line in enumerate(lines):
      try:
        converted = ConvertAssemblyToByteCode(line)
        if len(converted) > 0:
          output.append(converted)
      except Exception as e:
        print('Invalid Line Number: %s. %s' % (lineNumber+1, e))
  
  bytecode.write('\n'.join(output))


print('Compilation Complete')


