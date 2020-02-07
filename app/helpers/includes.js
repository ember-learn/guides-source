import { helper } from '@ember/component/helper';

export default helper(([string = '', match]) => {
  return string.indexOf(match) !== -1;
});
