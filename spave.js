function parseGoMap(str) {
  str = str.trim();
  if (!str.startsWith("map[")) return str;

  const obj = {};
  let i = 4; // skip "map["
  let key = "";
  let value = "";
  let readingKey = true;
  let depth = 0;

  const flushPair = () => {
    if (key) {
      obj[key.trim()] = parseGoMap(value.trim());
      key = "";
      value = "";
      readingKey = true;
    }
  };

  while (i < str.length - 1) { // skip final ']'
    const char = str[i];

    if (readingKey) {
      if (char === ":") {
        readingKey = false;
      } else {
        key += char;
      }
    } else {
      if (char === "[" && str.slice(i - 3, i + 1) === "map[") {
        depth++;
      } else if (char === "]") {
        if (depth > 0) {
          depth--;
        } else {
          // End of current map
          value += char;
          i++;
          break;
        }
      }

      if (char === " " && depth === 0 && str[i + 1] && str.slice(i + 1).match(/^\w+:/)) {
        flushPair();
      } else {
        value += char;
      }
    }

    i++;
  }

  flushPair(); // flush last pair
  return obj;
}

// Test example:
const goMapStr = 'map[user:map[name:John Doe age:30] location:New York City notes:Working remotely since 2020]';
const result = parseGoMap(goMapStr);
console.log(result);
