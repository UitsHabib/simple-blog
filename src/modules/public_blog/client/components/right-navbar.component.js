import React from 'react';
import Categories from './categories.component';
import "../../../../stylesheets/style.css";

function RightNavbar({ categories }) {
    return (
        <div id="right_part">
            <div style={{ marginLeft: '30px' }}>
                <h4 style={{ fontWeight: 'bold', marginTop: '40px' }}>English Blog</h4>
                <h2 style={{ color: '#393939' }}>সাবস্ক্রাইব</h2>
                <hr style={{ color: '#f0f0f0' }}/>
                <div id="right_button">
                    <i style={{ backgroundColor: 'blue', color: 'white' }} class="fab fa-facebook-square"></i>
                    <i style={{ marginLeft: '10px', backgroundColor: '#7a7a7a' }} class="fab fa-github"></i>
                    <i style={{ marginLeft: '10px', backgroundColor: 'purple', color: 'white' }} class="fab fa-yahoo"></i>
                </div>
                <h5 style={{ marginTop: '10px' }}>Secured by <label style={{ color: 'blue' }}> OneAll Social Login </label></h5>
                
                <Categories categories={categories}/>
            </div>
        </div>  
    );
}

export default RightNavbar;