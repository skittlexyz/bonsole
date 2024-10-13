import moment from "moment";
import cliColor from "cli-color";
import { exec } from "child_process";

function log(text, type = "") {
    const logType = (
        type == "ok" ? cliColor.green("[✔]") :
            (type == "warn" ? cliColor.yellow("[⚠]") :
                (type == "error" ? cliColor.red("[❌]") :
                    cliColor.blue("[i]")
                )
            )
    );
    console.log(`${logType}`,
        moment().format('DD-mm-yyyy : hh:mm:ss'),
        "|", text
    );
}

function run(command) {
    if (!command || typeof command !== 'string') {
        return Promise.resolve("");
    }

    return new Promise((resolve, reject) => {
        exec(command, { enconding: "buffer"}, (err, stdout, stderr) => {
            console.log(stdout);
            resolve({ err, stdout, stderr });
        });
    });
}

export { log, run };