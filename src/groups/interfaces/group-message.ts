import { GroupMessage } from 'src/groups/entities/group-message.entity';
import {
  CreateGroupMessageParams,
  DeleteGroupMessageParams,
  EditGroupMessageParams,
} from '../../utils/types';

export interface IGroupMessageService {
  createGroupMessage(params: CreateGroupMessageParams);
  getGroupMessages(id: string): Promise<GroupMessage[]>;
  deleteGroupMessage(params: DeleteGroupMessageParams);
  editGroupMessage(params: EditGroupMessageParams): Promise<GroupMessage>;
}
