function myFunction() {
  
}

function onOpen() {  
  // Cria uma opção no menu
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var searchMenuEntries = [  {name: "Adicionar Palavras", functionName: "readwords"},{name: "Converter PDF", functionName: "convertPdftoDoc"},{name: "Executar Busca", functionName: "openreaddoc"} ];
  ss.addMenu("Buscas no Drive", searchMenuEntries);
  var searchMenuEntries2 = [  {name: "Adicionar Palavras", functionName: "readwords"},{name: "Adicionar links", functionName: "readlinks"},{name: "Executar Busca", functionName: "extractTextFromPDF"} ];
  ss.addMenu("Buscas nos Links", searchMenuEntries2);
}



function listFiles() {
  // Recupera a planilha e a aba ativas
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ssid = ss.getId();
  
  // Procura dentro da mesma pasta da planilha atual
  var ssparents = DriveApp.getFileById(ssid).getParents();
  var sheet = ss.getActiveSheet();
  
  // Configura um título para apresentar os resultados
  var headers = [["Atualizado em", "Proprietário", "Nome do arquivo", "URL do arquivo"]];
  sheet.getRange("A1:D").clear();
  sheet.getRange("A1:D1").setValues(headers);
  
  // Percorre todos os arquivos
  var folder = ssparents.next();
  var files = folder.getFiles();
  var i=1;
  while(files.hasNext()) {
    var file = files.next();
    if(ss.getId() == file.getId()){ 
      continue; 
    }
    sheet.getRange(i+1, 1, 1, 4).setValues([[file.getLastUpdated(),file.getOwner().getName(),file.getName(), file.getUrl()]]);
    i++;
    
  }
}


//funcao para adicionar os links dos pdfs
function readlinks(){
  
  // Recupera a planilha e a aba ativas
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ssid = ss.getId();
  
  // Procura dentro da mesma pasta da planilha atual
  var ssparents = DriveApp.getFileById(ssid).getParents();
  var sheet = ss.getActiveSheet(); 
  
  var range = "B:B";

  var result = Sheets.Spreadsheets.Values.get(ssid, range);
  var numRows = result.values ? result.values.length : 0;

  var all = result.values;

  return [all,numRows];
}


function printarconteudos(){

  // Recupera a planilha e a aba ativas
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ssid = ss.getId();
  
  // Procura dentro da mesma pasta da planilha atual
  var ssparents = DriveApp.getFileById(ssid).getParents();
  var sheet = ss.getActiveSheet(); 
  
  var file = DriveApp.getFileById(ss.getId());
  var folders = file.getParents();
  
  // PDF File URL
  // You can also pull PDFs from Google Drive
  
  //acessando a funcao de leitura de palavras
  var valores = readlinks();
  var links = valores[0];
  var numRowsLinks = valores[1];
 
  for (var c = 0; c < numRowsLinks; c++) {
   
    sheet.getRange(c+1, 1, 1, 1).setValues([[links[c]]]); 
  
  }
  
}
function extractTextFromPDF() {
  // Recupera a planilha e a aba ativas
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ssid = ss.getId();
  
  // Procura dentro da mesma pasta da planilha atual
  var ssparents = DriveApp.getFileById(ssid).getParents();
  var sheet = ss.getActiveSheet(); 
  
  var file = DriveApp.getFileById(ss.getId());
  var folders = file.getParents();
  
  // PDF File URL
  // You can also pull PDFs from Google Drive
  
  //acessando a funcao de leitura de palavras
  var values = readlinks();
  var links = values[0];
  var numRowsLinks = values[1];
 
  for (var c = 0; c < numRowsLinks; c++) {
   
      var url = links[c];
  
  var blob = UrlFetchApp.fetch(url).getBlob();
  var resource = {
    title: blob.getName(),
    mimeType: blob.getContentType()
  };
  
  // Enable the Advanced Drive API Service
  var file = Drive.Files.insert(resource, blob, {ocr: true, ocrLanguage: "en"});
  
  // Extract Text from PDF file
  var doc = DocumentApp.openById(file.id);
  var text = doc.getBody().getText(); 
  var body = doc.getBody();
  
  var values1 = readwords();
  var all1 = values1[0];
  var numRows1 = values1[1];
  
  
  var conta=0;
  var i = 0;
  var keys=[];
  
  //preenchendo as keys com as palavras que digitei
  for (var k = 0; k < all1.length; k++) {
    keys[k] = all1[k];
  }
  
  var textopequeno = text.toLowerCase();
  for (j = 0; j < keys.length; j++) {
    if (textopequeno.includes(keys[j])) {
      
      sheet.getRange(c+conta+1, 1, 1, 2).setValues([[keys[j],"achei"]]); 
      conta++;
    }
  }
  
    
  
}

}

