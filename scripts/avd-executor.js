let term = require( 'terminal-kit' ).terminal;
let shell = require('shelljs');

shell.config.silent = true;

let PATH_EMULATOR_FOLDER = `${process.env.ANDROID_HOME}\\emulator`;

let SCRIPTS = {
    LIST_AVDS: '.\\emulator -list-avds',
    START_AVD: (name) => `.\\emulator -avd ${name}`,
};

shell.cd(PATH_EMULATOR_FOLDER);

function getAvdsList() {

    let out = shell.exec(SCRIPTS.LIST_AVDS);

    let list = out.stdout
        .replace(/\n/, '')
        .split(/\r/);
    list.pop();

    list.map((v, i) => {
        list[i] = v.replace('\n', '');
    });

    return list
}


function startAvd(name, on, out) {

    let avdOut = shell.exec(SCRIPTS.START_AVD(name), {async: true}, out);
    avdOut.stdout.on('data', on);
}

// View

function menu(callback) {
    term.clear();

    term.green.bold("### AVD EXECUTOR ###\n");

    let avdsList = getAvdsList();

    let menuList = [...avdsList, 'Cancelar'];

    term.bold.cyan().singleColumnMenu(menuList, (err, resp) => {

        let respIdx = resp.selectedIndex;

        if(err || respIdx === 3) process.exit(0);

        callback(avdsList[respIdx])
    });
}

function execAvd(avdListName) {

    startAvd(avdListName,
        () => {
            term.clear();
            term.bold.green(`AVD "${avdListName}" EM EXECUÇÃO!`)
        },cod => { process.exit(cod) });
}


menu(execAvd);
