import { container } from "tsyringe";

import FBSQLQuasagram from "../infra/database/firebaseSql/FBSQLQuasagram.ts";

container.registerSingleton("FBSQLQuasagram", FBSQLQuasagram);
