import router from ('express').Router();
import userRoutes from ('./user-routes');

router.use('/users', userRoutes);

module.exports = router;
