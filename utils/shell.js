const script = (md5) => `
#!/bin/bash

pwd
cd apps/${md5}
pwd
tar -xvzf app.tar.gz
rm app.tar.gz
pwd
npm install
node createConfigFiles.js
npm run build
`;

module.exports = script;
