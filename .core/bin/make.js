const { readdir, readFile, writeFile, appendFile } = require('node:fs/promises');
const path = require('path');

console.log(`
    -----------------------------------
    -----------------------------------
        running make script
    -----------------------------------
    -----------------------------------
`);

const HTML_OUTPUT_NAME = 'index-new.html';
const BUILD_DIR = './build';

const checkFile = (file) => {
    if (!file) {
        console.log('No file provided');
        return;
    }

    const nameSplit = file.split('.');
    const lastEl = nameSplit[nameSplit.length - 1];

    if (lastEl == 'js' || lastEl == 'css' || lastEl == 'html') {
        return file;
    }
    
    return false;
}

/**
 * 
 * @param {ARRAY} files 
 * @param {STRING} destFile 
 */
const combineFiles = async (fileNames, destFile) => {
    const BUILD_PATH = path.resolve(BUILD_DIR);

    try {
        const pattern = /(\/\*# sourceMappingURL=data|\/\/# sourceMappingURL=data).*/gim;

        for (let i = 0; i < fileNames.length; i ++) {
            const file = fileNames[i];
            const split = file.split('.');
            const name = split[0];
            const ext = split.pop();
            
            const contents = await readFile(BUILD_PATH + '/' +  file, { encoding: 'utf8' });
            const finalHTMLStr = contents.replace(pattern, '');

            let c = ext == 'css' ? `<style type="text/css">` + finalHTMLStr + `</style>` : `<script>` + contents + `</script>`;

            await writeFile(path.resolve(`./build/_${1}_${name}.${ext}`), c);
        }

    } catch (err) {
        console.error(err.message);
    }
}

const updateHtml = async (fileName) => {
    let htmlStr = await readFile(path.resolve(BUILD_DIR, fileName), { encoding: 'utf8' });
        htmlStr = htmlStr.replace(new RegExp(/<script.*\><\/script>/, `gim`), `__SCRIPT__`);
        htmlStr = htmlStr.replace(new RegExp(/<link[ ]href="(.*).css"(.+)?>(?:<\/head>)/, `gim`), `__CSS__</head>`);

    await appendFile(path.resolve(`./build/${HTML_OUTPUT_NAME}`), htmlStr);
}

const read = async () => {
    const BUILD_PATH = path.resolve(BUILD_DIR);
    
    try {
        const validFiles = [];

        const files = await readdir(BUILD_PATH);
        for (const file of files) {
            const fileOk = checkFile(file);
            if (fileOk) {
                validFiles.push(fileOk);
            }
        }
        
        const jsFiles = validFiles.filter(e => e.endsWith('js'));
        const cssFiles = validFiles.filter(e => e.endsWith('css'));
        const htmlFile = validFiles.filter(e => e.endsWith('html'));

        const jsContent = await combineFiles(jsFiles, 'app');
        const cssContent = await combineFiles(cssFiles, 'app');

        await updateHtml(htmlFile[0]);
        
    } catch (err) {
        console.error(err);
    }
}

read();