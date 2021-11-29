import './NavItem.css'
import React from 'react'
import {Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default props => 
    <Link to={`${props.refer}`} onClick={props.onClick}>
        <FontAwesomeIcon icon={props.icon} /> {props.title}
    </Link>