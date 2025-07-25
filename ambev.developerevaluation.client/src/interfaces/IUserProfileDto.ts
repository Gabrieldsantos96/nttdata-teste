export const enum IUserRole {
  MANAGER = "MANAGER",
  COSTUMER = "COSTUMER",
  ADMIN = "ADMIN",
}

export const USER_ROLE: Record<string, string> = {
  Gerente: "MANAGER",
  Cliente: "COSTUMER",
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
  id: string;
  roles: IUserRole[];
  user: IUserStatus;
}
