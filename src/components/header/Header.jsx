import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useNavigate, useLocation } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import { googleLogout } from '@react-oauth/google';
import  google from'../../assets/googleIcon.svg';
import fallBack from '../../../src/assets/fallBack.jpg'

import {Image} from "react-bootstrap";
import axios from "axios";

import "./style.scss";
import { Button } from "react-bootstrap";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import logo from "../../assets/movix-logo.svg";
import filmix from "../../assets/logo-transparent-png.png";

const Header = () => {
    const [show, setShow] = useState("top");
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [query, setQuery] = useState("");
    const [showSearch, setShowSearch] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const [showloginButton, setShowloginButton] = useState(true);
  const [showlogoutButton, setShowlogoutButton] = useState(false);
  const [ user, setUser ] = useState([]);
  const [ profile, setProfile ] = useState([]);
  const [Gshow,GsetShow]=useState(false);



  const login = useGoogleLogin({
    onSuccess: codeResponse => {console.log(codeResponse,'nnmnm'); setUser(codeResponse);  ; 
    },
   
    onError: (error)=>

      console.log('Login Failed',error),
    
  });
  const logOut = () => {
    googleLogout();
    setProfile(null);
};

useEffect(
    () => {
        if (user) {
             axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                     headers: {
                         Authorization: `Bearer ${user.access_token}`,
                         Accept: 'application/json'
                     }
                 })
                 .then((res) => {
                     setProfile(res.data);
                     GsetShow(true);
                 })
                 .catch((err) => console.log(err));
         }
         
    },
    [ user ]
  );

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    const controlNavbar = () => {
        if (window.scrollY > 200) {
            if (window.scrollY > lastScrollY && !mobileMenu) {
                setShow("hide");
            } else {
                setShow("show");
            }
        } else {
            setShow("top");
        }
        setLastScrollY(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener("scroll", controlNavbar);
        return () => {
            window.removeEventListener("scroll", controlNavbar);
        };
    }, [lastScrollY]);

    const searchQueryHandler = (event) => {
        if (event.key === "Enter" && query.length > 0) {
            navigate(`/search/${query}`);
            setTimeout(() => {
                setShowSearch(false);
            }, 1000);
        }
    };

    const openSearch = () => {
        setMobileMenu(false);
        setShowSearch(true);
    };

    const openMobileMenu = () => {
        setMobileMenu(true);
        setShowSearch(false);
    };

    const navigationHandler = (type) => {
        if (type === "movie") {
            navigate("/explore/movie");
        } else {
            navigate("/explore/tv");
        }
        setMobileMenu(false);
    };

    return (
        <header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
            <ContentWrapper>
                <div className="logo" onClick={() => navigate("/")}>
                    <img src={filmix} alt="" />
                </div>
                <ul className="menuItems">
                    <li
                        className="menuItem"
                        onClick={() => navigationHandler("movie")}
                    >
                        Movies
                    </li>
                    <li
                        className="menuItem"
                        onClick={() => navigationHandler("tv")}
                    >
                        TV Shows
                    </li>
                    <li className="menuItem">
                        <HiOutlineSearch onClick={openSearch} />
                    </li>
                    <li className="menuItem">
                 
                    {profile && Gshow ? (
                    
                <>
                    {profile.picture?<img className='loginImg'src={profile.picture} alt="user image" />:
                    <img className='loginImg'src={fallBack} alt="user image" />

                        }
                    
                   
                    <span onClick={logOut} className='logOut'>Log out</span>
                </>
            ) : (
               
              <Button  onClick={() => login()} className='imgGoogle border-0'>
                
              <Image src={google}></Image>
              <span className="googleSign">Sign in</span>
            </Button>

                
            )}
           
                    </li>
                </ul>

                <div className="mobileMenuItems">
                    <HiOutlineSearch onClick={openSearch} />
                    {mobileMenu ? (
                        <VscChromeClose onClick={() => setMobileMenu(false)} />
                    ) : (
                        <SlMenu onClick={openMobileMenu} />
                    )}
                </div>
            </ContentWrapper>
            {showSearch && (
                <div className="searchBar">
                    <ContentWrapper>
                        <div className="searchInput">
                            <input
                                type="text"
                                placeholder="Search for a movie or tv show...."
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyUp={searchQueryHandler}
                            />
                            <VscChromeClose
                                onClick={() => setShowSearch(false)}
                            />
                        </div>
                    </ContentWrapper>
                </div>
            )}
        </header>
    );
};

export default Header;
