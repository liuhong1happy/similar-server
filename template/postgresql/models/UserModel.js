const UserModel = sequelize.define('User', {
  name: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  }, 
  createDate: {
    type: Sequelize.STRING
  },
  modifyDate:{
    type: Sequelize.STRING
  }
});

export default UserModel;
