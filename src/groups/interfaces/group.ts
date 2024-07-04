import { CreateGroupParams, FetchGroupsParams } from "src/utils/types";
import { Group } from "../entities/group.entity";



export interface IGroupService {
  createGroup(params: CreateGroupParams);
  getGroups(params: FetchGroupsParams): Promise<Group[]>;
  findGroupById(id: string): Promise<Group>;
  saveGroup(group: Group): Promise<Group>;
}