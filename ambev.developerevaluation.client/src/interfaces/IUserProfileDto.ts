export const enum IUserRole {
  MANAGER = "MANAGER",
  CLIENT = "CLIENT",
  ADMIN = "ADMIN",
}

export const USER_ROLE: Record<string, string> = {
  Gerente: "MANAGER",
  Cliente: "CLIENT",
  Administrador: "ADMIN",
};

export const enum IUserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

export const USER_STATUS: Record<string, string> = {
  Ativo: "ACTIVE",
  Inativo: "INACTIVE",
  Suspenso: "SUSPENDED",
};

export interface IUserProfileDto {
  refId: string;
  name: string;
  phone: string;
  role: IUserRole;
  status: IUserStatus;
}
