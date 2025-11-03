import taskStorage from '../models/taskStorage.js'

class TaskController {
    getTasks = (req, res) => {
        const tasks = taskStorage.getTasks();
        return res.status(200).json(tasks);
    }


    // markTask = (req, res) => {
    //     const id = parseInt(req.params.id);
    //     if (!isNaN(id)) {
    //         taskStorage.mark(id);
    //     }
    //     res.redirect('/'); 
    // }
}

export default new TaskController();
