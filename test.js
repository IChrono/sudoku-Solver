
const a = [["a","b"], ["c","d"]]

const b = [...a]
b[1][0]= "f"
console.log(a,b)