import { Sequelize } from "sequelize";

class User extends Sequelize.Model{
    static initiate(sequelize){
        User.init({
            user_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_email:{
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            provider:{
                type: Sequelize.STRING(10),
                allowNull: false,
            },
        },{
            sequelize,
            timestamps: false,
            underscored: false,
            tableName: 'user',
            paranoide: false,
            charset: 'utf8',
            collage: 'utf8_general_ci',
        });
    }
    static associate(db){}
};

export default User;