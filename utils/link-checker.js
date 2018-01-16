const readline = require('readline-promise')
const path = require('path')
const fs =require('fs');
var markdownLinkExtractor = require('markdown-link-extractor');

let allMdFilepaths = []
// https://stackoverflow.com/questions/25460574/find-files-by-extension-html-under-a-folder-in-nodejs
const walkFileTree = function(startPath,filter){
    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            walkFileTree(filename,filter); //recurse
        }
        else if (filename.indexOf(filter)>=0) {
            allMdFilepaths.push( {filepath: filename, links: findMarkdownLinks(filename)})
        };
    };
    return allMdFilepaths
};

const findMarkdownLinks = function(filepath) {
  var markdown = fs.readFileSync(filepath).toString();
  return links = markdownLinkExtractor(markdown);
}

const getBadRelativeUrls = function(fileObjs) {
  let results = []
  fileObjs.forEach(function(fileObj) {
    fileObj.links.forEach(function(link) {
      if (link.includes("http")) {
        // skip it
        return
      } else if (pathIsValid(fileObj.filepath, link)) {
        // console.log('valid')
        return
      } else {
        // console.log()
        results.push({fileToFix: fileObj.filepath, badLink: link})
      }
    })
  })
  return results
}

const pathIsValid = function(filepath, link) {
  let cleanedLink = link.includes('#') ? link.substring(0, link.lastIndexOf("#")) : link // remove anchor tags
  cleanedLink = cleanedLink.replace(/\/$/, "") // strip trailing slash
  let cleanedFilepath = filepath.substring(0, filepath.lastIndexOf("/"))
  let normalized = (path.normalize(cleanedFilepath + '/' + cleanedLink)).replace(/\/$/, "") // join root and relative path to create absolute path, and strip trailing slash
  normalized = normalized.includes('images') ? "public/" + link.substring(link.indexOf("images")) : normalized
  let exists = checkIfPathExists(normalized) || link[0] === "#" || checkIfPathExists(normalized + '.md')
  if (!exists && normalized.includes('image')) {
    // console.log(normalized)
  }
  return exists
}

checkIfPathExists = function getFileRealPath(s){
    try {return fs.realpathSync(s);} catch(e){return false;}
}

let filesAndLinks = walkFileTree('guides','.md');
let badUrls = getBadRelativeUrls(filesAndLinks)
console.log(badUrls)
console.log("how many to fix?", badUrls.length)
