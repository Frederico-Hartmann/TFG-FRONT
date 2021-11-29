import './Footer.css'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

export default props => 
    <footer className="footer">
        <span>Desenvolvido com <FontAwesomeIcon icon={faHeart} /> por Frederico Hartmann</span>
    </footer>