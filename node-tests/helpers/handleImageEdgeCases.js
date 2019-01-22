/**
 * Since these files are consumed by an ember app, the path to images doesn't
 * need to be relative to the markdown file. The filepath should be relative to
 * the public folder. But our link checker doesn't know that, so we have to correct
 * for it by stripping away punctuation in front of "images" and replacing it
 * with public. So, ../../images/whatever.png becomes public/images/whatever.png
 * @param  {[type]} normalized [description]
 * @param  {[type]} link       [description]
 * @return {[type]}            [description]
 */
module.exports = function (normalized, link) {
  if (normalized.includes('images')) {
    return `public/${link.substring(link.indexOf('images'))}`;
  }

  return normalized;
};
