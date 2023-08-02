import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scroll to the top of the page when pathname changes (waiting to game room to post-game)
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTo({
			top: 0,
			left: 0,
			behavior: 'instant'
		})
  }, [pathname]);

  return null;
}