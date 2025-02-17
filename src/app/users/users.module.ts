import { InfraModule } from '@/infra/infra.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { AdminDocumentsController } from './controllers/admin.documents.controller';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { AddInviteCodeCase } from './useCases/add-invite-code/add_invite_code.case';
import { ApproveDocumentCase } from './useCases/approve-document/approve_document.case';
import { ChangeUserPhoneCase } from './useCases/change-user-phone/change_user_phone.case';
import { DeclineDocumentCase } from './useCases/decline-document/decline_document.case';
import { DocumentsControlCase } from './useCases/documents-control/documents_control.case';
import { GetUserDocumentCase } from './useCases/get-user-document/get_user_document.case';
import { GetUserIdentityCase } from './useCases/get-user-identity/get_user_identity.case';
import { GetUserInvitesCase } from './useCases/get-user-invites/get_user_invites.case';
import { GetUserTaxesCase } from './useCases/get-user-taxes/get_user_taxes.case';
import { GetUserCase } from './useCases/get-user/get_user.case';
import { ListUsersIndicatedCase } from './useCases/list-users-indicated/list_users_indicated.case';
import { UpdateUserPhotoCase } from './useCases/update-user-photo/update_user_photo';
import { UpdateUserTaxesCase } from './useCases/update-user-taxes/update_user_taxes.case';
import { UpdateUserCase } from './useCases/update-user/update_user.case';
import { UploadUserDocumentCase } from './useCases/upload-document/upload_document.case';
import { ValidateUserPhoneCase } from './useCases/validate-user-phone/validate_user_phone.case';
@Module({
  imports: [InfraModule, HttpModule, AuthModule, ConfigModule],
  providers: [
    UsersService,
    ChangeUserPhoneCase,
    GetUserCase,
    UpdateUserPhotoCase,
    GetUserInvitesCase,
    GetUserDocumentCase,
    UpdateUserCase,
    GetUserIdentityCase,
    AddInviteCodeCase,
    ValidateUserPhoneCase,
    ListUsersIndicatedCase,
    UploadUserDocumentCase,
    GetUserTaxesCase,
    UpdateUserTaxesCase,
    ApproveDocumentCase,
    DeclineDocumentCase,
    DocumentsControlCase,
  ],
  controllers: [UsersController, AdminDocumentsController],
  exports: [UsersService],
})
export class UsersModule {}
