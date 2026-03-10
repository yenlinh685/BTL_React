import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { useAppSelector } from "~/redux/hooks";
import { selectCurrentUser } from "~/redux/selectors";

const Interaction = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  return (
    <div className="flex items-center gap-2">
      {currentUser ? (
        <>
          <Button variant="outline">Quản lý tin đăng</Button>
          <Button variant="default">Đăng tin</Button>
        </>
      ) : (
        <>
          <Link to="/auth/login">
            <Button variant="outline">Đăng nhập</Button>
          </Link>
          <Button variant="default">Đăng ký</Button>
        </>
      )}
    </div>
  );
};

export default Interaction;
