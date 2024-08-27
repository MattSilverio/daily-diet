
import { Model , DataTypes} from 'sequelize';
import { sequelize } from '../database.ts';
import { Meal } from './meal.ts';


export class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
    }
},
{
    sequelize,
    modelName: 'Users'
})

