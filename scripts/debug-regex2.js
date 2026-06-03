const regex = /^[0-9,.\*@:]+(?:(?:cd|ab)?\/?\/?)?\s*$/;
console.log("Regex source:", regex.source);
console.log("Test '1,1.1 //':", regex.test('1,1.1 //'));
console.log("Test '1,1.1//':", regex.test('1,1.1//'));
console.log("Test '1.1 //':", regex.test('1.1 //'));
console.log("Test '1.002cd/':", regex.test('1.002cd/'));
console.log("Test '1,mang.1 //':", regex.test('1,mang.1 //'));

// Try alternative regex
const regex2 = /^[0-9,.\*@:]+(?:\s*\/\/)?\s*$/;
console.log("\nAlternative regex:", regex2.source);
console.log("Test '1,1.1 //':", regex2.test('1,1.1 //'));
console.log("Test '1,1.1//':", regex2.test('1,1.1//'));
console.log("Test '1.1 //':", regex2.test('1.1 //'));
console.log("Test '1.002cd/':", regex2.test('1.002cd/'));
console.log("Test '1,mang.1 //':", regex2.test('1,mang.1 //'));

// Try more permissive
const regex3 = /^[0-9,.\*@:]+.*?$/;
console.log("\nPermissive regex:", regex3.source);
console.log("Test '1,1.1 //':", regex3.test('1,1.1 //'));
console.log("Test '1.002cd/':", regex3.test('1.002cd/'));
console.log("Test '1,mang.1 //':", regex3.test('1,mang.1 //'));
