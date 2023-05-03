
const fs = require('fs');
const prompt = require('prompt-sync')();
const process = require('process');

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
    process.chdir('models');
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
    console.log(`Initializing models...`);
    console.log(`Add info in ${model_name}...`);
    let modelinfo = {};
    while (true) {
        let choice = showoptions();
        if (choice == 1) {
            let field_name = prompt("Enter the field name ");
            let field_type = showmodeloptions();
            modelinfo[field_name] = field_type;
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
        if (modelinfo[key] == 1) {
            modelinfo[key] = "String";
        }
        else if (modelinfo[key] == 2) {
            modelinfo[key] = "Number";
        }
        else if (modelinfo[key] == 3) {
            modelinfo[key] = "Date";
        }
        else if (modelinfo[key] == 4) {
            modelinfo[key] = "Boolean";
        }
        else if (modelinfo[key] == 5) {
            modelinfo[key] = "Array";
        }
        else if (modelinfo[key] == 6) {
            modelinfo[key] = "Object";
        }

    }
    generate_model_file(model_name, modelinfo);
    console.log(modelinfo);

}

function generate_model_file(model_name, modelinfo) {
    let data=`const mongoose = require('mongoose');
    const userSchema = new mongoose.Schema({
        id: { type: Number, unique: true },
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
    });
    let autoIncrement = 1;
    userSchema.pre('save', function (next) {
        if (this.isNew) {
            this.id = autoIncrement++;
        }
        next();
    });
    module.exports = mongoose.model('User', userSchema)`;
    let fd=fs.openSync(`${model_name}.js`, 'w');
    fs.writeFileSync(fd,data);
}
initialize_project();


