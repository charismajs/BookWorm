/**
 * Created by LuckyJS on 15. 10. 30..
 */
module.exports = function(express, config) {
  var service = require('./../services/service');
  var router = express.Router();

  router.route('/camera')
    .get(service.snapshot);

  router.route('/partials/*')
    .get(function(req, res) {
      res.render(config.path.client + '/' + req.params[0]);
    });

  router.route('/')
    .get(function(req, res) {
      res.render('index');
    });

  return router;
};