import os
from xml.etree import ElementTree as ET
# files are in a sub folder where this script is being ran
path = "/Users/maria/Downloads/diarios2013-2018"
cont = 0
f = open('ELECTROLUX.txt','w')
suframa = open('SUFRAMA.txt','w')
manaus = open('MANAUS.txt','w')
eluxama = open('ELUXAMA.txt','w')


for filename in sorted(os.listdir(path), key=None, reverse=True):
    
    # Only get xml files
    if not filename.endswith('.xml'): continue
    # I haven't been able to get it to work by just saying 'if filename.endswith('.xml')' only if not..
    fullname = os.path.join(path, filename)
    # This joins the path for each file it files so that python knows the full path / filename to trigger parser
    
    tree = ET.parse(fullname)
    # Parse the files..
    #print(tree)
    # Get the root of the XML tree structure
    root = tree.getroot()
    
   

    # Print the tags it finds from all the child elements from root
    #for child in root:
     #   print(child.tag, child.attrib)

    #for country in root.findall('Acrescer'):
     #   print('oi')        

    for neighbor in root.iter('texto'):
        print(cont)
        print(filename)

        cont += 1 
       # print(neighbor.text)    
        maria = neighbor.text
        mariapequeno = str(maria).lower()
        if str(mariapequeno).find('electrolux') != -1:
            
            for neighbor in root.iter('article'):
                dia = neighbor.get('pubdate')
                f.write(dia)
                f.write('@')    
            for neighbor in root.iter('identifica'):
                identificador = neighbor.text
                f.write(str(identificador))
                f.write('@')
                f.write(str(filename))
            f.write('@@')
        else:
          print('')
        
        palavra = neighbor.text
        palavrapequeno = str(palavra).lower()
        if str(palavrapequeno).find('suframa') != -1:
            
            for neighbor in root.iter('article'):
                dia = neighbor.get('pubdate')
                suframa.write(dia)
                suframa.write('@')    
            for neighbor in root.iter('identifica'):
                identificador = neighbor.text
                suframa.write(str(identificador))
                suframa.write('@')
                suframa.write(str(filename))
            suframa.write('@@')
        else:
          print('')

        palavras = neighbor.text
        palavrapequenos = str(palavras).lower()
        if str(palavrapequenos).find('superintendência da zona franca de manaus') != -1:
            
            for neighbor in root.iter('article'):
                dia = neighbor.get('pubdate')
                manaus.write(dia)
                manaus.write('@')    
            for neighbor in root.iter('identifica'):
                identificador = neighbor.text
                manaus.write(str(identificador))
                manaus.write('@')
                manaus.write(str(filename))
            manaus.write('@@')
        else:
          print('')

        letras = neighbor.text
        letraspequeno = str(letras).lower()
        if (str(letraspequeno).find('electrolux da amazônia') != -1 or str(letraspequeno).find('electrolux da amaz') != -1) :
            
            for neighbor in root.iter('article'):
                dia = neighbor.get('pubdate')
                eluxama.write(dia)
                eluxama.write('@')    
            for neighbor in root.iter('identifica'):
                identificador = neighbor.text
                eluxama.write(str(identificador))
                eluxama.write('@')
                eluxama.write(str(filename))
            eluxama.write('@@')
        else:
          print('')

f.close()    
suframa.close()
manaus.close()
eluxama.close()
        