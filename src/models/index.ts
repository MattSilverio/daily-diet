import { User } from "./user.ts";
import { Meal } from "./meal.ts";

User.hasMany(Meal, {
    foreignKey: 'userId', 
    as: 'meals'
});

Meal.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

export {User, Meal};