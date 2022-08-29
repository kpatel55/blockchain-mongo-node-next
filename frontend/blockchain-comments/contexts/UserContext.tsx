import {
  createContext,
  Dispatch,
  ReactElement,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Cookies } from "react-cookie";

interface UserContextType {
  currentUser: any;
  setCurrentUser: Dispatch<SetStateAction<any>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  authenticated: boolean;
  setAuthenticated: Dispatch<SetStateAction<boolean>>;
}

interface Props {
  children: ReactElement;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export default function UserProvider(props: Props) {
  const { children } = props;
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const cookies = new Cookies();
      const userCookie = cookies.get("user-auth");

      let jwt = false;

      if (userCookie) {
        jwt = !!userCookie.user.token;
        setAuthenticated(true);
      }
      if (!jwt) {
        cookies.remove("user-auth", { path: "/" });
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loading,
        setLoading,
        authenticated,
        setAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
