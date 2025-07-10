const script = (md5) => `
#!/bin/bash

cd apps
tar -xvzf ${md5}.tar.gz
rm ${md5}.tar.gz
cd ${md5}
npm install
node createConfigFiles.js
npm run build
`;

module.exports = script;
