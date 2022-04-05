import React from 'react';
import "../../../../stylesheets/style.css";

function TopNavbar({  }) {
    return (
        <div id="social_link">
            <div class="social_icon" style={{ marginLeft: '85%' }}>
                <i class="fab fa-facebook"></i>
            </div>

            <div class="social_icon">
                <i class="fab fa-twitter"></i>
            </div>

            <div class="social_icon">
                <i class="fab fa-linkedin-in"></i>
            </div>

            <div class="social_icon">
                <i class="fab fa-github"></i>
            </div>
        </div>
    );
}

export default TopNavbar;