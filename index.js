// tasks to do next time:
// 1. check if the default value provided is of same type as of the field
// 2. check if the field name is valid(should not start with number and should be having length greater than 1)
// 3. check if the field name is unique
// 4. check if the schemas names are different of not
// 5. check all the input provided by the user(1,2,3,4....) is valid or not
// overall handle invalid inputs in the models section of the code and finalize it.



const fs = require('fs');
const prompt = require('prompt-sync')();
const process = require('process');
const { exec } = require('child_process');





function remove_dir(dir_name) {
    fs.readdirSync(dir_name).forEach((f) => {
        if (f.includes('.')) {
            fs.rmSync(`${dir_name}/${f}`)
        }
        else {
            remove_dir(`${dir_name}/${f}`);
            fs.rmdirSync(`${dir_name}/${f}`);
        }
        return 0;
        // console.log(f);

    });
}


function initialize_project() {
    console.log('Initializing project...');
    let project_name = prompt('Name of the Project ');;
    let models = [];
    let models_size = prompt('Number of Models ');
    for (let i = 0; i < models_size; i++) {
        let model_name = prompt(`Name of the Model ${i + 1} `);
        models.push(model_name);
    }
    try {
        fs.mkdirSync(project_name);
    } catch (error) {
        if (error.code == "EEXIST") {
            remove_dir(project_name);
            fs.rmdirSync(project_name);
            fs.mkdirSync(project_name);
        }
    }
    process.chdir(project_name);
    // console.log(process.cwd());
    fs.mkdirSync('models');
    fs.mkdirSync('routes');
    exec('npm init -y', { 'shell': 'powershell.exe' }, (error, stdout, stderr) => {
        // console.log(stdout);
    })
    process.chdir('models');
    console.log(`Initializing models...`);
    for (let i = 0; i < models.length; i++) {

        initialize_models(models[i]);
    }
}

function showmodeloptions() {
    console.log("1. String");
    console.log("2. Number");
    console.log("3. Date");
    console.log("4. Boolean");
    console.log("5. Array");
    console.log("6. Object");
    let choice = prompt("Enter your choice ");
    if (choice != 1 && choice != 2 && choice != 3 && choice != 4 && choice != 5 && choice != 6) {
        console.log("Invalid choice");
        return showmodeloptions();
    }
    return choice;
}
function showoptions() {
    console.log("1. Add a Field ");
    console.log("2. Remove a Field ");
    console.log("3. return ");
    let choice = prompt("Enter your choice ");
    return choice;
}
function initialize_models(model_name) {

    console.log(`Add info in ${model_name}...`);
    let modelinfo = {};
    while (true) {
        let choice = showoptions();
        if (choice == 1) {
            let field_name = prompt("Enter the field name ");
            let field_type = showmodeloptions();
            modelinfo[field_name] = [field_type];
            let unique = prompt("Is the field unique? (y/n) ");
            if (unique == 'y') {
                modelinfo[field_name].push(true);
            }
            else {
                modelinfo[field_name].push(false);
            }
            let required = prompt("Is the field required? (y/n) ");
            if (required == 'y') {
                modelinfo[field_name].push(true);
            }
            else {
                modelinfo[field_name].push(false);
            }
            if (field_type == '1' || field_type == '2' || field_type == '4') {
                while(true)
                {
                    let default_value = prompt("Enter the default value ");
                    if(field_type==2)
                    {
                        if(Number(default_value)==NaN)
                        {
                            console.log("Invalid value");
                            continue;
                        }
                    }
                }
                modelinfo[field_name].push(default_value);
            }
            if (field_type == '2') {
                let autoincrement = prompt("Is the field autoincrement? (y/n) ");
                if (autoincrement == 'y') {
                    modelinfo[field_name].push(true);
                }
                else {
                    modelinfo[field_name].push(false);
                }
            }
            else {
                modelinfo[field_name].push(false);
            }
        }
        else if (choice == 2) {
            let field_name = prompt("Enter the field name ");
            delete modelinfo[field_name];
        }
        else {
            break;
        }
    }
    for (let key in modelinfo) {
        if (modelinfo[key][0] == 1) {
            modelinfo[key][0] = "String";
        }
        else if (modelinfo[key][0] == 2) {
            modelinfo[key][0] = "Number";
        }
        else if (modelinfo[key][0] == 3) {
            modelinfo[key][0] = "Date";
        }
        else if (modelinfo[key][0] == 4) {
            modelinfo[key][0] = "Boolean";
        }
        else if (modelinfo[key][0] == 5) {
            modelinfo[key][0] = "Array";
        }
        else if (modelinfo[key][0] == 6) {
            modelinfo[key][0] = "Object";
        }


    }
    generate_model_file(model_name, modelinfo);
    // console.log(modelinfo);

}

function generate_model_file(model_name, modelinfo) {
    console.log(modelinfo);
    let data = "const mongoose = require('mongoose');\n";
    let temp = `const ${model_name}Schema = new mongoose.Schema({\n});`;
    for (let key in modelinfo) {
        if (modelinfo[key].length == 5) {
            let field = `${key}: { type: ${modelinfo[key][0]}, unique: ${modelinfo[key][1]},required:${modelinfo[key][2]},default:'${modelinfo[key][3]}' },\n`;
            let ind = temp.indexOf('\n');
            temp = temp.slice(0, ind + 1) + field + temp.slice(ind + 1);
        }
        else {
            let field = `${key}: { type: ${modelinfo[key][0]}, unique: ${modelinfo[key][1]},required:${modelinfo[key][2]} },\n`;
            let ind = temp.indexOf('\n');
            temp = temp.slice(0, ind + 1) + field + temp.slice(ind + 1);
        }
    }
    let tmp = `\nlet autoIncrement = 1;
            ${model_name}Schema.pre('save', function (next) {
                if (this.isNew) {
                    
                    
                }
                next();
            });`
    for (let key in modelinfo) {
        if (modelinfo[key][modelinfo[key].length - 1]) {
            let ind = tmp.search('this.isNew');

            // let ind = tmp.indexOf('\n');
            tmp = tmp.slice(0, ind + 13) + `\nthis.${key} = autoIncrement++;\n` + tmp.slice(ind + 14);
        }
    }
    data = data + temp + tmp;
    data = data + `\nmodule.exports = mongoose.model('${model_name}', ${model_name}Schema);`;
    // module.exports = mongoose.model('User', userSchema)`;
    let fd = fs.openSync(`${model_name}.js`, 'w');
    fs.writeFileSync(fd, data);
}
initialize_project();


