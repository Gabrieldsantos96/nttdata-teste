export const enum IUserRole {
  MANAGER = "MANAGER",
  CLIENT = "CLIENT",
  ADMIN = "ADMIN",
}

export const USER_ROLE: Record<string, string> = {
  MANAGER: "Gerente",
  CLIENT: "Cliente",
  ADMIN: "Administrador",
};

export const enum IUserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

export const SALE_STATUS = {
  Pending: "Pendente",
  Completed: "Finalizada",
  Cancelled: "Cancelada",
};

export const USER_STATUS: Record<string, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  SUSPENDED: "Suspenso",
};

export interface IUserProfileDto {
  id: string;
  refId?: string;
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
