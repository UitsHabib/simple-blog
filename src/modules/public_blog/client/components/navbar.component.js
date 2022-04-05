import React from 'react';
import "../../../../stylesheets/style.css";

function Navbar({  }) {
    return (
        <div id="navbar">
            <div style={{ height: '100%', width: '60%', color: 'white' }}>
                <p style={{ marginLeft: '80px', fontSize: '25px', marginTop: '10px', color: 'lightgreen' }} > শাফায়েতের ব্লগ</p>
                <p style={{ marginLeft: '80px', marginTop: '-10px' }}>প্রোগ্রামিং, অ্যালগরিদম, ব্যাকএন্ড ইঞ্জিনিয়ারিং</p>
            </div>
            <div style={{ height: '100%', width: '40%', display: 'flex', color: 'white', fontWeight: 'bold', fontSize: '17px' }}>
                <p class="nav_option" style={{ marginLeft: '50px' }}>HOME</p>                   
                <p class="nav_option">অ্যালগরিদম নিয়ে যত লেখা!</p>
                <p class="nav_option">আমার সম্পর্কে</p>
            </div>
        </div>
    );
}

export default Navbar;