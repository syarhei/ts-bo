import container from "../inversify/config";
import {TeamDAL} from "../src/DAL/TeamDAL";
import {TEAM_MODEL} from "../inversify/identifiers/common";

container.get<TeamDAL>(TEAM_MODEL);