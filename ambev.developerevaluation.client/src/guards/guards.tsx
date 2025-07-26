import { useSession } from "@/contexts/session-provider";
import type { IUserRole } from "@/interfaces/IUserProfileDto";
import { UnauthorizedComponent } from "./unauthorized-access";

export function Authorize(
  Component: React.ComponentType<any>,
  allowedRoles: IUserRole[]
) {
  return function Guard(props: any) {
    const { applicationUser } = useSession();

    const hasRequiredRole =
      Array.isArray(applicationUser?.roles) &&
      applicationUser?.roles?.some((role: IUserRole) =>
        allowedRoles.includes(role)
      );

    if (!hasRequiredRole) {
      return <UnauthorizedComponent />;
    }

    return <Component {...props} />;
  };
}
