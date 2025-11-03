import tasksRouter from './tasks.js'
import apiRouter from './api.js'

function route(app) {
    app.use('/api', apiRouter);
    app.use('/', tasksRouter);
}

export default route;