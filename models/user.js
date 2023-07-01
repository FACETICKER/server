import { Sequelize } from "sequelize";

class User extends Sequelize.Model{
    static initiate(sequelize){
        User.init({
            user_id:{
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            user_name:{
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            user_image:{
                type: Sequelize.TEXT,
                allowNull: false,
            },
            provider:{
                type: Sequelize.STRING(10),
                allowNull: false,
            },
            birthday:{
                type: Sequelize.DATE,
                allowNull: false,
            },
            join_date:{
                type: Sequelize.DATE,
                defaultVale: new Date(),
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