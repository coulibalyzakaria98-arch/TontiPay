const fs = require('fs');
const content = fs.readFileSync('frontend-new/src/pages/AdminDashboard.jsx', 'utf-8');

let stack = [];
for (let i = 0; i < content.length; i++) {
  const char = content[i];
  if (char === '{') {
    stack.push({ char, i });
  } else if (char === '}') {
    if (stack.length === 0) {
      console.log(`Extra '}' at index ${i}`);
    } else {
      const last = stack.pop();
      if (last.char !== '{') {
        console.log(`Mismatched '}' at index ${i}, matches '${last.char}' from index ${last.i}`);
      }
    }
  } else if (char === '(') {
    stack.push({ char, i });
  } else if (char === ')') {
    if (stack.length === 0) {
      console.log(`Extra ')' at index ${i}`);
    } else {
      const last = stack.pop();
      if (last.char !== '(') {
        console.log(`Mismatched ')' at index ${i}, matches '${last.char}' from index ${last.i}`);
      }
    }
  }
}

while (stack.length > 0) {
  const last = stack.pop();
  console.log(`Unclosed '${last.char}' from index ${last.i}`);
}