function findXtext() {
  var body = DocumentApp.getActiveDocument().getBody();
  var foundElement = body.findText("`{3}(arquivo)`{3}");
  
  while (foundElement != null) {
    // Get the text object from the element
    var foundText = foundElement.getElement().asText();
    
    // Where in the element is the found text?
    var start = foundElement.getStartOffset();
    var end = foundElement.getEndOffsetInclusive();
    
    // Set Bold
    foundText.setBold(start, end, true);
    
    // Change the background color to yellow
    foundText.setBackgroundColor(start, end, "#FCFC00");
    
    // Find the next match
    foundElement = body.findText("`{3}(arquivo)`{3}", foundElement);
  }
}

function pdfToDoc() {  
  var fileBlob = DriveApp.getFileById('0B3m2D6239t6aWHo5TVpyYzhxV1U').getBlob();  
  var resource = {
    title: fileBlob.getName(),
    mimeType: fileBlob.getContentType()
  };
  var options = {
    ocr: true
  };
  var docFile = Drive.Files.insert(resource, fileBlob, options);  
  Logger.log(docFile.alternateLink);  
}


function uploadFile() {
  var image = UrlFetchApp.fetch('http://goo.gl/nd7zjB').getBlob();
  var file = {
    title: 'google_logo.png',
    mimeType: 'image/png'
  };
  file = Drive.Files.insert(file, image);
  Logger.log('ID: %s, File size (bytes): %s', file.id, file.fileSize);
}


function getDocItems(docID, identifier){
  const body = DocumentApp.openById(docID).getBody();
  const docText = body.getText();
  
  //Check if search characters are to be included. 
  let startLen =  identifier.start_include ? 0 : identifier.start.length;
  let endLen = identifier.end_include ? 0 : identifier.end.length;
  
  
  //Set up the reference loop
  let textStart = 0;
  let doc = docText;
  let docList = [];
  
  //Loop through text grab the identifier items. Start loop from last set of end identfiers.
  while(textStart > -1){ 
    let textStart = doc.indexOf(identifier.start);
    
    if(textStart === -1){
      break;  
    }else{
      
      let textEnd = doc.indexOf(identifier.end) + identifier.end.length;
      let word = doc.substring(textStart,textEnd);
      
      doc = doc.substring(textEnd);
      
      docList.push(word.substring(startLen,word.length - endLen));
    };
  };
  //return a unique set of identifiers. 
  return [...new Set(docList)];
};


//------------------------------------------------------------------

//funcao que baixa o diario oficial de santa catarina sozinho
function downloadSC(){
  
  // The code below logs the value of the first byte of the Google home page.
  var response = UrlFetchApp.fetch("http://doe.sea.sc.gov.br/Portal/VisualizarJornal.aspx?cd=2410");
  return response.getContentText();
  
}

//funcao que converte todos os pdfs contidos na pasta para docs 
function convertPdftoDoc(){
  // Recupera a planilha e a aba ativas
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ssid = ss.getId();
  
  // Procura dentro da mesma pasta da planilha atual
  var ssparents = DriveApp.getFileById(ssid).getParents();
  var sheet = ss.getActiveSheet(); 
  // Percorre todos os arquivos
  var folder = ssparents.next();
  var files = folder.getFiles();
  var i=1;
  //var dir = DriveApp.getFolder();
  
  while(files.hasNext()) {
    var file = files.next();
    if(ss.getId() == file.getId()){ 
      continue; 
    }
    
    var fileBlob = DriveApp.getFileById(file.getId()).getBlob();  
    var resource = {
      title: fileBlob.getName(),
      "parents": [{'id':folder.getId()}],  
      mimeType: fileBlob.getContentType()
    };
    var options = {
      ocr: true
    };
    
    var docFile = Drive.Files.insert(resource, fileBlob, options); 
    // var dir = DriveApp.getFoldersByName('leitura dos pdfs').next();
    
    Logger.log(docFile.alternateLink); 
  }
  
}

