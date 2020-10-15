import os
from bs4 import BeautifulSoup
arquivos = os.listdir('/Users/maria/Downloads/diarios2013-2018')
print len(arquivos)
print arquivos[0]
i = 0


while i < len(arquivos):
	if (arquivos[i].endswith)('.xml'):
		with open(arquivos[i]) as fp:
			soup = BeautifulSoup(fp, 'html.parser')
			tag = soup.article
			tag.name = "article"
			tag['numberPage'] = '0'
			tag['pubName'] = '0'
			tag['name'] = '0'
			tag['artType'] = 'ss'
			print(i)

			outFile = open(arquivos[i], 'w')

			outFile.writelines("<xml>")
			outFile.writelines(str(tag))
			outFile.writelines("</xml>")
			outFile.close()
	else : print('')
	i+=1



	



	
	

