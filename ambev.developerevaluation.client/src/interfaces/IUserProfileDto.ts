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
  id: string;
  email: string;
  name: {
    firstName: string;
    lastName: string;
  };
  userName: string;
  phone: string;
  role: IUserRole;
  status: IUserStatus;
  createdAt: string;
  updatedAt?: string;
  address: {
    city: string;
    street: string;
    zipcode: string;
    number: string;
    geo: string;
  };
}
