import Sequelize from 'sequelize';

export default {
    init: ()=>{
        const sequelize = new Sequelize('mysql://root:123456@localhost:3306/admin');
        let isConnected = false;
        // 预链接
        sequelize
        .authenticate()
        .then(() => {
            isConnected = true;
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
            isConnected = false;
        });
        global.Sequelize = Sequelize;
        global.sequelize = sequelize;
        global.isConnected = isConnected;
    }
}