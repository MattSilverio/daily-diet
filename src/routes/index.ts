import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { User, Meal } from "../models/index.ts"
import { EmptyResultError } from "sequelize";

interface IUser extends Omit<any, string> {
    id: number,
    name: string,
    email: string,
    age: number
}

interface IMeal extends Omit<any,string> {
    id: number,
    name: string,
    description: string,
    isDiet: boolean,
    userId: number
}

export function registerRoutes(app: FastifyInstance) {

    // criar usuario
    app.post('/user', async (req: FastifyRequest, res: FastifyReply) => {
        const userData: IUser = req.body as IUser;
        const response = await User.create(userData);
        res.send(response);
    })

    // // obter usuarios
    // app.get('/user', async (req: FastifyRequest, res: FastifyReply) => {
    //     const response = await User.findAll()
    //     res.send(response);
    // })

    // identificar usuario
    app.get('/user/:id', async (req: FastifyRequest, res: FastifyReply) => {
        const id  = Number(req.params.id);
        const response = await User.findByPk(id)
        res.send(response)
    })

    // listar todas refeicoes de um usuario
    app.get('/user/:id/metrics', async (req: FastifyRequest, res: FastifyReply) => {
        const userId = Number(req.params.id)
        const {rows , count} = await Meal.findAndCountAll({
            where: {
                userId: userId},
            order: [['datetime', 'ASC']]
            })

        const totalMealsInDiet = rows.filter(meal => meal.isDiet == true);
        const totalMealsOutDiet = count - totalMealsInDiet.length;
        const bestSequenceInDiet = totalMealsInDiet.reduce((acc, currentMeal, index, meals) => {
            if (index === 0) {
                return { current: 1, best: 1 };
            }
    
            const previousMeal = meals[index - 1];
            const currentMealDate = new Date(currentMeal.datetime);
            const previousMealDate = new Date(previousMeal.datetime);
    
            const isConsecutive = currentMealDate.getDate() === previousMealDate.getDate() &&
                                  currentMealDate.getMonth() === previousMealDate.getMonth() &&
                                  currentMealDate.getFullYear() === previousMealDate.getFullYear();
    
            if (isConsecutive) {
                acc.current++;
                acc.best = Math.max(acc.best, acc.current);
            } else {
                acc.current = 1;
            }
    
            return acc;
        }, { current: 1, best: 1 }).best;


        const userMetrics = {
            totalMeals: count,
            totalMealsInDiet: totalMealsInDiet.length,
            totalMealsOutDiet,
            bestSequenceInDiet
        }
        
        res.send(userMetrics)
    } )

    app.get('/user/:id/meals', async (req: FastifyRequest, res: FastifyReply) => {
        const userId = Number(req.params.id)
        const response = await Meal.findAll({
            where: {
                userId: userId
            }
        })

        res.send(response)
    })

    // registrar refeicao
    app.post('/meal', async (req: FastifyRequest, res: FastifyReply) => {
        const mealData: IMeal = req.body as IMeal
        const response = await Meal.create(mealData)
        res.send(response)
    })

    // editar refeicao
    app.put('/meal', async (req: FastifyRequest, res: FastifyReply) =>{
        const mealData: IMeal = req.body as IMeal
        
        try{
            const meal = await Meal.findByPk(mealData.id)
            
            if(!meal){
                throw new EmptyResultError(`Meal with id ${mealData.id} was not found`);
            } 
            const response = meal.update(mealData)
            res.send(response)
        }
        catch (err) {
            if (err instanceof EmptyResultError) {
                res.status(404).send({ error: err.message });
            } else {
                res.status(500).send({ error: 'An error occurred while updating the meal' });
            }
        }
    })
    
    // visualizar unica refeicao
    app.get('/meal/:id', async (req: FastifyRequest, res:FastifyReply) => {
        const response = await Meal.findByPk(req.params.id)
        res.send(response)
    })

    app.delete('/meal/:id', async (req: FastifyRequest, res: FastifyReply) => {
        const response = await Meal.destroy({
            where: {
                id: req.params.id
            }
        })
        res.send(response)
    })
}