//funcao para adicionar as palavras de busca
function readwords(){
  
  // Recupera a planilha e a aba ativas
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ssid = ss.getId();
  
  // Procura dentro da mesma pasta da planilha atual
  var ssparents = DriveApp.getFileById(ssid).getParents();
  var sheet = ss.getActiveSheet(); 
  
  var range = "A:A";
  
  //PRECISO TER ACESSO A PRMEIRA ABA AO INVES DA ABA ATIVA var result = Sheets.Spreadsheets.Values.get
  var info_sheet_example2 = SpreadsheetApp.getActiveSpreadsheet().getSheets()[1];
  
  var result = Sheets.Spreadsheets.Values.get(ssid, range);
  var numRows = result.values ? result.values.length : 0;
  //todos os valores contidos na coluna A
  var all = result.values;
  
  //var headers = [[all, all, all[2]]];
  //sheet.getRange("B1:D1").setValues(headers);
  //Logger.log(numRows);
  
  return [all,numRows];
}

//funcao que abre doc por doc de dentro da pasta que está esse sheets, verifica se contem a palavra no arquivo e retorna uma anotacao de nome e documento que esta palavra esta contida
function openreaddoc() {   
  
  
  //acessando a funcao de leitura de palavras
  var values = readwords();
  var all = values[0];
  var numRows = values[1];
  
  // Recupera a planilha e a aba ativas
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ssid = ss.getId();
  
  
  // Procura dentro da mesma pasta da planilha atual
  var ssparents = DriveApp.getFileById(ssid).getParents();
  var sheet = ss.getActiveSheet(); 
  
  var file = DriveApp.getFileById(ss.getId());
  var folders = file.getParents();
  
  
  // para retornar o link somente do pdf 
  // var folderId = "1z9M8pXLMNjHaOYf13wiKuZjcsMN6AwSs";
  var files = DriveApp.getFolderById(folders.next().getId()).getFiles();
  var result = [];
  while (files.hasNext()) {
    
    var file = files.next();
    if(file.getMimeType() == "application/pdf"){
      var temp = {
        url: "  https://drive.google.com/file/d/" + file.getId() + "/view" ,
        name: file.getName()
        
      };
      result.push(temp);}
    
  };
  
  
  // Configura um título para apresentar os resultados
  var headers = [["Palavras encontradas", "Nome do arquivo", "URL do arquivo"]];
  sheet.getRange("A1:C").clear();
  sheet.getRange("A1:C1").setValues(headers);
  
  
  // Percorre todos os arquivos
  var folder = ssparents.next();
  var files = folder.getFiles();
  var i=1;
  var conta = 1;
  while(files.hasNext()) {
    
    var file = files.next();
    if(ss.getId() == file.getId()){ 
      continue; 
    }
    
    var doc = DocumentApp.openById(file.getId());
    var body = doc.getBody();
    var text = body.getText();
    
    var keys=[];
    
    //preenchendo as keys com as palavras que digitei
    for (var k = 0; k < all.length; k++) {
      keys[k] = all[k];
    }
    
    /* var keys = ['distanciamento', 'atividade industrial', 'atividades industriais', 'produção', 'capacidade produtiva',
    'utilização de máscaras', 'epi', 'fornecimento de máscaras', 'distanciamento', 'isolamento',
    'transporte de cargas', 'vuc', 'veículos', 'cargas', 'distribuição', 'armazenamento', 'transporte de passageiros', 'veículos de transportes',
    'atividade comercial', 'atividades comerciais','atividades econômicas','estabelecimentos comerciais', 'estabelecimentos', 'shopping',
    'shopping center', 'shoppings center', 'centro comercial', 'centros comerciais', 'comércio de rua', 'comércio', 'loja', 'lojas', 'varejo',
    'assistências técnicas', 'serviços de manutenção', 'assistência mecânica', 'oficinas mecânicas','manuntenção de equipamentos', 'manutenção', 'manutenção de máquinas', 
    'manutenção de máquinas e equipamentos', 'manutenção de refrigeradores', 'manutenção de refrigeração', 'eletrodomésticos','procon', 'cade'];*/
    var textopequeno = text.toLowerCase();
    for (j = 0; j < keys.length; j++) {
      if (textopequeno.includes(keys[j])) {
        
        for(l = 0; l < result.length; l++){
          if(file.getName()+".pdf" == result[l].name){
            var iquals = result[l].url;}
        }      
        
        sheet.getRange(i+conta, 1, 1, 3).setValues([[keys[j],file.getName(), iquals]]); 
        conta++;
      }
    }
    
  
    i++;
  }
  
}

function savepdffrompage(){
  var doc = new jsPDF({
    orientation: 'landscape',
    unit: 'in',
    format: [4, 2]
  })
  
  doc.text('Hello world!', 1, 1)
  doc.save('two-by-four.pdf')
}

//------------------------------------------------------------------