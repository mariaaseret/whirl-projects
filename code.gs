function myFunction() {
  
}

function onOpen() {  
  // Cria uma opção no menu
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var searchMenuEntries = [ {name: "Converter", functionName: "convertPdftoDoc"},{name: "Executar", functionName: "openreaddoc"} ];
  ss.addMenu("Listar", searchMenuEntries);
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

/*function extractTextFromPDF() {

  // PDF File URL
  // You can also pull PDFs from Google Drive
  var url = "https://img.labnol.org/files/Most-Useful-Websites.pdf";

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

  return text;
}*/

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

/* ####### GET DOCUMENT TEXT BASED ON REFERNCE CHARACTERS ######
 *
 * Creats an array of all the Google Doc documents text based on reference values.
 * This script requires a reference identifier start and end character set. The code will then
 * select the text inside the identifiers. I will either include the identifiers or not 
 * depending on your selection. 
 *
 * param {string} docID : The ID of the Google Doc, found in the URL.
 * param {object} identifier : An object containing the start and end identifiers to searh and if they should be included in the returned results.
 *
 * ## identifer object set up example ##
 *
 * {
 *   start: `{{`, // << add your start identifying charaters here.
 *   start_include: false, // << if you want the start identifier included change to true.
 *   end: `}}`, // << add your end identifying characters here. 
 *   end_include: false // << if you want the end identifier included change to true.
 * };
 *
 * returns {array} : Returns array of strings of characters found within identifiers.
 *
 */

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

//funcao que abre doc por doc de dentro da pasta que está esse sheets, verifica se contem a palavra no arquivo e retorna uma anotacao de nome e documento que esta palavra esta contida
function openreaddoc() {      
 // Recupera a planilha e a aba ativas
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ssid = ss.getId();
  
  // Procura dentro da mesma pasta da planilha atual
  var ssparents = DriveApp.getFileById(ssid).getParents();
  var sheet = ss.getActiveSheet(); 

  // Configura um título para apresentar os resultados
  var headers = [["Palavras encontradas", "Nome do arquivo", "URL do arquivo"]];
  sheet.getRange("A1:C").clear();
  sheet.getRange("A1:C1").setValues(headers);
  
  // Percorre todos os arquivos
  var folder = ssparents.next();
  var files = folder.getFiles();
  var i=1;
  
  while(files.hasNext()) {
    
    var file = files.next();
    if(ss.getId() == file.getId()){ 
      continue; 
    }
    
    var doc = DocumentApp.openById(file.getId());
    var body = doc.getBody();
    var text = body.getText();
    // vê se no texto tem a string e retorna true ou false 
    var n = text.includes("pdf");
    if (n == true){
      sheet.getRange(i+1, 1, 1, 3).setValues([['pdf',file.getName(), file.getUrl()]]);
    }
    //sheet.getRange(i+1, 1, 1, 4).setValues([[file.getLastUpdated(),file.getOwner().getName(),file.getName(), file.getUrl()]]);
    i++;
    
  }
  
}

//------------------------------------------------------------------