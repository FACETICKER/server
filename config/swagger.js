import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
export const options = {
    swaggerDefinition : {
        info :{
            title : 'Faceticker',
            version : '1.0.0',
            description : "Faceticker API"
        },
        servers : [
            {
                url : 'http://localhost:8001',
            },
        ]
    },
    apis : ['config/swagger.js', 'src/app/user/*.js',]
};

const specs = swaggerJSDoc(options);

export default {
    swaggerUi, specs
};