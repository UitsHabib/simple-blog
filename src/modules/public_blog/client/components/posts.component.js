import React from 'react';
import "../../../../stylesheets/style.css";

function Posts({ posts }) {
    return (
        <div id="left_part">
            {
                posts.map(post => (
                    <>
                        <div style={{ marginLeft: '80px', marginBottom: '30px', marginTop: '40px' }}>
                            <h2 style={{ color: '#666' }}>{post.title}</h2>
                            <p style={{ color: 'orangered' }}>{`${post.created_at} by ${post.user.first_name} ${post.user.last_name}`}</p>
                            <p style={{ color: '#616161' }}>{post.content.substring(0, 300)}</p>
                            <input class="left_button" type="button" value="বিস্তারিত"/>
                        </div>
                        <hr style={{ marginLeft: '80px' }}/>
                    </>
                ))
            }
        </div>
    );
}

export default Posts;