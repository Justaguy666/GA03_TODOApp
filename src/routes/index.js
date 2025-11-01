import tasksRouter from './tasks.js'

function route(app) {
    app.use('/', tasksRouter);
}

export default route;