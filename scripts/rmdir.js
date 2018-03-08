const fs = require('fs');
const path = require('path');

const target = path.join(process.cwd(), process.argv[2]);
rmDir(target);
console.log(`Deleted ${process.argv[2]}`);

function rmDir(dirPath) {
	let entries = fs.readdirSync(dirPath);
	if (entries.length > 0) {
		for (var i = 0; i < entries.length; i++) {
			var filePath = path.join(dirPath, entries[i]);
			if (fs.statSync(filePath).isFile()) {
				fs.unlinkSync(filePath);
			} else {
				rmDir(filePath);
			}
		}
	}
	fs.rmdirSync(dirPath);
}
