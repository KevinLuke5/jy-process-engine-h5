function flatArr(arr: any[]): any[] {
  let result: any[] = []
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flatArr(arr[i]))
    } else {
      result = result.concat(arr[i])
    }
  }
  return result
}

function getValue(obj: any, ...props: any[]): any {
  if (props && props.length > 0) {
    props = flatArr(props)
  }
  if (props.length === 0 || !props) {
    return obj
  }
  if (typeof obj === 'undefined' || obj === null) {
    return false
  } else if (props) {
    // shift 修改原有数组，返回数组中的第一个
    return getValue(obj[props.shift()], props)
  }
  return true
}

export default getValue
