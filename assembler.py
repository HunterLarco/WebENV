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
  ('END'   ,  31, False)
]

def ConvertAssemblyToByteCode(line):
  if len(line) == 0:
    return ''
  
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
    raise Exception('Unknown Command')
  
  _, code, hasparam = currentInst
  
  number = 0
  if hasparam:
    inst, number, *rest = line.split(' ')
    if len(rest) > 0:
      raise Exception('Unknown characters')
    number = int(number)
    if number >= 1 << dataBits:
      raise Exception('Parameter overflow')
  
  return '{0:0{1}b}'.format((code << dataBits) | number, dataBits + instBits)



with open('bytecode.txt', 'w') as bytecode:
  with open('assembly.txt', 'r') as programf:
    program = programf.read()
    lines = program.split('\n')

    for lineNumber, line in enumerate(lines):
      try:
        converted = ConvertAssemblyToByteCode(line)
        if len(converted) > 0:
          bytecode.write(converted)
          if lineNumber != len(lines) - 1:
            bytecode.write('\n')
      except Exception as e:
        print('Invalid Line Number: %s. Ignored' % (lineNumber+1))

print('Compilation Complete')


