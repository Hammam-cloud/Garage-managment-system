import { useNavigate } from "react-router-dom";

function Logout({setNavbar}){
    setNavbar("login");
    const navigate = useNavigate();
    localStorage.removeItem('token');
    navigate("/login");

}export default Logout;