import React from 'react';
import Avatar from '../../Avatar/Avatar';
import Icon from '../../Icon/Icon';
import "./Navbar.scss"

const Navbar = (props) => {
    
    return (
        <>
        <div className="Navbar">
            <div className="wrapper">
                <div className="brand">
                    <h1>Maxgram</h1>
                </div>
                {/* <div className="search">
                    <input/>
                </div> */}
                <div className="actions">
                    <Icon type="home"/>
                    <Icon type="send"/>
                    <Icon type="compass"/>
                    <Icon type="add" onClick={props.onCreatePost}/>
                    <Avatar imageUrl="https://picsum.photos/200/200"/>
                </div>
            </div>
        </div>
        </>
    );
};

export default Navbar;