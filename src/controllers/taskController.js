const taskStorage = require('../models/taskStorage');

exports.getAllTasks = (req, res) => {
    const tasks = taskStorage.getAll();
    res.render('index', { tasks }); // Render the main page (index.ejs) with tasks
}

exports.markTask = (req, res) => {
    const id = parseInt(req.params.id);
    if (!isNaN(id)) {
        taskStorage.mark(id);
    }
    res.redirect('/'); // Redirect back to the tasks page
}

exports.createTask = (req, res) => {
    const taskDesc = req.body.description;
    if (taskDesc && taskDesc.trim() !== '') {
        taskStorage.add(taskDesc.trim());
    }
    res.redirect('/'); // Redirect back to the tasks page
}
