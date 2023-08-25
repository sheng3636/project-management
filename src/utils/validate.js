/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}
// 密码8-16位校验
export function validatePassword(rule, value, callback) {
  console.log(rule);
  if (!value) {
    callback(new Error('密码不能为空'))
  } else {
    // const reg = /^(?![^a-zA-Z]+$)(?!\D+$)(?![a-zA-Z0-9]+$).{8,16}$/
    const reg = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{4,16}/
    if (value.indexOf(' ') >= 0) {
      callback(new Error('不能包含空格'))
    } else if (!reg.test(value)) {
      callback(new Error('密码由4-16位数字、大写字母、小写字母和特殊符号组成!'))
    } else {
      callback()
    }
  }
}