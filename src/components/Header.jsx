import React from 'react'
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


export default function Header(props) {
    const [isWideScreen, setIsWideScreen] = useState(true);
    const [expanded, setExpanded] = useState(false);

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        Cookies.remove('refresh_token');
        props.setLoggedIn(false);
        navigate('/Login');
    }

    useEffect(() => {
        const handleResize = () => {
            setIsWideScreen(window.innerWidth > 576); // Set the width breakpoint as per your requirement
        };

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Call handleResize once on initial render
        handleResize();

        // Clean up event listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="Header container-fluid sticky-top">
            <div className='row justify-content-between'>
                <div className="AppName column col-lg-4 col-md-4 col-sm-5 col-10">
                    <img src="/images/logo.png" alt="logo" width={"60px"} height={"60px"} />
                    <div className="mx-2">Swapi</div>
                </div>

                {!isWideScreen && <div className="mt-2 column col-lg col-md col-sm col" onClick={() => setExpanded(!expanded)}>
                    {!expanded ?
                        <img src="/images/menu.svg" alt="menu" style={{ color: "white" }} />
                        :
                        <img src="/images/up.svg" alt="close" style={{ color: "white" }} />}
                </div>}

                {!isWideScreen ?
                    (expanded &&
                        <>
                            <div className="mt-1 navbar column col-lg col-md col-sm col mx-4">
                                <div className='row links w-100 m-auto'>
                                    <div className='col column text-start'>
                                        <Link to="#" className='m-auto' onClick={handleLogout}>Logout</Link>
                                    </div>
                                </div>
                            </div>

                            <div className='mt-1 column col-lg col-md col-sm-12 col-12'>
                                {props.showSearch && <div className="SearchBox w-100">
                                    <img src="/images/search-icon.svg" alt="search" className="SearchIcon" />
                                    <input
                                        autoComplete='false'
                                        placeholder="Search Character..."
                                        value={props.searchQuery}
                                        onChange={props.onTextChange}
                                        className="SearchInput"
                                    />
                                    <img src="/images/close.png" alt="close" onClick={props.clearSearch} className="CloseIcon" />
                                </div>}
                            </div>
                        </>
                    )
                    :
                    <>
                        <div className="mt-1 navbar column col-lg col-md col-sm col mx-4">
                            <div className='row links justify-content-around w-100 m-auto'>
                                <div className='col column'>
                                    <Link to="#" className='m-auto' onClick={handleLogout}>Logout</Link>
                                </div>
                            </div>
                        </div>

                        <div className='mt-1 column col-lg col-md col-sm-12 col-12'>
                            {props.showSearch && <div className="SearchBox w-100">
                                <img src="/images/search-icon.svg" alt="search" className="SearchIcon" />
                                <input
                                    autoComplete='false'
                                    placeholder="Search Character..."
                                    value={props.searchQuery}
                                    onChange={props.onTextChange}
                                    className="SearchInput"
                                />
                                <img src="/images/close.png" alt="close" onClick={props.clearSearch} className="CloseIcon" />
                            </div>}
                        </div>
                    </>
                }
            </div>
        </div>
    )

}
