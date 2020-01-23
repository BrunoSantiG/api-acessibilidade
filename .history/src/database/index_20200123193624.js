import Sequelize from "sequelize";

import databaseConfig from "../config/database";
import Tipo_Usuario from "../app/models/Tipo_Usuario";
import Usuario from "../app/models/Usuario";
import Tipo_Deficiencia from "../app/models/Tipo_Deficiencia";
import Curriculo from "../app/models/Curriculo";
import Endereco from "../app/models/Endereco";
import Usuario_Pcd from "../app/models/Usuario_Pcd";
import Empresa from "../app/models/Empresa";

const models = [
  Tipo_Usuario,
  Usuario,
  Tipo_Deficiencia,
  Curriculo,
  Endereco,
  Usuario_Pcd,
  Empresa
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();
