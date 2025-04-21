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
          value += char;
          i++;
          break;
        }
      }

      // Look ahead to next key (e.g., space followed by something like user.name:)
      if (char === " " && depth === 0 && str.slice(i + 1).match(/^\s*[\w.]+:/)) {
        flushPair();
      } else {
        value += char;
      }
    }

    i++;
  }

  flushPair(); // flush last key-value pair
  return obj;
}

// Test
const goMapStr = 'map[user.name:John Doe user.age:30 address.city:New York address.detail:map[street.name:5th Ave zip.code:10001] note:Works remotely]';
const result = parseGoMap(goMapStr);
console.log(result);
