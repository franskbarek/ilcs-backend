const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',  // db file will be stored here
});

const Pungutan = sequelize.define('Pungutan', {
  primaryKey: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  nilaiFOB: DataTypes.FLOAT,
  asuransi: DataTypes.FLOAT,
  freight: DataTypes.FLOAT,
  CIF: DataTypes.FLOAT,
  CIFRp: DataTypes.FLOAT,
}, {
  tableName: 'pungutan',
});

sequelize.sync(); // create the table if doesn't exist

module.exports = { sequelize, Pungutan };
