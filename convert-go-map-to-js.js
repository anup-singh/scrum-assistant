function parseGoMap(str) {
  str = str.trim();
  if (!str.startsWith("map[")) return str;

  const obj = {};
  let i = 4; // skip "map["
  let key = "";
  let value = "";
  let depth = 0;
  let readingKey = true;

  while (i < str.length - 1) { // skip final ']'
    const char = str[i];

    if (readingKey) {
      if (char === ":") {
        readingKey = false;
      } else {
        key += char;
      }
    } else {
      if (char === " " && depth === 0) {
        obj[key.trim()] = parseGoMap(value.trim());
        key = "";
        value = "";
        readingKey = true;
      } else {
        if (char === "[" && str.slice(i - 4, i) === "map[") {
          depth++;
        } else if (char === "]" && depth > 0) {
          depth--;
        }
        value += char;
      }
    }

    i++;
  }

  if (key) {
    obj[key.trim()] = parseGoMap(value.trim());
  }

  return obj;
}

// Example:
const goMapStr = 'map[user:map[name:John age:30] location:USA]';
const result = parseGoMap(goMapStr);
console.log(result);
