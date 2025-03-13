import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation";

export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <ModalProvider>
        <Navigation />
        <div className="content-container">{isLoaded && <Outlet />}</div>
        <Modal />

        {/* Only Show These When User is Logged In */}
        {user && (
          <>
            {/* Mr. Krabs Image */}
            <img
              src="/images/krabs1.png"
              alt="Mr. Krabs"
              className="krabs-img"
            />
            {/* Krabby Patty Image */}
            <img
              src="/images/kp1.png"
              alt="Krabby Patty"
              className="patty-img"
            />
            {/* POOP! Message */}
            <div className="poop-message">
              <span className="poop-highlight">
                “Always remember, P. O. O. P. ---{" "}
              </span>
              <span className="poop-highlight">People Order Our Patties!"</span>
            </div>
          </>
        )}
      </ModalProvider>
    </>
  );
}
