// models/FAQ.mjs
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.mjs';

const FAQ = sequelize.define('WEL', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  img: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
 
}, {
  tableName: 'wel',
  timestamps: false,
});

export default FAQ;
