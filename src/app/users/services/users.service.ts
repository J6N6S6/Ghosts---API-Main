import { Injectable } from '@nestjs/common';
import { UpdateUserDTO } from '../dtos/UpdateUserDTO';
import { AddInviteCodeCase } from '../useCases/add-invite-code/add_invite_code.case';
import { ApproveDocumentCase } from '../useCases/approve-document/approve_document.case';
import { ApproveDocumentDTO } from '../useCases/approve-document/approve_document.dto';
import { DeclineDocumentCase } from '../useCases/decline-document/decline_document.case';
import { DeclineDocumentDTO } from '../useCases/decline-document/decline_document.dto';
import { DocumentsControlCase } from '../useCases/documents-control/documents_control.case';
import { DocumentsControlDTO } from '../useCases/documents-control/documents_control.dto';
import { GetUserDocumentCase } from '../useCases/get-user-document/get_user_document.case';
import { GetUserIdentityCase } from '../useCases/get-user-identity/get_user_identity.case';
import { GetUserInvitesCase } from '../useCases/get-user-invites/get_user_invites.case';
import { GetUserTaxesCase } from '../useCases/get-user-taxes/get_user_taxes.case';
import { GetUserCase } from '../useCases/get-user/get_user.case';
import { ListUsersIndicatedCase } from '../useCases/list-users-indicated/list_users_indicated.case';
import { UpdateUserPhotoCase } from '../useCases/update-user-photo/update_user_photo';
import { UpdateUserTaxesCase } from '../useCases/update-user-taxes/update_user_taxes.case';
import { UpdateUserCase } from '../useCases/update-user/update_user.case';
import {
  UploadUserDocumentCase,
  UploadUserDocumentDTO,
} from '../useCases/upload-document/upload_document.case';
import { ChangeUserPhoneCase } from '../useCases/change-user-phone/change_user_phone.case';
import { ChangeUserPhoneDTO } from '../useCases/change-user-phone/change_user_phone.dto';
import { ValidateUserPhoneCase } from '../useCases/validate-user-phone/validate_user_phone.case';
import { ValidateUserPhoneDTO } from '../useCases/validate-user-phone/validate_user_phone.dto';
@Injectable()
export class UsersService {
  constructor(
    private readonly getUserCase: GetUserCase,
    private readonly updateUserPhotoCase: UpdateUserPhotoCase,
    private readonly getUserInvitesCase: GetUserInvitesCase,
    private readonly getUserDocumentCase: GetUserDocumentCase,
    private readonly updateUserCase: UpdateUserCase,
    private readonly updateUserTaxesCase: UpdateUserTaxesCase,
    private readonly getUserIdentityCase: GetUserIdentityCase,
    private readonly addInviteCodeCase: AddInviteCodeCase,
    private readonly listUsersIndicatedCase: ListUsersIndicatedCase,
    private readonly uploadUserDocumentCase: UploadUserDocumentCase,
    private readonly getUserTaxesCase: GetUserTaxesCase,
    private readonly approveDocumentCase: ApproveDocumentCase,
    private readonly declineDocumentCase: DeclineDocumentCase,
    private readonly documentsControlCase: DocumentsControlCase,
    private readonly changeUserPhoneCase: ChangeUserPhoneCase,
    private readonly validateUserPhoneCase: ValidateUserPhoneCase,
  ) {}

  async getUser(id: string) {
    return this.getUserCase.execute(id);
  }

  async updateUser(data: UpdateUserDTO) {
    return this.updateUserCase.execute(data);
  }

  async updateUserImage({
    image,
    user_id,
  }: {
    image: Buffer | null;
    user_id: string;
  }): Promise<{ image: string }> {
    return this.updateUserPhotoCase.execute(image, user_id);
  }

  async getUserDocument(user_id: string) {
    return await this.getUserDocumentCase.execute(user_id);
  }

  async getUserInvites(user_id: string) {
    return await this.getUserInvitesCase.execute(user_id);
  }

  async getUserIdentity(user_id: string) {
    return await this.getUserIdentityCase.execute(user_id);
  }

  async addInviteCode({
    user_id,
    invite_code,
  }: {
    user_id: string;
    invite_code: string;
  }) {
    return await this.addInviteCodeCase.execute({
      user_id,
      invite_code,
    });
  }

  async listUsersIndicated({
    user_id,
    page,
    limit,
  }: {
    user_id: string;
    page: number;
    limit: number;
  }) {
    return await this.listUsersIndicatedCase.execute({
      user_id,
      page,
      limit,
    });
  }

  async uploadUserDocument(data: UploadUserDocumentDTO) {
    return await this.uploadUserDocumentCase.execute(data);
  }

  async getUserTaxes(user_id: string) {
    return await this.getUserTaxesCase.execute(user_id);
  }

  async updateUserTaxes({
    user_id,
    tax_frequency,
  }: {
    user_id: string;
    tax_frequency: `${number}d`;
  }) {
    return await this.updateUserTaxesCase.execute({
      user_id,
      tax_frequency,
    });
  }

  async approveDocument(data: ApproveDocumentDTO) {
    return await this.approveDocumentCase.execute(data);
  }

  async declineDocument(data: DeclineDocumentDTO) {
    return await this.declineDocumentCase.execute(data);
  }

  async listDocumentsControl(data: DocumentsControlDTO) {
    return await this.documentsControlCase.execute(data);
  }

  async changeUserPhone(data: ChangeUserPhoneDTO) {
    return await this.changeUserPhoneCase.execute(data);
  }

  async validateUserPhone(data: ValidateUserPhoneDTO) {
    return await this.validateUserPhoneCase.execute(data);
  }
}
