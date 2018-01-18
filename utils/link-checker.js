/*
  This script can be run from the command line to check the validity of
  relative links in the markdown. Run with `node utils/link-checker.js`.
  It prints an array of objects to the console that show you which markdown
  file has a faulty link plus the link itself. It also reports the total incorrect
  links.
*/

const path = require('path')
const fs = require('fs');
const markdownLinkExtractor = require('markdown-link-extractor');
const dirToSearch = 'guides' // the path of the directory that has md files in it, relative to the working directory you are running the script from

let allMdFilepaths = [] // will be set to an array of objects like [{filepath: 'something/like/this.md', links: ['../a', '../b/c', 'd']}, ...]

/*
  walkFileTree is a recursive function that outputs an array of objects that
  look like {filepath: 'something/like/this.md', links: ['../a', '../b/c', 'd']}
  where filepath is a markdown file and links are an array of all links found
  in the file (relative and http). Uses synchronous file operations.
  Initial code from https://stackoverflow.com/questions/25460574/find-files-by-extension-html-under-a-folder-in-nodejs
*/
const walkFileTree = function(startPath,filter){
    if (!fs.existsSync(startPath)){
        console.log("not a valid directory path: ",startPath);
        return;
    }
    let files=fs.readdirSync(startPath);
    for(let i=0;i<files.length;i++){
        let filename=path.join(startPath,files[i]);
        let stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            walkFileTree(filename,filter); //recurse
        }
        else if (filename.indexOf(filter)>=0) {
            allMdFilepaths.push( {filepath: filename, links: findMarkdownLinks(filename)})
        };
    };
    return allMdFilepaths
};

/*
  findMarkdownLinks takes a string filepath to a markdown file, relative to the
  working directory the script was run from. It returns an array of link strings
  found in the markdown.
*/
const findMarkdownLinks = function(filepath) {
  let markdown = fs.readFileSync(filepath).toString();
  return links = markdownLinkExtractor(markdown);
}

/*
  getBadRelativeUrls takes an array of file objects like
  [{filepath: 'something/like/this.md', links: ['../a', '../b/c', 'd']}, ...]
  and returns an array of objects containing a "bad" link and the path to the markdown file
  that contains it, like [{fileToFix: 'path/to/file.md', badLink: '../something'}, ...]
  The function iterates over each object and its links array. For each link, it
  ignores any that are http, since the script only tests relative links.
  If the path to the link is incorrect relative to the working directory the
  script was run from, it is returned in the results.
*/
const getBadRelativeUrls = function(mdFiles) {
  let results = []
  mdFiles.forEach(function(mdFile) {
    mdFile.links.forEach(function(link) {
      if (link.includes("http" || link[0] === "#")) {
        // skip it if it's a url or just an anchor tag
        return
      } else if (!pathIsValid(mdFile.filepath, link)) {
        results.push({fileToFix: mdFile.filepath, badLink: link})
      }
    })
  })
  return results
}

/*
  pathIsValid takes in a path to a markdown file and a link contained in that file.
  It checks to see if the link is correct relative to the markdown file's path.
  Returns true if the link is an existing directory or markdown file.
*/

const pathIsValid = function(filepath, link) {
  let cleanedLink = stripOffAnchorTags(link)
  cleanedLink = removeTrailingSlash(cleanedLink)
  let cleanedFilepath = removeMarkdownFileFromFilepath(filepath)
  let normalized =  computeLinkRelativeToWorkingDir(cleanedFilepath, cleanedLink)
  normalized = handleImageEdgeCases(normalized, link)
  // return true if it is a valid path to a directory OR markdown file. No easy way to tell which is which, so try both
  return checkIfPathExists(normalized) || checkIfPathExists(normalized + '.md')
}

const stripOffAnchorTags = function(link) {
  return link.includes('#') ? link.substring(0, link.lastIndexOf("#")) : link
}

const removeTrailingSlash = function(cleanedLink) {
  return cleanedLink.replace(/\/$/, "") // strip trailing slash. $ is regex for "last"
}

const removeMarkdownFileFromFilepath = function(filepath) {
  return filepath.substring(0, filepath.lastIndexOf("/")) // chops off whatever is after the final slash
}

/*
  In order to know if a link in a markdown file is correct relative to the
  markdown file's location, you have to combine the path of the md file
  with the path of the link it contains.
  This function takes a markdown file path like guides/v1.13.0/components/blah,
  relative to the working directory where the script was run, and adds it together
  with the relative link contained in the file, like ../templates/foo. path.normalize
  is a Node method that takes a filepath like
  guides/v1.13.0/components/blah/../templates/foo. path.normalize and resolves it
  into guides/v1.13.0/templates/foo. The result is an absolute path with the
  root of the working directory the script is running in. Finally, the trailing
  slash is removed.
*/
const computeLinkRelativeToWorkingDir = function(cleanedFilepath, cleanedLink) {
  return (path.normalize(cleanedFilepath + '/' + cleanedLink)).replace(/\/$/, "")
}

/*
  Since these files are consumed by an ember app, the path to images doesn't
  need to be relative to the markdown file. The filepath should be relative to
  the public folder. But our link checker doesn't know that, so we have to correct
  for it by stripping away punctuation in front of "images" and replacing it
  with public. So, ../../images/whatever.png becomes public/images/whatever.png
*/
const handleImageEdgeCases = function(normalized, link) {
  if (normalized.includes('images')) {
    return "public/" + link.substring(link.indexOf("images"))
  } else {
    return normalized
  }
}

const checkIfPathExists = function getFileRealPath(s){
  try {
    return fs.realpathSync(s);
  } catch(e) {
    return false
  }
}

walkFileTree(dirToSearch, '.md');
let badRelativePaths = getBadRelativeUrls(allMdFilepaths)
console.log(badRelativePaths)
console.log("how many are left to fix?", badRelativePaths.length)
