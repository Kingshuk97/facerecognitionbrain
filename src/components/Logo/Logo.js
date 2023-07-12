import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import brain from './brain.png';

const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilt className='Tilt br2 shadow-2'>
                <div
                  className='pa3'
                  style={{ width: '150px', height: '150px' }}>
                    
                    <img
                      alt='logo'
                      src={brain}
                      style={{ paddingTop: '5px' }} />
                
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;