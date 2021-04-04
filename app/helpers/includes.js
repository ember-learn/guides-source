import { helper } from '@ember/component/helper';

export default helper(function includes([string = '', query]) {
  return string.includes(query);
});
