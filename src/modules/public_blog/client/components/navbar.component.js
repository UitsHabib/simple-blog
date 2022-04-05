import React from 'react';
import "../../../../stylesheets/style.css";

function TopNavbar({  }) {
    return (
        <div id="navbar">
            <div style={{ height: '100%', width: '50%', color: 'white' }}>
                <p style={{ marginLeft: '80px', fontSize: '25px', marginTop: '10px', color: 'lightgreen' }} > শাফায়েতের ব্লগ</p>
                <p style={{ marginLeft: '80px', marginTop: '-10px' }}>প্রোগ্রামিং, অ্যালগরিদম, ব্যাকএন্ড ইঞ্জিনিয়ারিং</p>
            </div>
            <div style={{ height: '100%', width: '50%', display: 'flex', color: 'white', fontWeight: 'bold', fontSize: '17px' }}>
                <p class="nav_option" style={{ marginLeft: '50px' }}>HOME</p>                   
                <P class="nav_option">অ্যালগরিদম নিয়ে যত লেখা!</P>
                <P class="nav_option">আমার সম্পর্কে</P>
            </div>
        </div>
    );
}

export default TopNavbar;